import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  OutlinedInput,
  Typography
} from '@material-ui/core';

import {
  QueryBuilder as QueryBuilderIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../../common/components/form_elements/button';
import { Redirect } from 'react-router-dom';
import { AssessmentAnswers } from '../contracts/assessment_answers';
import { Assessment } from '../../assessment/contracts/assessment_interface';
import {
  firstPatchAttemptAssessment,
  patchAttemptAssessment,
  checkAssessmentStatus,
  getAssessmentAnswers
} from '../helper/api';
import { connect } from 'react-redux';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';
import useAssessment from '../Hooks/useAssessment';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import Red from '@material-ui/core/colors/red';
import Blue from '@material-ui/core/colors/blue';
import Green from '@material-ui/core/colors/green';
import { AssessmentData } from '../contracts/AssessmentData';
import { DataTable } from '../components/DataTable';
import { NUMBER_PATTERN } from '../../common/validations/patterns';
import { exceptionTracker } from '../../common/helpers';
var Latex = require('react-latex');
const RedColor = Red[500];
const GreenColor = Green[600];
const BlueColor = Blue[500];

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      backgroundColor: '#ebebeb'
    },
    titleContainer: {
      backgroundColor: '#f6f6f6'
    },
    blueText: {
      color: '#518ef4'
    },
    blueBg: {
      backgroundColor: '#4285f4'
    },
    whiteColor: {
      color: 'white'
    },
    whiteBg: {
      backgroundColor: 'white'
    },
    questionButton: {
      marginLeft: '10px',
      marginTop: '10px',
      height: '50px',
      width: '50px',
      minWidth: '50px',
      borderRadius: '50%'
    },
    greyBorder: {
      borderLeft: 'lightgrey solid 1px'
    },
    blueColor: {
      backgroundColor: BlueColor,
      color: 'white'
    },
    redColor: {
      backgroundColor: RedColor,
      color: 'white'
    },
    greenColor: {
      backgroundColor: GreenColor,
      color: 'white'
    }
  })
);

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

const Student_Asessment_Test: FunctionComponent<Props> = ({
  authUser,
  location,
  history
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [
    data,
    setData,
    assessmentData,
    setAssessmentData,
    addUnfocussed,
    addUnfocussedTime,
    addVisitSection,
    addVisitQuestion,
    addTimeTakenQuestion,
    addAttemptsQuestion
  ] = useAssessment(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [redirectTo, setRedirectTo] = useState('');
  const [endTime, setEndTime] = useState<Date | null>(null);
  const unfocussedBool = useRef<boolean>(false);
  const currentSectionRef = useRef<number>(0);
  const currentQuestionRef = useRef<number>(0);
  const [submitBool, setSubmitBool] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [attemptedQuestions, setAttemptedQuestions] = useState<number[][]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[][][]>([]);
  const [
    assessmentAnswers,
    setAssessmentAnswers
  ] = useState<AssessmentAnswers | null>(null);

  const assessmentId = React.useRef<string | null>(null);
  const answersRef = React.useRef<string[][][] | null>(null);
  const assessmentDataRef = React.useRef<AssessmentData | null>(null);
  const attemptedQuestionsRef = React.useRef<number[][] | null>(null);
  const attemptAssessmentIdRef = React.useRef<string | null>(null);
  const submitBoolRef = React.useRef<boolean>(false);

  const optionLetterArray = ['A', 'B', 'C', 'D'];

  var interval: NodeJS.Timeout;
  var timeOut: NodeJS.Timeout;
  var saveTimer: NodeJS.Timeout;

  useEffect(() => {
    submitBoolRef.current = submitBool;
  }, [submitBool]);

  useEffect(() => {
    answersRef.current = answeredQuestions;
  }, [answeredQuestions]);

  useEffect(() => {
    attemptedQuestionsRef.current = attemptedQuestions;
  }, [attemptedQuestions]);

  useEffect(() => {
    assessmentDataRef.current = assessmentData;
  }, [assessmentData]);

  useEffect(() => {
    if (submitBool) {
      getAssessmentAnswersData(
        '?attemptassessmentId=' + attemptAssessmentIdRef.current
      );
    }
  }, [submitBool]);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        unfocussedBool.current = true;
        addUnfocussed();
      }
      if (document.visibilityState === 'visible') {
        unfocussedBool.current = false;
      }
    });
    // document.addEventListener('contextmenu', (e) => {
    //     e.preventDefault();
    //     enqueueSnackbar("Right click not allowed on this page",{variant:"info"})
    //   });

    return () => {
      window.removeEventListener('blur', () => {
        addUnfocussed();
      });
      document.removeEventListener('contextmenu', (e) => {
        e.preventDefault();
        enqueueSnackbar('Right click not allowed on this page', {
          variant: 'info'
        });
      });
    };
  }, []);

  const getAssessmentAnswersData = (QUERY: string) => {
    getAssessmentAnswers(QUERY)
      .then((response) => {
        setAssessmentAnswers(response);
      })
      .catch((err) => {
        exceptionTracker(err.response?.data.message);
        if (err.response?.status === 401) {
          setRedirectTo('/login');
        } else if (err.response?.data.code === 139) {
          setRedirectTo('/profile/' + authUser.mobileNo + '/assessments');
        }
      });
  };

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    interval = setInterval(() => {
      if (unfocussedBool.current) {
        addUnfocussedTime();
      } else {
        addTimeTakenQuestion(
          currentSectionRef.current,
          currentQuestionRef.current
        );
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    addVisitQuestion(currentSectionRef.current, currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    addVisitSection(currentSection);
  }, [currentSection]);

  useEffect(() => {
    checkAssessmentStatus(location.search)
      .then((response) => {
        if (!response.isStarted) {
          if (new Date(response.endDate) < new Date()) {
            enqueueSnackbar(
              'You have missed this assessment attempt period. Redirecting to Assessments',
              { variant: 'warning' }
            );
            history.push('/profile/assessments');
            return;
          } else if (
            !(
              new Date(response.startDate) < new Date() &&
              new Date(response.endDate) > new Date()
            )
          ) {
            enqueueSnackbar(
              'Please attempt test in assigned Time Window. Redirecting to Assessments',
              { variant: 'warning' }
            );
            history.push('/profile/assessments');
            return;
          }
        }
        if (response.isSubmitted) {
          if (new Date(response.solutionTime) > new Date()) {
            enqueueSnackbar(
              'Assessment already submitted. Please wait for solutions window. Redirecting to Assessments',
              { variant: 'warning' }
            );
            history.push('/profile/assessments');
            return;
          }
        }
        setData(response.assessment as Assessment);
        if (!response.isStarted) {
          setAttemptedQuestions(response.assessment.sections.map((el) => []));
        } else {
          setAttemptedQuestions(response.attemptedQuestions);
        }

        if (!response.isStarted) {
          setAnsweredQuestions(
            response.assessment.sections.map((section) =>
              new Array(section.questions.length).fill([])
            )
          );
        } else {
          setAnsweredQuestions(response.answers);
        }

        if (response.isStarted) {
          if (
            response.assessmentData !== null &&
            response.assessmentData !== undefined
          ) {
            setAssessmentData(response.assessmentData);
          }
        }
        if (!response.isStarted) {
          setEndTime(addMinutes(new Date(), response.assessment.duration));
        } else {
          setEndTime(response.endTime);
        }
        setSubmitBool(response.isSubmitted);
        assessmentId.current = response.assessment._id;
        attemptAssessmentIdRef.current = response._id;

        if (!response.isStarted) {
          patchFirstAssessment(response.assessment.duration);
        } else {
          if (new Date(response.endTime) < new Date()) {
            if (!response.isSubmitted) {
              submitAssessment();
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        exceptionTracker(err.response?.data.message);
        if (err.response?.status === 401) {
          setRedirectTo('/login');
        }
      });
  }, []);

  useEffect(() => {
    saveTimer = setInterval(() => {
      if (!submitBoolRef.current) {
        patchAssessment(false);
      }
    }, 60000);
    return () => {
      clearInterval(saveTimer);
    };
  }, []);

  const patchFirstAssessment = async (duration: number) => {
    const OngoingDoc: Object = {
      assessment: assessmentId.current,
      assessmentData: assessmentDataRef.current as AssessmentData,
      currentQuestion: currentQuestionRef.current,
      answers: answersRef.current,
      attemptedQuestions: attemptedQuestionsRef.current,
      endTime: addMinutes(new Date(), duration),
      isStarted: true
    };
    try {
      const response = await firstPatchAttemptAssessment(
        '?attemptassessmentId=' + attemptAssessmentIdRef.current,
        OngoingDoc
      );

      setLoading(false);

      return response;
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const patchAssessment = async (submitBoolean: boolean) => {
    const OngoingDoc: Object = {
      assessment: assessmentId.current,
      assessmentData: assessmentDataRef.current as AssessmentData,
      currentQuestion: currentQuestionRef.current,
      answers: answersRef.current,
      attemptedQuestions: attemptedQuestionsRef.current,
      isSubmitted: submitBoolean,
      isStarted: true
    };
    try {
      const response = await patchAttemptAssessment(
        '?attemptassessmentId=' + attemptAssessmentIdRef.current,
        OngoingDoc
      );
      if (submitBoolean) {
        setSubmitBool(true);
        history.push('/profile/assessments');
      }

      return response;
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };
  const submitAssessment = () => {
    patchAssessment(true);
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }
  const mainTimeoutRenderer = (renderProps: CountdownRenderProps) => {
    return (
      <React.Fragment>
        <Grid container item sm={4} xs={4} md={4} lg={4}>
          <Grid container justify="center">
            <Typography variant="h3">{zeroPad(renderProps.hours)}</Typography>
          </Grid>
          <Grid container justify="center">
            <Typography variant="body1">
              <span style={{ color: '#4285f4' }}>HOURS</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container item sm={4} xs={4} md={4} lg={4}>
          <Grid container justify="center">
            <Typography variant="h3">{zeroPad(renderProps.minutes)}</Typography>
          </Grid>
          <Grid container justify="center">
            <Typography variant="body1">
              <span style={{ color: '#4285f4' }}>MINUTES</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container item sm={4} xs={4} md={4} lg={4}>
          <Grid container justify="center">
            <Typography variant="h3">{zeroPad(renderProps.seconds)}</Typography>
          </Grid>
          <Grid container justify="center">
            <Typography variant="body1">
              <span style={{ color: '#4285f4' }}>SECONDS</span>
            </Typography>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <Container
      disableGutters
      maxWidth="xl"
      className={classes.whiteBg}
      style={{ height: '100vh' }}
    >
      {loading ? (
        <Dialog open={!loading}>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <React.Fragment>
          <Grid container style={{ height: '90vh' }}>
            {/* Top Container */}
            <Grid
              container
              item
              sm={11}
              xs={12}
              md={8}
              lg={9}
              className={classes.titleContainer}
              alignItems="center"
              justify="flex-start"
              style={{ height: '8vh' }}
            >
              {/* Title Container */}
              <Grid item sm={8} xs={9} md={2} lg={1}>
                <Box margin="10px 20px">
                  <Button
                    onClick={() => {
                      history.goBack();
                    }}
                    classes={{ root: classes.backButton }}
                    size="medium"
                  >
                    Back
                  </Button>
                </Box>
              </Grid>
              <Grid item sm={10} xs={10} md={8} lg={8}>
                <Box margin="10px 20px">
                  <Typography variant="h5">
                    <span className={classes.blueText}>Assessment Test : </span>
                    {data?.classname + ' - ' + data?.subjectname}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* Time Left Container */}
            <Grid
              container
              item
              xs={12}
              sm={11}
              md={4}
              lg={3}
              justify="center"
              alignItems="center"
              className={classes.blueBg}
              style={{ height: '8vh' }}
            >
              <Grid item xs={3} sm={2} md={2} lg={1}>
                <Box margin="13px 20px 10px 20px">
                  {submitBool ? null : (
                    <QueryBuilderIcon className={classes.whiteColor} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={10} sm={8} md={6} lg={5}>
                <Box margin="10px 20px">
                  <Typography variant="h5" className={classes.whiteColor}>
                    {submitBool ? 'Answers' : 'Time Left'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* Question container */}
            <Grid
              container
              item
              sm={11}
              xs={12}
              md={8}
              lg={9}
              justify="flex-start"
              alignContent="flex-start"
              spacing={0}
              style={{ height: '84vh', overflowY: 'auto', overflowX: 'auto' }}
            >
              <Grid item sm={11} xs={11} md={10} lg={10}>
                <Box marginTop="70px" marginLeft="70px">
                  <Grid container justify="space-between">
                    <Grid item lg={3} md={3} xs={12} sm={12}>
                      <Typography variant="button">
                        {data?.sections[currentSection].questions[
                          currentQuestion
                        ].type === 'numeric'
                          ? 'Numeric Question'
                          : data?.sections[currentSection].questions[
                              currentQuestion
                            ].type === 'multiple'
                          ? 'Multiple Choice Question'
                          : 'Single Choice Question'}
                      </Typography>
                    </Grid>
                    <Grid item lg={3} md={3} xs={12} sm={12}>
                      <Typography variant="button">
                        {'Marks: ' +
                          (data?.sections[currentSection].questions[
                            currentQuestion
                          ].marks == 0
                            ? 'None'
                            : data?.sections[currentSection].questions[
                                currentQuestion
                              ].marks.toString())}
                      </Typography>
                    </Grid>
                    <Grid item lg={3} md={3} xs={12} sm={12}>
                      <Typography variant="button">
                        {'Negative Marking: ' +
                          (data?.sections[currentSection].questions[
                            currentQuestion
                          ].negativeMarking == 0
                            ? 'None'
                            : data?.sections[currentSection].questions[
                                currentQuestion
                              ].negativeMarking.toString())}
                      </Typography>
                    </Grid>
                    <Grid item lg={3} md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => {
                          addAttemptsQuestion(
                            currentSectionRef.current,
                            currentQuestionRef.current
                          );

                          setAttemptedQuestions((prev) => {
                            console.log('HEre');

                            return prev.map((section, index) => {
                              if (index !== currentSection) {
                                console.log('here1');
                                return section;
                              } else {
                                console.log('here');
                                if (
                                  !section.includes(
                                    Number(currentQuestionRef.current)
                                  )
                                ) {
                                  return [
                                    ...section,
                                    currentQuestionRef.current
                                  ];
                                } else {
                                  return section;
                                }
                              }
                            }) as number[][];
                          });
                        }}
                      >
                        Mark for Review
                      </Button>
                    </Grid>
                  </Grid>

                  <Typography variant="h5">
                    <Latex fleqn={true}>
                      {(currentQuestion + 1).toString() +
                        '. ' +
                        data?.sections[currentSection].questions[
                          currentQuestion
                        ].questionDescription}
                    </Latex>
                  </Typography>
                  {data?.sections[currentSection].questions[
                    currentQuestion
                  ].imageLinks
                    ?.filter((el) => el.filename.substring(0, 1) === 'q')
                    .findIndex((val, ind) => ind === 0) !== -1 &&
                    data?.sections[currentSection].questions[
                      currentQuestion
                    ].imageLinks
                      .filter((el) => el.filename.substring(0, 1) === 'q')
                      .map((image) => {
                        const data = image.encoding;
                        return <img src={`data:image/jpeg;base64,${data}`} />;
                      })}
                </Box>
              </Grid>

              {data?.sections[currentSection].questions[currentQuestion]
                .type === 'numeric' ? (
                <Grid item sm={11} xs={11} md={10} lg={10}>
                  <Box width="20%" marginLeft="100px" marginTop="25px">
                    <FormControl>
                      <OutlinedInput
                        disabled={submitBool}
                        placeholder="Numerical Answer"
                        value={
                          answeredQuestions[currentSection][currentQuestion]
                            .length === 0 ||
                          answeredQuestions[currentSection][currentQuestion] ===
                            undefined
                            ? ''
                            : answeredQuestions[currentSection][
                                currentQuestion
                              ][0]
                        }
                        onChange={(
                          ev: React.ChangeEvent<{ value: unknown }>
                        ) => {
                          const val = ev.target.value as string;

                          if (NUMBER_PATTERN.test(val) === true || val === '') {
                            setAnsweredQuestions((prev) => {
                              return prev.map((section, index) => {
                                if (index !== currentSection) {
                                  return section;
                                } else {
                                  return section.map(
                                    (question, questionIndex) => {
                                      if (questionIndex != currentQuestion) {
                                        return question;
                                      } else {
                                        return [val] as string[];
                                      }
                                    }
                                  ) as string[][];
                                }
                              });
                            });
                          } else {
                            enqueueSnackbar('Only numerical answer allowed', {
                              variant: 'info'
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              ) : (
                <React.Fragment>
                  {[
                    data?.sections[currentSection].questions[currentQuestion]
                      .option1,
                    data?.sections[currentSection].questions[currentQuestion]
                      .option2,
                    data?.sections[currentSection].questions[currentQuestion]
                      .option3,
                    data?.sections[currentSection].questions[currentQuestion]
                      .option4
                  ]
                    .filter((el) => el?.length !== 0)
                    .map((option, optionIndex) => {
                      return (
                        <React.Fragment>
                          <Grid item sm={11} xs={11} md={10} lg={10}>
                            <Box display="flex" marginLeft="100px">
                              <Checkbox
                                checked={answeredQuestions[currentSection][
                                  currentQuestion
                                ].includes(optionLetterArray[optionIndex])}
                                disabled={submitBool}
                                onChange={(
                                  ev: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const val = ev.target.checked;
                                  setAnsweredQuestions((prev) => {
                                    return prev.map((section, index) => {
                                      if (index !== currentSection) {
                                        return section;
                                      } else {
                                        if (val) {
                                          return section.map(
                                            (question, questionIndex) => {
                                              if (
                                                questionIndex !==
                                                currentQuestion
                                              ) {
                                                return question;
                                              } else {
                                                if (
                                                  data?.sections[currentSection]
                                                    .questions[currentQuestion]
                                                    .type === 'multiple'
                                                ) {
                                                  return [
                                                    ...question,
                                                    optionLetterArray[
                                                      optionIndex
                                                    ]
                                                  ];
                                                } else {
                                                  return [
                                                    optionLetterArray[
                                                      optionIndex
                                                    ]
                                                  ];
                                                }
                                              }
                                            }
                                          );
                                        } else {
                                          return section.map(
                                            (question, questionIndex) => {
                                              if (
                                                questionIndex !==
                                                currentQuestion
                                              ) {
                                                return question;
                                              } else {
                                                return question.filter(
                                                  (val) =>
                                                    val !==
                                                    optionLetterArray[
                                                      optionIndex
                                                    ]
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    });
                                  });
                                }}
                              />
                              <Box component="h3" marginLeft="10px">
                                <Latex>{option}</Latex>
                                {data?.sections[currentSection].questions[
                                  currentQuestion
                                ].imageLinks
                                  ?.filter(
                                    (el) =>
                                      el.filename.substring(0, 1) ===
                                      (optionIndex + 1).toString()
                                  )
                                  .findIndex((val, ind) => ind === 0) !== -1 &&
                                  data?.sections[currentSection].questions[
                                    currentQuestion
                                  ].imageLinks
                                    .filter(
                                      (el) =>
                                        el.filename.substring(0, 1) ===
                                        (optionIndex + 1).toString()
                                    )
                                    .map((image) => {
                                      const data = image.encoding;
                                      return (
                                        <img
                                          src={`data:image/jpeg;base64,${data}`}
                                        />
                                      );
                                    })}
                              </Box>
                            </Box>
                          </Grid>
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              )}
              <Divider
                variant="fullWidth"
                style={{ width: '100%', marginTop: '20px', color: 'lightGray' }}
              />
              {assessmentAnswers !== null && (
                <React.Fragment>
                  <Grid item sm={11} xs={11} md={10} lg={10}>
                    <Box marginLeft="100px" marginTop="20px">
                      <Container
                        disableGutters
                        style={{ borderLeft: '2px dashed forestgreen' }}
                      >
                        <Box marginLeft="10px">
                          <Typography
                            variant="h6"
                            style={{ color: 'forestgreen' }}
                          >
                            SOLUTION
                          </Typography>
                          <Typography variant="body2">
                            <Latex displayMode trust>
                              {
                                assessmentAnswers[currentSection][
                                  currentQuestion
                                ].answerDescription
                              }
                            </Latex>
                          </Typography>
                          {data?.sections[currentSection].questions[
                            currentQuestion
                          ].imageLinks
                            ?.filter(
                              (el) => el.filename.substring(0, 1) === 's'
                            )
                            .findIndex((val, ind) => ind === 0) !== -1 &&
                            data?.sections[currentSection].questions[
                              currentQuestion
                            ].imageLinks
                              .filter(
                                (el) => el.filename.substring(0, 1) === 's'
                              )
                              .map((image) => {
                                const data = image.encoding;
                                return (
                                  <img src={`data:image/jpeg;base64,${data}`} />
                                );
                              })}
                        </Box>
                      </Container>
                    </Box>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>

            {/* Right Side Time */}
            <Grid
              container
              direction="column"
              item
              xs={12}
              sm={11}
              md={4}
              lg={3}
              justify="flex-start"
              className={classes.greyBorder}
              style={{ height: '84vh', overflowY: 'auto', overflowX: 'auto' }}
            >
              {submitBool ? null : (
                <React.Fragment>
                  <Box marginTop="30px">
                    <Grid container item xs={12} sm={12} md={12} lg={12}>
                      {endTime !== null ? (
                        <Countdown
                          date={endTime as Date}
                          renderer={mainTimeoutRenderer}
                          onComplete={() => {
                            submitAssessment();
                          }}
                        />
                      ) : null}
                    </Grid>
                  </Box>
                  <Divider style={{ width: '100%', marginTop: '20px' }} />
                </React.Fragment>
              )}

              <Grid
                container
                item
                justify="center"
                style={{ height: '10vh' }}
                alignItems="flex-start"
              >
                <Grid item sm={12} xs={12} md={12} lg={12}>
                  <Box marginTop="10px" marginLeft="5px">
                    <Typography variant="h6">Sections</Typography>
                  </Box>
                </Grid>
                {data?.sections.map((section, index) => {
                  return (
                    <Grid item sm={6} xs={12} md={4} lg={4} key={index}>
                      <Box marginTop="15px" marginLeft="10px">
                        <Button
                          onClick={() => {
                            if (
                              data?.sections[index].questions.length >=
                              currentQuestion
                            ) {
                              setCurrentSection(index);
                            } else {
                              setCurrentQuestion(0);
                              setCurrentSection(index);
                            }
                          }}
                          variant="contained"
                          size="small"
                          color={
                            currentSection === index ? 'primary' : 'default'
                          }
                        >
                          {section.title}
                        </Button>
                      </Box>
                    </Grid>
                  );
                })}
                <Divider style={{ width: '100%', margin: '10px auto 5px' }} />
              </Grid>

              {submitBool ? (
                <React.Fragment>
                  <Grid
                    container
                    item
                    justify="flex-start"
                    style={{ marginTop: '20px' }}
                  >
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                      <Box marginTop="20px" marginLeft="5px">
                        <Typography variant="h6">Answers</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    justify="flex-start"
                    style={{ display: 'flex', height: '420px' }}
                  >
                    {assessmentAnswers !== null && (
                      <DataTable
                        currentSection={currentSection}
                        answeredQuestions={answeredQuestions}
                        assessmentAnswers={assessmentAnswers}
                      />
                    )}
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid container item justify="flex-start">
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                      <Box marginTop="40px" marginLeft="5px">
                        <Typography variant="h6">Questions</Typography>
                      </Box>
                    </Grid>
                    {data?.sections[currentSection].questions.map(
                      (ques, index) => {
                        return (
                          <Grid item sm={4} xs={6} md={3} lg={2} key={index}>
                            <Button
                              onClick={() => {
                                setCurrentQuestion(index);
                              }}
                              variant="contained"
                              classes={{
                                root: clsx(
                                  classes.questionButton,
                                  currentQuestion === index
                                    ? classes.blueColor
                                    : answeredQuestions[currentSection][index]
                                        .length !== 0 &&
                                      answeredQuestions[currentSection][
                                        index
                                      ][0] !== ''
                                    ? classes.greenColor
                                    : attemptedQuestions[
                                        currentSection
                                      ]?.includes(Number(index)) &&
                                      classes.redColor
                                )
                              }}
                            >
                              {index + 1}
                            </Button>
                          </Grid>
                        );
                      }
                    )}
                  </Grid>

                  <Grid container justify="flex-start">
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box margin="20px 30px 10px 30px">
                        <Typography variant="body2">
                          <span
                            style={{
                              backgroundColor: '#4285f4',
                              height: '12px',
                              width: '12px',
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                          ></span>
                          <span
                            style={{ color: '#4285f4', marginLeft: '15px' }}
                          >
                            Current Question
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box margin="20px 30px 10px 30px">
                        <Typography variant="body2">
                          <span
                            style={{
                              backgroundColor: '#e31a1c',
                              height: '12px',
                              width: '12px',
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                          ></span>
                          <span
                            style={{ color: '#e31a15', marginLeft: '15px' }}
                          >
                            Marked
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box margin="10px 30px">
                        <Typography variant="body2">
                          <span
                            style={{
                              backgroundColor: '#33a02c',
                              height: '12px',
                              width: '12px',
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                          ></span>
                          <span
                            style={{ color: '#33a02c', marginLeft: '15px' }}
                          >
                            Answered Question
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box margin="10px 30px">
                        <Typography variant="body2">
                          <span
                            style={{
                              backgroundColor: '#ffffff',
                              borderColor: '#000',
                              borderWidth: '1px',
                              borderStyle: 'solid',
                              height: '12px',
                              width: '12px',
                              borderRadius: '50%',
                              display: 'inline-block'
                            }}
                          ></span>
                          <span
                            style={{ color: '#4285f4', marginLeft: '15px' }}
                          >
                            Not attempted
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              verticalAlign: 'bottom',
              height: '10vh',
              alignItems: 'flex-end'
            }}
            direction="column"
            justify="space-between"
          >
            <Grid
              container
              item
              sm={11}
              xs={12}
              md={8}
              lg={9}
              style={{ borderTop: '1px solid lightgray', padding: '10px' }}
            >
              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Button
                  color="primary"
                  onClick={() => {
                    if (currentQuestion === 0) {
                      if (currentSection === 0) {
                        setCurrentSection(() => {
                          return Number(data?.sections.length) - 1;
                        });
                        setCurrentQuestion(() => {
                          return (
                            Number(
                              data?.sections[data?.sections.length - 1]
                                .questions.length
                            ) - 1
                          );
                        });
                      } else {
                        setCurrentSection((prev) => prev - 1);
                        setCurrentQuestion(
                          Number(
                            data?.sections[currentSection].questions.length
                          ) - 1
                        );
                      }
                    } else {
                      setCurrentQuestion((prev) => prev - 1);
                    }
                  }}
                  startIcon={<ArrowBackIosIcon />}
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <Typography
                  variant="body2"
                  style={{ margin: '10px auto', width: 'fit-content' }}
                >
                  {(currentQuestion + 1).toString() +
                    ' of ' +
                    data?.sections[currentSection].questions.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Button
                  color="primary"
                  onClick={() => {
                    if (
                      Number(data?.sections[currentSection].questions.length) -
                        1 ===
                      currentQuestion
                    ) {
                      if (
                        Number(data?.sections.length) - 1 ===
                        currentSection
                      ) {
                        setCurrentSection(0);
                      } else {
                        setCurrentSection((prev) => prev + 1);
                      }
                      setCurrentQuestion(0);
                    } else {
                      setCurrentQuestion((prev) => prev + 1);
                    }
                  }}
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              item
              sm={12}
              xs={12}
              md={4}
              lg={3}
              justify="center"
              style={{
                borderLeft: '1px solid lightgray',
                borderTop: '1px solid lightgray'
              }}
            >
              <Button
                style={{ margin: '10px auto' }}
                color="secondary"
                onClick={() => {
                  if (assessmentAnswers !== null) {
                    history.push('/profile/assessments');
                  } else {
                    submitAssessment();
                  }
                }}
                endIcon={<ArrowForwardIcon />}
                variant="contained"
              >
                {assessmentAnswers !== null ? 'Dashboard' : 'SUBMIT TEST'}
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(Student_Asessment_Test);

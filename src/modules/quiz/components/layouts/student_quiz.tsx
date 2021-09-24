import React, { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Box,
  Divider,
  Drawer,
  RadioGroup,
  FormControlLabel,
  Grid,
  LinearProgress,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayArrow as PlayArrowIcon,
  WatchLater as ClockIcon
} from '@material-ui/icons';
import Countdown from 'react-countdown';
import { ChapterContent } from '../../../academics/contracts/chapter_content';
import { ContentType } from '../../../academics/enums/content_type';
import { QuestionApp } from '../../../academics/contracts/question';
import { QuizResult, QuizAnswer } from '../../../common/contracts/academic';
import {
  fetchStudentMeetRoom,
  getStudentsQuizzes,
  getStudentsQuizDetails,
  submitStudentsQuiz,
  fetchQuizResult
} from '../../../common/api/academics';
import { RootState } from '../../../../store';
import { Student, User } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { QuizStatus } from '../../../student_assessment/enums/quiz_status';
import { Redirect } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    colorPrimary: {
      backgroundColor: '#32CD32'
    },
    barColorPrimary: {
      backgroundColor: '#008000'
    },
    colorSecondary: {
      backgroundColor: '	#FFDAB9'
    },
    barColorSecondary: {
      backgroundColor: '	#FFA500'
    },
    colorFailure: {
      backgroundColor: '#E4717A'
    },
    barColorFailure: {
      backgroundColor: '#FF0000'
    },
    paper: {
      position: 'relative'
    }
  })
);

interface QuestionsProps {
  setActiveAnswer: (answer: string) => void;
  selectedOption: string[];
  setSelectedOption: (option: string[]) => void;
  activeQuestionIndex: number;
  answers: QuizAnswer[];
  setAnswers: (answers: QuizAnswer[]) => void;
  activeQuestion: QuestionApp[];
  quiz: ChapterContent;
  setActiveQuestionIndex: (index: number) => void;
  status: QuizStatus;
}

const Questions: FunctionComponent<QuestionsProps> = ({
  setActiveAnswer,
  selectedOption,
  setSelectedOption,
  activeQuestionIndex,
  answers,
  setAnswers,
  activeQuestion,
  quiz,
  setActiveQuestionIndex,
  status
}) => {
  const handleOptionChange = (e: { target: { value: string } }) => {
    let arr = selectedOption;
    arr[activeQuestionIndex] = e.target.value;
    setSelectedOption(arr);
    let answerIndex =
      activeQuestion &&
      activeQuestion[activeQuestionIndex].options.indexOf(e.target.value);
    setActiveAnswer(answerIndex !== undefined ? answerIndex.toString() : '');
    let ansObj = {
      serialNo:
        activeQuestion &&
        activeQuestion[activeQuestionIndex].serialNo !== undefined
          ? activeQuestion[activeQuestionIndex].serialNo
          : 0,
      selectedOption: answerIndex !== undefined ? answerIndex.toString() : '',
      isCorrect: activeQuestion && activeQuestion[activeQuestionIndex].answer
    };
    let ansArr = answers;
    ansArr[activeQuestionIndex] = ansObj;
    setAnswers(ansArr);
  };
  return (
    <Box marginTop="10px">
      <Typography>
        {activeQuestionIndex + 1}.
        {activeQuestion && activeQuestion[activeQuestionIndex].question}
      </Typography>
      <Box marginY="10px">
        <RadioGroup
          aria-label="quiz"
          name="quizes"
          value={selectedOption[activeQuestionIndex]}
          onChange={(e) => handleOptionChange(e)}
        >
          <Grid container>
            {activeQuestion &&
              activeQuestion[activeQuestionIndex].options.map(
                (option, optionIndex) => (
                  <Grid key={optionIndex} item xs={6}>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  </Grid>
                )
              )}
          </Grid>
        </RadioGroup>
      </Box>

      {status === QuizStatus.COMPLETED && (
        <Box marginY="10px">
          <Box marginBottom="5px">
            <Box
              display="inline"
              fontWeight="bold"
              fontSize="16px"
              paddingRight="8px"
            >
              answer:
            </Box>
            {activeQuestion &&
              activeQuestion[activeQuestionIndex].options[
                parseInt(activeQuestion[activeQuestionIndex].answer)
              ]}
          </Box>
          <Box>
            <Box
              display="inline"
              fontWeight="bold"
              fontSize="16px"
              paddingRight="8px"
            >
              solution:
            </Box>
            {activeQuestion &&
              activeQuestion[activeQuestionIndex].answerDescription}
          </Box>
        </Box>
      )}
      <Divider />
      <Box paddingY="20px">
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Box>
              <Button
                onClick={() =>
                  quiz.questions &&
                  activeQuestionIndex > 0 &&
                  setActiveQuestionIndex(activeQuestionIndex - 1)
                }
              >
                <ChevronLeftIcon /> Previous
              </Button>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography>
                {activeQuestionIndex + 1} of {quiz.questions?.length}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box textAlign="right">
              <Button
                onClick={() =>
                  quiz.questions &&
                  activeQuestionIndex + 1 < quiz.questions.length &&
                  setActiveQuestionIndex(activeQuestionIndex + 1)
                }
              >
                Next <ChevronRightIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
};

interface QuizProps {
  quiz: ChapterContent;
  profile: Student;
  batchfriendlyname: string;
}

const Quiz: FunctionComponent<QuizProps> = ({
  quiz,
  profile,
  batchfriendlyname
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [status, setStatus] = useState(QuizStatus.NOT_STARTED);
  const [result, setResult] = useState<QuizResult[]>();
  const [activeQuestion, setActiveQuestion] = useState<QuestionApp[]>();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  // eslint-disable-next-line
  const [activeAnswer, setActiveAnswer] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [redirectTo, setRedirectTo] = useState('');
  const [timeLeft, setTimeLeft] = useState(Date.now());
  const [expandAccordion, setExpandAccordion] = useState('resultPanel');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }
  // TODO: Get the status if the quiz has been already completed for the batch or schedule from the server.

  const startStudentsQuiz = async () => {
    setIsExtended(false);

    try {
      // Previous flow for tutor view results

      await submitStudentsQuiz({
        contentname: quiz.contentname,
        tutorId: profile.ownerId ? profile.ownerId : '',
        answers: answers
      });

      const result = await fetchQuizResult({
        contentname: quiz.contentname,
        batchfriendlyname: batchfriendlyname
      });
      setResult(result);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const getQuizDetails = async () => {
    try {
      const quizContent = await getStudentsQuizDetails({
        tutorId: profile.ownerId ? profile.ownerId : '',
        contentname: quiz.contentname
      });

      const questionsArr = quizContent.questions.map((question) => {
        return {
          serialNo: question.serialNo,
          question: question.questiontext,
          answer: question.answer,
          options: [
            question.option1,
            question.option2,
            question.option3,
            question.option4
          ],
          answerDescription: question.answerDescription
        };
      });
      setActiveQuestion(questionsArr);
      setIsExtended(true);
      setStatus(QuizStatus.STARTED);
      setTimeLeft(Date.now() + (quiz.duration ? quiz.duration * 60000 : 0));
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const showQuizResult = async () => {
    setIsExtended(true);
    setActiveQuestionIndex(0);
  };

  const QuizActions = () => {
    if (status === QuizStatus.STARTED) {
      return (
        <Box display="flex" alignItems="center">
          <Box component="span" display="flex" alignItems="center">
            <ClockIcon />

            <Box component="span" marginLeft="10px">
              <Countdown
                daysInHours={true}
                date={timeLeft}
                onComplete={() => {
                  setStatus(QuizStatus.COMPLETED);
                  startStudentsQuiz();
                }}
              />
            </Box>
          </Box>
          {quiz.questions?.length === answers.length && (
            <Box marginLeft="10px">
              <Button
                color="primary"
                variant="contained"
                disableElevation
                onClick={() => {
                  setStatus(QuizStatus.COMPLETED);
                  startStudentsQuiz();
                }}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      );
    } else if (status === QuizStatus.COMPLETED) {
      return (
        <Button
          disableElevation
          color="secondary"
          variant="contained"
          onClick={showQuizResult}
        >
          View Results
        </Button>
      );
    }

    return (
      <Box display="flex" alignItems="center">
        {!isExtended && (
          <Box marginLeft="10px">
            <Button
              color="secondary"
              variant="contained"
              disableElevation
              onClick={getQuizDetails}
            >
              View
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const toggleAccordion = (panel: any) => (event: any, newExpanded: any) => {
    setExpandAccordion(newExpanded ? panel : false);
  };

  const QuizExtendedView = () => {
    const classes = useStyles();
    return (
      <Fragment>
        {status !== QuizStatus.COMPLETED ? (
          <Questions
            setActiveAnswer={setActiveAnswer}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            activeQuestionIndex={activeQuestionIndex}
            answers={answers}
            setAnswers={setAnswers}
            activeQuestion={activeQuestion ? activeQuestion : []}
            quiz={quiz}
            setActiveQuestionIndex={setActiveQuestionIndex}
            status={status}
          />
        ) : (
          <Box marginTop="20px">
            <Accordion
              expanded={expandAccordion === 'resultPanel'}
              onChange={toggleAccordion('resultPanel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography>Result Detail</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box width="100%">
                  <Questions
                    setActiveAnswer={setActiveAnswer}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    activeQuestionIndex={activeQuestionIndex}
                    answers={answers}
                    setAnswers={setAnswers}
                    activeQuestion={activeQuestion ? activeQuestion : []}
                    quiz={quiz}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                    status={status}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandAccordion === 'leaderPanel'}
              onChange={toggleAccordion('leaderPanel')}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography>Leader Board</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Students</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Marks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result &&
                        result
                          .sort((a, b) => (a.correct < b.correct ? 1 : -1))
                          .map((studentResult) => (
                            <TableRow key={studentResult.student.mobileNo}>
                              <TableCell component="th">
                                <Typography variant="subtitle2">
                                  {studentResult.student.studentName}
                                </Typography>
                              </TableCell>
                              <TableCell scope="row">
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    (studentResult.correct /
                                      studentResult.total) *
                                    100
                                  }
                                  style={{ minWidth: '100px' }}
                                  classes={
                                    (studentResult.correct /
                                      studentResult.total) *
                                      100 >=
                                    70
                                      ? {
                                          colorPrimary: classes.colorPrimary,
                                          barColorPrimary:
                                            classes.barColorPrimary
                                        }
                                      : (studentResult.correct /
                                          studentResult.total) *
                                          100 >=
                                        40
                                      ? {
                                          colorPrimary: classes.colorSecondary,
                                          barColorPrimary:
                                            classes.barColorSecondary
                                        }
                                      : {
                                          colorPrimary: classes.colorFailure,
                                          barColorPrimary:
                                            classes.barColorFailure
                                        }
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {(studentResult.correct / studentResult.total) *
                                  100}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Fragment>
    );
  };

  return (
    <Box marginTop="10px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>{quiz.title}</Typography>
        <QuizActions />
      </Box>

      {isExtended && <QuizExtendedView />}
    </Box>
  );
};

interface Props {
  profile: Student;
  batchfriendlyname: string;
  tutorId: string;
  fromhour: string;
  weekday: string;
}

const StudentQuiz: FunctionComponent<Props> = ({
  profile,
  batchfriendlyname,
  tutorId,
  fromhour,
  weekday
}) => {
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isMeetStarted, setIsMeetStarted] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [toggle, setToggle] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const room = await fetchStudentMeetRoom({
          tutorId: tutorId,
          fromhour: fromhour,
          dayname: weekday
        });

        setRoomId(room.roomid);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        } else {
          setError(error.response.data.message);
        }
      }
    })();
  }, [profile.mobileNo, tutorId, fromhour, weekday]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const startVideoMeet = () => {
    setIsMeetStarted(true);

    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        height: 650,
        width: '100%',
        userInfo: {
          displayName: (profile as Student).studentName
        },
        parentNode: document.querySelector('#meet')
      };

      // @ts-ignore
      if (window.JitsiMeetExternalAPI) {
        // @ts-ignore
        new JitsiMeetExternalAPI(domain, options);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      console.log(error);
    }
  };

  const getQuizzes = async () => {
    try {
      const studentcontents = await getStudentsQuizzes({
        tutorId: profile.ownerId ? profile.ownerId : ''
      });

      let quizzes = studentcontents
        ? studentcontents.filter(
            (studentcontent) =>
              ContentType.QUIZ ===
              (studentcontent.content ? studentcontent.content.contenttype : '')
          )
        : [];
      quizzes = quizzes && quizzes.filter((quiz) => !quiz.isFinished);
      setQuizzes(quizzes);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  return (
    <Box overflow="hidden" height="100vh">
      <Helmet>
        <script src="https://meet.jit.si/external_api.js"></script>
      </Helmet>

      <Grid container>
        <Grid item xs={12} md={toggle ? 8 : 12}>
          <Box display="flex" flexDirection="column" height="100vh">
            <Box
              display="flex"
              alignItems="center"
              padding="20px"
              bgcolor="white"
            >
              <Button
                color="default"
                variant="contained"
                disableElevation
                component={RouterLink}
                to={`/profile/dashboard`}
              >
                Back
              </Button>

              <Box marginLeft="20px">
                <Typography variant="h6">
                  {batchfriendlyname} / {weekday} / {fromhour}
                </Typography>
                {error.length > 0 && <Box color="red">Error: {error}</Box>}
              </Box>
              <Box marginLeft="auto">
                <Button
                  color="default"
                  variant="contained"
                  disableElevation
                  onClick={() => setToggle(!toggle)}
                >
                  Start Quiz
                </Button>
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flexGrow="1"
              height="100%"
              bgcolor="#262626"
            >
              {!isMeetStarted && roomId.length > 0 && (
                <Button disableElevation color="primary" variant="contained">
                  <PlayArrowIcon />{' '}
                  <Box
                    component="span"
                    marginLeft="10px"
                    onClick={startVideoMeet}
                  >
                    Start Meeting
                  </Box>
                </Button>
              )}

              <Box id="meet" width="100%"></Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Drawer
            classes={{
              paper: classes.paper
            }}
            transitionDuration={{ enter: 250, exit: 250 }}
            variant="persistent"
            anchor="right"
            open={toggle}
            onClose={() => setToggle(false)}
          >
            <Box display="flex" flexDirection="column" minHeight="100vh">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="24px 20px"
                bgcolor="#4285F4"
                color="white"
              >
                <Box component="span" display="flex" alignItems="center">
                  <ClockIcon />
                  <Box component="span" marginLeft="10px">
                    <Typography variant="subtitle1">Class Time Left</Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1">02:30:45</Typography>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                bgcolor="white"
                flexGrow="1"
                padding="25px 20px"
              >
                <Box flexGrow="1">
                  <Box>
                    <Box marginRight="10px">
                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        onClick={getQuizzes}
                      >
                        Get Quiz
                      </Button>
                    </Box>
                  </Box>

                  <Box marginTop="20px">
                    <Typography variant="h6">Quiz</Typography>

                    {quizzes.map((quiz, quizIndex) => (
                      <Quiz
                        key={quizIndex}
                        quiz={quiz.content}
                        profile={profile}
                        batchfriendlyname={batchfriendlyname}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider />
              </Box>
            </Box>
          </Drawer>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(StudentQuiz);

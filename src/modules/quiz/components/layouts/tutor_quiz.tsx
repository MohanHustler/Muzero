import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  Radio,
  Select,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayArrow as PlayArrowIcon,
  WatchLater as ClockIcon
} from '@material-ui/icons';
import Countdown from 'react-countdown';
import { Chapter } from '../../../academics/contracts/chapter';
import { ChapterContent } from '../../../academics/contracts/chapter_content';
import { ContentType } from '../../../academics/enums/content_type';
import { BatchResponse, QuizResult } from '../../../common/contracts/academic';
import {
  fetchBatchDetails,
  fetchContents,
  fetchCustomChaptersList,
  fetchQuizResult,
  fetchTutorMeetRoom,
  createBatchChapter,
  startStudentsQuiz
} from '../../../common/api/academics';
import { generateCourseChaptersSchema } from '../../../academics/helpers';
import { RootState } from '../../../../store';
import { Tutor, User } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
import { QuizStatus } from '../../../student_assessment/enums/quiz_status';

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

interface QuizProps {
  batch: BatchResponse;
  quizIndex: number;
  quiz: ChapterContent;
  startQuiz: (number: number) => any;
}

const Quiz: FunctionComponent<QuizProps> = ({
  batch,
  quizIndex,
  quiz,
  startQuiz
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [status, setStatus] = useState(QuizStatus.NOT_STARTED);
  const [result, setResult] = useState<QuizResult[]>([]);
  const [redirectTo, setRedirectTo] = useState('');
  const activeQuestion = quiz.questions
    ? quiz.questions[activeQuestionIndex]
    : null;
  // TODO: Get the status if the quiz has been already completed for the batch or schedule from the server.
  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const startStudentsQuiz = async () => {
    setIsExtended(false);
    setStatus(QuizStatus.STARTED);

    startQuiz(quizIndex);
  };

  const showQuizResult = async () => {
    setIsExtended(true);

    try {
      // Previous flow for tutor view results

      const result = await fetchQuizResult({
        contentname: quiz.contentname,
        batchfriendlyname: batch.batchfriendlyname
      });
      setResult(result);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const QuizActions = () => {
    if (status === QuizStatus.STARTED) {
      return (
        <Box component="span" display="flex" alignItems="center">
          <ClockIcon />

          <Box component="span" marginLeft="10px">
            <Countdown
              daysInHours={true}
              date={Date.now() + (quiz.duration ? quiz.duration * 60000 : 0)}
              onComplete={() => setStatus(QuizStatus.COMPLETED)}
            />
          </Box>
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
              onClick={() => setIsExtended(true)}
            >
              View
            </Button>
          </Box>
        )}

        {isExtended && <Box marginLeft="10px">{quiz.marks} Mark</Box>}

        <Box marginLeft="10px">
          <Button
            color="primary"
            variant="contained"
            disableElevation
            onClick={startStudentsQuiz}
          >
            Start
          </Button>
        </Box>
      </Box>
    );
  };

  const QuizExtendedView = () => {
    const classes = useStyles();
    if (status === QuizStatus.COMPLETED) {
      return (
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
              {result
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
                          (studentResult.correct / studentResult.total) * 100
                        }
                        style={{ minWidth: '100px' }}
                        classes={
                          (studentResult.correct / studentResult.total) * 100 >=
                          70
                            ? {
                                colorPrimary: classes.colorPrimary,
                                barColorPrimary: classes.barColorPrimary
                              }
                            : (studentResult.correct / studentResult.total) *
                                100 >=
                              40
                            ? {
                                colorPrimary: classes.colorSecondary,
                                barColorPrimary: classes.barColorSecondary
                              }
                            : {
                                colorPrimary: classes.colorFailure,
                                barColorPrimary: classes.barColorFailure
                              }
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {(studentResult.correct / studentResult.total) * 100}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    return (
      <Box marginTop="10px">
        <Typography>
          {activeQuestionIndex + 1}. {activeQuestion && activeQuestion.question}
        </Typography>

        <Box marginY="10px">
          <Grid container>
            {activeQuestion &&
              activeQuestion.options.map((option, optionIndex) => (
                <Grid key={optionIndex} item xs={6}>
                  <FormControlLabel
                    value={optionIndex}
                    control={
                      <Radio
                        checked={
                          optionIndex === parseInt(activeQuestion.answer)
                        }
                        name="option"
                      />
                    }
                    label={option}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>

        <Box marginY="10px">
          <Box>
            <Box
              display="inline"
              fontWeight="bold"
              fontSize="16px"
              paddingRight="8px"
            >
              solution:
            </Box>
            {activeQuestion && activeQuestion.answerDescription}
          </Box>
        </Box>

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
  profile: Tutor;
  batchfriendlyname: string;
  fromhour: string;
  weekday: string;
}

const TutorQuiz: FunctionComponent<Props> = ({
  profile,
  batchfriendlyname,
  fromhour,
  weekday
}) => {
  const [batch, setBatch] = useState<BatchResponse>();
  const [activeChapterIndex, setActiveChapterIndex] = useState(-1);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeCourseIndex] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [publishError, setPublishError] = useState('');
  const [isMeetStarted, setIsMeetStarted] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const getActiveChapter = (): Partial<Chapter> =>
    chapters.length > 0 && activeChapterIndex !== -1
      ? chapters[activeChapterIndex]
      : {};
  const [toggle, setToggle] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const room = await fetchTutorMeetRoom({
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
  }, [profile.mobileNo, fromhour, weekday]);

  useEffect(() => {
    (async () => {
      // TODO: Fetch batch details show batch name on the screen
      // TODO: Select course based on the schedule
      try {
        // const coursesList = await fetchTutorCoursesList();

        // setCourses(coursesList);

        // const course = coursesList[activeCourseIndex];

        const batchDetails = await fetchBatchDetails({
          batchfriendlyname
        });

        setBatch(batchDetails);

        const customChapters = await fetchCustomChaptersList({
          boardname: batchDetails !== undefined ? batchDetails.boardname : '',
          classname: batchDetails !== undefined ? batchDetails.classname : '',
          subjectname:
            batchDetails !== undefined ? batchDetails.subjectname : ''
        });

        const structuredChapters = generateCourseChaptersSchema(
          [],
          customChapters
        );

        setChapters([...structuredChapters]);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [activeCourseIndex, batchfriendlyname]);

  useEffect(() => {
    (async () => {
      try {
        const chapterContents = await fetchContents({
          boardname: batch !== undefined ? batch.boardname : ('' as string),
          classname: batch !== undefined ? batch.classname : ('' as string),
          subjectname: batch !== undefined ? batch.subjectname : ('' as string),
          chaptername: chapters[activeChapterIndex].name as string
        });

        const clonedChapters = [...chapters];

        const quizContents = chapterContents
          ? chapterContents.filter(
              (content) => ContentType.QUIZ === content.contenttype
            )
          : [];

        clonedChapters[activeChapterIndex].contents = quizContents.map(
          (chapterContent) => ({
            chapter: chapterContent.chapter,
            contentname: chapterContent.contentname,
            contenttype: chapterContent.contenttype,
            duration: chapterContent.duration,
            marks: chapterContent.marks,
            title: chapterContent.title,
            questions: chapterContent.questions.map((quiz) => ({
              serialNo: quiz.serialNo,
              question: quiz.questiontext,
              answer: quiz.answer,
              options: [quiz.option1, quiz.option2, quiz.option3, quiz.option4],
              answerDescription: quiz.answerDescription
            }))
          })
        );
        setChapters(clonedChapters);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [activeChapterIndex, activeCourseIndex, batch]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const publishChapterToBatch = async () => {
    try {
      setPublishError('');
      await createBatchChapter({
        boardname: batch !== undefined ? batch.boardname : ('' as string),
        classname: batch !== undefined ? batch.classname : ('' as string),
        subjectname: batch !== undefined ? batch.subjectname : ('' as string),
        chaptername: chapters[activeChapterIndex].name,
        batchfriendlyname: batch?.batchfriendlyname
          ? batch.batchfriendlyname
          : ''
      });
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setPublishError(error.response.data.message);
      }
    }
  };

  const startQuiz = async (quizIndex: number) => {
    try {
      await startStudentsQuiz({
        batchfriendlyname: batchfriendlyname,
        contentname: quizes[quizIndex].contentname
      });
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const startVideoMeet = () => {
    setIsMeetStarted(true);

    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        height: 650,
        width: '100%',
        userInfo: {
          email: (profile as Tutor).emailId,
          displayName: (profile as Tutor).tutorName
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

  const contents = getActiveChapter().contents;
  const quizes = contents
    ? contents.filter((content) => ContentType.QUIZ === content.contenttype)
    : [];

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
                    <Box marginBottom="10px">
                      <Typography variant="subtitle1">
                        Select Chapter
                      </Typography>
                    </Box>

                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-age-native-simple">
                        Select
                      </InputLabel>

                      <Select
                        native
                        label="Select"
                        inputProps={{
                          name: 'chapter'
                        }}
                        value={chapters.length > 0 ? activeChapterIndex : ''}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                          setActiveChapterIndex(
                            parseInt(e.target.value as string)
                          )
                        }
                      >
                        <option value="-1">Select Chapter</option>
                        {chapters.map((chapter, chapterIndex) => (
                          <option key={chapterIndex} value={chapterIndex}>
                            {chapter.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Box marginLeft="10px" padding="25px 20px">
                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        onClick={publishChapterToBatch}
                      >
                        Publish Chapter
                      </Button>
                      {publishError.length > 0 && (
                        <Box color="red">{publishError}</Box>
                      )}
                    </Box>
                  </Box>

                  <Box marginTop="20px">
                    <Typography variant="h6">Quiz</Typography>

                    {quizes.map((quiz, quizIndex) => (
                      <Quiz
                        key={quizIndex}
                        batch={batch as BatchResponse}
                        quizIndex={quizIndex}
                        quiz={quiz}
                        startQuiz={startQuiz}
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

export default connect(mapStateToProps)(TutorQuiz);

import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Select,
  Typography,
  Divider,
  Button as MuButton
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CloudCircle as CloudCircleIcon
} from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import ContactWhite from '../../../assets/svgs/contact-white.svg';
import Modal from '../../common/components/modal';
import { StackActionItem } from '../../common/contracts/stack_action';
import { StackActionType } from '../../common/enums/stack_action_type';
import { ContentType } from '../enums/content_type';
import { ChapterContent } from '../contracts/chapter_content';
import { QuestionApp } from '../contracts/question';
import { QuizMetaData } from '../contracts/quiz_meta';
import Tooltip from '../../common/components/tooltip';
import Button from '../../common/components/form_elements/button';
import Questions from './content_types/questions';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    circularAddButton: {
      background: '#FFF',
      border: '2px solid #F2F2F2',
      color: theme.palette.secondary.main,

      '&:hover': {
        background: '#FFF'
      }
    }
  })
);

interface Props {
  showQuizModal: boolean;
  onCloseModal: () => any;
  quizzes: ChapterContent[];
  emitStackAction: (action: StackActionItem) => any;
  operation: string;
  currentContentIndex: number;
  quizMeta: QuizMetaData;
  setQuizMeta: (quiz: QuizMetaData) => void;
  allQuestions: QuestionApp[];
  setAllQuestions: (questions: QuestionApp[]) => void;
  updateQuestions: QuestionApp[];
  setUpdateQuestions: (questions: QuestionApp[]) => void;
}

interface FormData {
  title: string;
  marks: number;
  duration: number;
  question: string;
  answer: string;
  options: string[];
}

const QuizInformationModal: FunctionComponent<Props> = ({
  showQuizModal,
  onCloseModal,
  quizzes,
  emitStackAction,
  operation,
  currentContentIndex,
  quizMeta,
  setQuizMeta,
  allQuestions,
  setAllQuestions,
  updateQuestions,
  setUpdateQuestions
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const questions =
    quizzes &&
    quizzes[currentContentIndex] &&
    quizzes[currentContentIndex].questions
      ? quizzes[currentContentIndex].questions
      : [];

  const [addQuestions, setAddQuestions] = useState<QuestionApp[]>([]);

  const updateQuestion = (questionIndex: number, question: string) => {
    const questionsList = [...updateQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].question = question;
      setUpdateQuestions(questionsList);
    }
  };

  const createOption = (questionIndex: number) => {
    const questionsList = [...updateQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].options.push('');
      setUpdateQuestions(questionsList);
    }
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option: string
  ) => {
    const questionsList = [...updateQuestions];

    if (questionsList[questionIndex] && questionsList[questionIndex].options) {
      questionsList[questionIndex].options[optionIndex] = option;
      setUpdateQuestions(questionsList);
    }
  };

  const updateAnswer = (questionIndex: number, answer: string) => {
    const questionsList = [...updateQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].answer = answer;
      setUpdateQuestions(questionsList);
    }
  };

  const updateAnswerDescription = (
    questionIndex: number,
    answerDescription: string
  ) => {
    const questionsList = [...updateQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].answerDescription = answerDescription;
      setUpdateQuestions(questionsList);
    }
  };

  const quizQuestionsValidation = (questionList: QuestionApp[]) => {
    if (!quizMeta.title.length) {
      setError('title', 'Invalid Data', 'Title should not be empty');
      return false;
    } else {
      clearError('title');
    }
    if (!quizMeta.marks) {
      setError('marks', 'Invalid Data', 'Marks should not be empty');
      return false;
    } else {
      clearError('marks');
    }
    if (!quizMeta.duration) {
      setError('duration', 'Invalid Data', 'Duration should not be empty');
      return false;
    } else {
      clearError('duration');
    }

    return questionList.every((questions) => {
      if (!questions.question.length) {
        setError('question', 'Invalid Data', 'Question should not be empty');
        return false;
      } else {
        clearError('question');
      }
      if (questions.options.length < 4) {
        setError('option', 'Invalid Data', 'Option should not be empty');
        return false;
      } else {
        clearError('option');
      }
      if (typeof questions.answer === 'string' && questions.answer === '') {
        setError('answer', 'Invalid Data', 'Answer should not be empty');
        return false;
      } else {
        clearError('answer');
      }
      return true;
    });
  };

  const handleUpdateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let questionError = updateQuestions.every((questions) => {
      if (!questions.question.length) {
        setError('question', 'Invalid Data', 'Question should not be empty');
        return false;
      } else {
        clearError('question');
      }
      if (questions.options.length < 4) {
        setError('option', 'Invalid Data', 'Option should not be empty');
        return false;
      } else {
        clearError('option');
      }
      return true;
    });

    let newQuestionError = quizQuestionsValidation(addQuestions);
    if (questionError && newQuestionError) {
      // stack action takes new questions as well as existing questions
      emitStackAction({
        type: StackActionType.UPDATE,
        payload: {
          data: updateQuestions
            ? [...updateQuestions, ...addQuestions]
            : [...addQuestions],
          type: ContentType.QUIZ
        }
      });
      onCloseModal();
    }
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let questionError = quizQuestionsValidation(allQuestions);

    if (questionError) {
      emitStackAction({
        type: StackActionType.CREATE,
        payload: {
          data: allQuestions,
          type: ContentType.QUIZ
        }
      });

      onCloseModal();
    }
  };

  const readExcel = (file: File | null) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target ? e.target.result : '';
          const wb = XLSX.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          /* Convert array to json*/
          const jsonData = XLSX.utils.sheet_to_json(ws);
          resolve(jsonData);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      }
    });
    promise.then((questionArr: any) => {
      const questions =
        questionArr &&
        questionArr.map((question: any) => {
          return {
            question: question.Question_Description,
            answer: question.Answer.toString(),
            options: [
              question.Option1.toString(),
              question.Option2.toString(),
              question.Option3.toString(),
              question.Option4.toString()
            ],
            answerDescription: question.Answer_Description
          };
        });

      if (operation === StackActionType.UPDATE) {
        // filter only valid questions in an array
        let validQuestions = addQuestions.filter((el) => el.question !== '');
        validQuestions = [...validQuestions, ...questions];
        setAddQuestions(validQuestions);
      } else {
        // filter only valid questions in an array
        let validQuestions = allQuestions.filter((el) => el.question !== '');
        validQuestions = [...validQuestions, ...questions];
        setAllQuestions(validQuestions);
      }
    });
  };

  const classes = useStyles();

  return (
    <Modal
      open={showQuizModal}
      handleClose={onCloseModal}
      header={
        <Box display="flex" alignItems="center">
          <img src={ContactWhite} alt="Personal Info" />

          <Box marginLeft="15px">
            <Typography component="span" color="secondary">
              <Box component="h3" color="white" fontWeight="400" margin="0">
                Quiz Information
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      {operation === StackActionType.UPDATE ? (
        <form onSubmit={handleUpdateQuiz}>
          <Box marginBottom="15px">
            <Grid container>
              <Grid item xs={2}>
                <strong>Title:</strong>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth margin="none">
                  <Input
                    placeholder="Enter title"
                    inputProps={{ maxLength: 100 }}
                    value={quizMeta.title}
                    onChange={(e) => {
                      setQuizMeta({ ...quizMeta, title: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box marginBottom="20px">
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <strong>Marks:</strong>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="none">
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        inputProps={{ maxLength: 20 }}
                        value={quizMeta.marks ? quizMeta.marks : ''}
                        onChange={(e) => {
                          setQuizMeta({
                            ...quizMeta,
                            marks: parseInt(e.target.value)
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <strong>Duration:</strong>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="none">
                      <Input
                        type="number"
                        placeholder="Duration in minutes"
                        inputProps={{ maxLength: 20 }}
                        value={quizMeta.duration ? quizMeta.duration : ''}
                        onChange={(e) => {
                          setQuizMeta({
                            ...quizMeta,
                            duration: parseInt(e.target.value)
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {questions
            ? questions.map((item: any, questionIndex) => (
                <Box key={questionIndex} marginY="15px">
                  <Grid container>
                    <Grid item xs={2}>
                      <strong>Question {questionIndex + 1}:</strong>
                    </Grid>

                    <Grid item xs={10}>
                      <FormControl fullWidth margin="none">
                        <Input
                          placeholder="Enter question"
                          inputProps={{ maxLength: 100 }}
                          value={item.question}
                          onChange={(e) => {
                            updateQuestion(questionIndex, e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box marginY="20px">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Grid container>
                          <Grid item xs={4}>
                            <strong>Options:</strong>
                          </Grid>

                          <Grid item xs={8}>
                            <Box>
                              {item.options &&
                                item.options.map(
                                  (option: string, optionIndex: number) => {
                                    return (
                                      <Grid container key={optionIndex}>
                                        <Grid item xs={12} md={4}>
                                          <FormControl
                                            fullWidth
                                            margin="normal"
                                          >
                                            <Box
                                              fontWeight="bold"
                                              marginTop="5px"
                                            >
                                              Option {optionIndex + 1}
                                            </Box>
                                          </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={8}>
                                          <FormControl
                                            fullWidth
                                            margin="normal"
                                          >
                                            <Input
                                              value={option}
                                              inputProps={{ maxLength: 50 }}
                                              onChange={(e) => {
                                                updateOption(
                                                  questionIndex,
                                                  optionIndex,
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    );
                                  }
                                )}
                              {item.options && item.options.length < 4 ? (
                                <Box textAlign="right">
                                  <Tooltip title="Add Option">
                                    <IconButton
                                      className={classes.circularAddButton}
                                      onClick={() => {
                                        createOption(questionIndex);
                                      }}
                                    >
                                      <AddIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ) : (
                                ''
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container>
                          <Grid item xs={4}>
                            <strong>Answer:</strong>
                          </Grid>
                          <Grid item xs={8}>
                            <FormControl fullWidth margin="none">
                              <Select
                                value={
                                  item.answer
                                    ? (item.answer as string)
                                    : item.answer
                                }
                                onChange={(
                                  e: React.ChangeEvent<{ value: unknown }>
                                ) => {
                                  updateAnswer(
                                    questionIndex,
                                    e.target.value as string
                                  );
                                }}
                              >
                                {item.options &&
                                  item.options.map(
                                    (option: string, index: number) => (
                                      <MenuItem key={index} value={index}>
                                        {option}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box marginBottom="15px">
                    <Grid container>
                      <Grid item xs={2}>
                        <strong>Solution:</strong>
                      </Grid>
                      <Grid item xs={10}>
                        <FormControl fullWidth margin="none">
                          <Input
                            placeholder="Enter solution"
                            inputProps={{ maxLength: 100 }}
                            value={item.answerDescription}
                            onChange={(e) => {
                              updateAnswerDescription(
                                questionIndex,
                                e.target.value
                              );
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                </Box>
              ))
            : ''}

          <Questions
            quizzes={quizzes}
            allQuestions={addQuestions}
            setAllQuestions={setAddQuestions}
            currentContentIndex={currentContentIndex}
            action={StackActionType.UPDATE}
          />

          <Box display="flex" justifyContent="flex-end" marginTop="15px">
            <Box>
              <MuButton>
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  to="/files/questions.xlsx"
                  target="_blank"
                  download
                >
                  Download Template
                </Link>
                <Box display="flex" alignItems="center" marginLeft="5px">
                  <AssignmentIcon color="primary" />
                </Box>
              </MuButton>
            </Box>
            <Box>
              <input
                accept=".xls, .xlsx"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={(e) => readExcel(e.target.files && e.target.files[0])}
              />
              <label htmlFor="contained-button-file">
                <MuButton component="span">
                  Bulk Upload
                  <Box display="flex" alignItems="center" marginLeft="5px">
                    <CloudCircleIcon color="secondary" />
                  </Box>
                </MuButton>
              </label>
            </Box>
            <Box>
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                onClick={() =>
                  setAddQuestions([
                    ...addQuestions,
                    { question: '', answer: '', options: [] }
                  ])
                }
              >
                Add Question
              </Button>
            </Box>
            <Box marginLeft="10px">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      ) : (
        <form onSubmit={handleCreateQuiz}>
          <Box marginBottom="15px">
            <Grid container>
              <Grid item xs={2}>
                <strong>Title:</strong>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth margin="none">
                  <Input
                    placeholder="Enter title"
                    inputProps={{ maxLength: 100 }}
                    value={quizMeta.title}
                    onChange={(e) => {
                      setQuizMeta({ ...quizMeta, title: e.target.value });
                    }}
                  />
                </FormControl>
                {errors.title && (
                  <FormHelperText error>{errors.title.message}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box marginBottom="20px">
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <strong>Marks:</strong>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="none">
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        inputProps={{ maxLength: 20 }}
                        value={quizMeta.marks ? quizMeta.marks : ''}
                        onChange={(e) => {
                          setQuizMeta({
                            ...quizMeta,
                            marks: parseInt(e.target.value)
                          });
                        }}
                      />
                    </FormControl>
                    {errors.marks && (
                      <FormHelperText error>
                        {errors.marks.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <strong>Duration:</strong>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="none">
                      <Input
                        type="number"
                        placeholder="Duration in minutes"
                        inputProps={{ maxLength: 20 }}
                        value={quizMeta.duration ? quizMeta.duration : ''}
                        onChange={(e) => {
                          setQuizMeta({
                            ...quizMeta,
                            duration: parseInt(e.target.value)
                          });
                        }}
                      />
                    </FormControl>
                    {errors.duration && (
                      <FormHelperText error>
                        {errors.duration.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Questions
            quizzes={quizzes}
            allQuestions={allQuestions}
            setAllQuestions={setAllQuestions}
            currentContentIndex={currentContentIndex}
            action={StackActionType.CREATE}
          />
          <Box display="flex" justifyContent="flex-end" marginTop="15px">
            <Box>
              <MuButton>
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  to="/files/questions.xlsx"
                  target="_blank"
                  download
                >
                  Download Template
                </Link>
                <Box display="flex" alignItems="center" marginLeft="5px">
                  <AssignmentIcon color="primary" />
                </Box>
              </MuButton>
            </Box>
            <Box>
              <input
                accept=".xls, .xlsx"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={(e) => readExcel(e.target.files && e.target.files[0])}
              />
              <label htmlFor="contained-button-file">
                <MuButton component="span">
                  Bulk Upload
                  <Box display="flex" alignItems="center" marginLeft="5px">
                    <CloudCircleIcon color="secondary" />
                  </Box>
                </MuButton>
              </label>
            </Box>
            <Box marginLeft="10px">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                onClick={() =>
                  setAllQuestions([
                    ...allQuestions,
                    { question: '', answer: '', options: [] }
                  ])
                }
              >
                Add Question
              </Button>
            </Box>
            <Box marginLeft="10px">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Modal>
  );
};

export default QuizInformationModal;

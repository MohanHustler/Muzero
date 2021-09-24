import React, { FunctionComponent, Fragment } from 'react';

import {
  Box,
  FormControl,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Select,
  Divider,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import { ChapterContent } from '../../contracts/chapter_content';
import Tooltip from '../../../common/components/tooltip';
import { QuestionApp } from '../../contracts/question';
import { StackActionType } from '../../../common/enums/stack_action_type';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    circularAddButton: {
      background: '#FFF',
      border: '2px solid #F2F2F2',
      color: theme.palette.secondary.main,

      '&:hover': {
        background: '#FFF',
      },
    },
  })
);

interface Props {
  quizzes: ChapterContent[];
  allQuestions: QuestionApp[];
  setAllQuestions: (questions: QuestionApp[]) => void;
  currentContentIndex: number;
  action: string;
}

const Questions: FunctionComponent<Props> = ({
  quizzes,
  allQuestions,
  setAllQuestions,
  currentContentIndex,
  action,
}) => {
  const questions =
    quizzes &&
    quizzes[currentContentIndex] &&
    quizzes[currentContentIndex].questions
      ? quizzes[currentContentIndex].questions
      : [];

  const updateQuestion = (questionIndex: number, question: string) => {
    const questionsList = [...allQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].question = question;
      setAllQuestions(questionsList);
    }
  };

  const createOption = (questionIndex: number) => {
    const questionsList = [...allQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].options.push('');
      setAllQuestions(questionsList);
    }
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option: string
  ) => {
    const questionsList = [...allQuestions];

    if (questionsList[questionIndex] && questionsList[questionIndex].options) {
      questionsList[questionIndex].options[optionIndex] = option;
      setAllQuestions(questionsList);
    }
  };

  const updateAnswer = (questionIndex: number, answer: string) => {
    const questionsList = [...allQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].answer = answer;
      setAllQuestions(questionsList);
    }
  };

  const updateAnswerDescription = (
    questionIndex: number,
    answerDescription: string
  ) => {
    const questionsList = [...allQuestions];

    if (questionsList[questionIndex]) {
      questionsList[questionIndex].answerDescription = answerDescription;
      setAllQuestions(questionsList);
    }
  };

  const classes = useStyles();
  return (
    <Fragment>
      {allQuestions &&
        allQuestions.map((item, questionIndex) => (
          <Box key={questionIndex} marginTop="20px">
            <Grid container>
              <Grid item xs={2}>
                <strong>
                  Question
                  {action === StackActionType.UPDATE
                    ? questions && questions.length + questionIndex + 1
                    : questionIndex + 1}
                  :
                </strong>
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

            <Box marginTop="20px">
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
                                    <FormControl fullWidth margin="normal">
                                      <Box fontWeight="bold" marginTop="5px">
                                        Option {optionIndex + 1}
                                      </Box>
                                    </FormControl>
                                  </Grid>

                                  <Grid item xs={12} md={8}>
                                    <FormControl fullWidth margin="normal">
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
                        {item.options.length < 4 ? (
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
                          value={item.answer}
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
            <Box marginBottom="20px">
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
                        updateAnswerDescription(questionIndex, e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Box>
        ))}
    </Fragment>
  );
};

export default Questions;

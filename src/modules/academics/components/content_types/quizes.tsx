import React, { FunctionComponent, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { StackActionItem } from '../../../common/contracts/stack_action';
import { Chapter } from '../../contracts/chapter';
import { ChapterContent } from '../../contracts/chapter_content';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { ContentType } from '../../enums/content_type';
import { Course } from '../../contracts/course';
import { QuizMetaData } from '../../contracts/quiz_meta';
import { QuestionApp } from '../../contracts/question';

import QuizInformationModal from '../quiz_information_modal';
import Button from '../../../common/components/form_elements/button';
import { fetchContentDetails } from '../../../common/api/academics';
import { generateQuestionSchemaForApp } from '../../helpers';

interface Props {
  quizzes: ChapterContent[];
  emitStackAction: (action: StackActionItem) => any;
  chapterName: string;
  activeCourse: Course;
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
  activeChapterIndex: number;
  quizMeta: QuizMetaData;
  setQuizMeta: (quiz: QuizMetaData) => void;
}

const Quizes: FunctionComponent<Props> = ({
  quizzes,
  emitStackAction,
  chapterName,
  activeCourse,
  chapters,
  setChapters,
  activeChapterIndex,
  quizMeta,
  setQuizMeta
}) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [operation, setOperation] = useState(StackActionType.CREATE);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState<QuestionApp[]>([
    {
      question: '',
      answer: '',
      options: [],
      answerDescription: ''
    }
  ]);
  const [updateQuestions, setUpdateQuestions] = useState<QuestionApp[]>(
    quizzes && quizzes[currentContentIndex]
      ? (quizzes[currentContentIndex].questions as QuestionApp[])
      : []
  );

  const addQuiz = () => {
    setQuizMeta({
      title: '',
      duration: 0,
      marks: 0,
      contentname: ''
    });
    setAllQuestions([
      {
        question: '',
        answer: '',
        options: [],
        answerDescription: ''
      }
    ]);
    setShowQuizModal(true);
    setOperation(StackActionType.CREATE);
  };

  const deleteQuiz = (contentName: string) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: contentName,
        type: ContentType.QUIZ
      }
    });
  };

  const getQuizDetails = async (quizIndex: number) => {
    setCurrentContentIndex(quizIndex);
    // get current chapter questions list and
    // append it into chapter content
    const chapterQuiz = await fetchContentDetails({
      boardname: activeCourse.board,
      classname: activeCourse.className,
      subjectname: activeCourse.subject,
      chaptername: chapterName,
      contentname: quizzes[quizIndex].contentname
    });

    // The server response for Quiz is different and returns only the id
    // of the questions. Therefore, we'd need to map the questions and
    // generate a schema for questions and replace those ids with the
    // actual questions to make the app work consistently like for the
    // other content types.

    if (chapterQuiz && chapterQuiz.questions) {
      // @ts-ignore
      quizzes[quizIndex].questions = chapterQuiz.questions.map((question) =>
        generateQuestionSchemaForApp(question)
      );

      setQuizMeta({
        title: chapterQuiz.title,
        duration: chapterQuiz.duration,
        marks: chapterQuiz.marks,
        contentname: chapterQuiz.contentname
      });

      setUpdateQuestions(quizzes[quizIndex].questions as QuestionApp[]);
    } else if (quizzes.length) {
      setAllQuestions(quizzes[quizIndex].questions as QuestionApp[]);
      const quizMeta = {
        title: quizzes[quizIndex].title,
        duration: quizzes[quizIndex].duration,
        marks: quizzes[quizIndex].marks,
        contentname: quizzes[quizIndex].contentname
      };
      setQuizMeta(quizMeta as QuizMetaData);
    }
    if (quizzes.length) {
      const chaptersList = [...chapters];
      chaptersList[activeChapterIndex].contents = quizzes;
      setChapters(chaptersList);
    }

    setShowQuizModal(true);
    setOperation(StackActionType.UPDATE);
  };

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            component="h3"
            fontWeight="500"
            font-size="18.2px"
            line-height="21px"
            color="#666666"
            margin="20px 0"
          >
            Step 6: Add Quiz
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box textAlign="right">
            <Button
              disableElevation
              color="secondary"
              type="submit"
              size="medium"
              variant="contained"
              onClick={addQuiz}
            >
              Add Quiz
            </Button>
          </Box>
        </Grid>
      </Grid>
      {quizzes.length
        ? quizzes.map((quiz, quizIndex) => (
            <Grid container alignItems="center" key={quizIndex}>
              <Grid item xs={12} md={6}>
                <Typography>{quiz.title}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  marginBottom="10px"
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Box>
                    <Button
                      color="secondary"
                      variant="contained"
                      disableElevation
                      onClick={() => getQuizDetails(quizIndex)}
                    >
                      View
                    </Button>
                  </Box>
                  <Box marginLeft="10px">
                    <Button
                      color="secondary"
                      variant="contained"
                      disableElevation
                      onClick={() => deleteQuiz(quiz.contentname)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ))
        : ''}

      <QuizInformationModal
        showQuizModal={showQuizModal}
        onCloseModal={() => setShowQuizModal(false)}
        quizzes={quizzes}
        emitStackAction={emitStackAction}
        operation={operation}
        currentContentIndex={currentContentIndex}
        quizMeta={quizMeta}
        setQuizMeta={setQuizMeta}
        allQuestions={allQuestions}
        setAllQuestions={setAllQuestions}
        updateQuestions={updateQuestions}
        setUpdateQuestions={setUpdateQuestions}
      />
    </Box>
  );
};

export default Quizes;

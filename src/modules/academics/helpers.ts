import { QuestionApp, QuestionServer } from './contracts/question';
import { getChapterStub } from './stubs/chapter';

export const generateCourseChaptersSchema = <
  M extends { chapter: { name: string } },
  C extends { chaptername: string }
>(
  masterChapters: M[],
  customChapters: C[]
) => {
  // Make a list of master chapters that doesn't exist in the custom
  // chapters of the tutor.
  const filteredMasterChapters = masterChapters.filter(
    (masterChapter) =>
      customChapters.findIndex(
        (customChapter) =>
          masterChapter.chapter.name === customChapter.chaptername
      ) === -1
  );

  const structuredMasterChapters = filteredMasterChapters.map((chapter) =>
    getChapterStub({ name: chapter.chapter.name, isMaster: true })
  );

  const structuredCustomChapters = customChapters.map((chapter) =>
    getChapterStub({ name: chapter.chaptername, isMaster: false })
  );

  return [...structuredMasterChapters, ...structuredCustomChapters];
};

export const generateQuestionSchemaForApp = (item: QuestionServer) => ({
  serialNo: item.serialNo,
  question: item.questiontext,
  answer: item.answer,
  options: [item.option1, item.option2, item.option3, item.option4],
  answerDescription: item.answerDescription,
});

export const generateQuestionSchemaForServer = (item: QuestionApp) => ({
  questiontext: item.question,
  answer: item.answer,
  option1: item.options[0] ? item.options[0] : '',
  option2: item.options[1] ? item.options[1] : '',
  option3: item.options[2] ? item.options[2] : '',
  option4: item.options[3] ? item.options[3] : '',
  answerDescription: item.answerDescription,
});

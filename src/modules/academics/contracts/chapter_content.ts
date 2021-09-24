import { QuestionApp, QuestionServer } from './question';

export interface ChapterContent {
  chapter: string;
  contentname: string;
  contenttype: string;
  uuid?: string;
  title?: string;
  duration?: number;
  marks?: number;
  questions?: QuestionApp[];
}

export interface QuizContent {
  chapter: string;
  contentname: string;
  contenttype: string;
  uuid?: string;
  questions: QuestionServer[];
}

export interface QuizContentResponse {
  content: QuizContent;
}

export interface QuestionApp<T = string> {
  serialNo?: number;
  question: string;
  answer: string;
  options: T[];
  answerDescription?: string;
}

export interface QuestionServer {
  serialNo?: number;
  questiontext: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  answerDescription?: string;
}

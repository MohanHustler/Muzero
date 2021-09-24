interface imageObject {
  filename:string,
  encoding:string
};
export interface QuestionBody {
  _id:string,
  srno:string,
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  questionDescription: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string[] ;
  answerDescription: string;
  imageLinks:imageObject[];
  marks:number;
  complexity:'easy'|'medium'|'high';
  source:"user" | "database";
  type:"single"|"multiple"|"numeric";
  percentageError:number;
  checksum:string,
  negativeMarking:number
}

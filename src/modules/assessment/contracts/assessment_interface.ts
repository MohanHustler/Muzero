import { Section } from "./section_interface"
export interface Assessment {
  _id: string,
  boardname: string;
  classname: string;
  subjectname: string;
  sections : Section[];
  assessmentname: string;
  duration: number;
  totalMarks: number;
  instructions: string;
  startDate:Date,
  endDate:Date
}

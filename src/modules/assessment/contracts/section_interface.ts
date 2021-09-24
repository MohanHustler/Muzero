import { QuestionBody } from "./qustions_interface";

export interface Section {
    title:string;
    questions:QuestionBody[];
    totalMarks:number;
    duration:number;
    instructions?:string;
}
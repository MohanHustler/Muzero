import { QuestionBody } from "./qustions_interface"



export interface Topic {
    title:string;
    questionSet: [string,QuestionBody[]][]
}
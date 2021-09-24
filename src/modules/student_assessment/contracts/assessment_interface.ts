import {Assessment} from "../../assessment/contracts/assessment_interface"
import {AssessmentData} from "./AssessmentData"
export interface OngoingAssessment {
  _id:string
  startTime : Date;
  endTime : Date;
  currentQuestion:number;
  answers:string[][][];
  attemptedQuestions : number[][];
  assessmentData: AssessmentData;
  startDate:Date,
  endDate:Date,
  assessment: Assessment,
  isSubmitted:boolean,
  isStarted:boolean,
  solutionTime:Date
};

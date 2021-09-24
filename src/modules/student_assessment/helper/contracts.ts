import { OngoingAssessment } from "../contracts/assessment_interface";
import {Assessment} from "../../assessment/contracts/assessment_interface"
import { AssessmentAnswers } from "../contracts/assessment_answers"
export interface postAttemptAssessmentResponse {
    assessmentResponse : OngoingAssessment
}


export interface getAttemptAssessmentResponse {
    attemptAssessmentDoc : OngoingAssessment,
};

export interface getAssessmentResponse {
    assessment:Assessment
}


export interface getAnswersResponse {
    answersData: AssessmentAnswers
}

export interface getAssessmentsResponse{
    attemptAssessmentDocs: OngoingAssessment[]
}

import {Assessment} from "../../assessment/contracts/assessment_interface"


export interface getAssessmentsResponse {
    assessmentList:Assessment[]
}

export interface getAssessmentResponse {
    assessment:Assessment
}


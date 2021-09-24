import {Assessment} from "../contracts/assessment_interface"
import {Batch} from "../contracts/batch_interface"
import {QuestionBody} from "../contracts/qustions_interface"
import {StudentInfo} from "../contracts/studentInfo_interface"
interface TopicDoc {
    _id:{
        topic:string,
        questions:string
    },
    questions:Array<QuestionBody>
}
export interface getAssessmentsResponse {
    assessmentList:Assessment[]
}

export interface getAssessmentResponse {
    assessment:Assessment
}

export interface getTopicsResponse {
    topics:TopicDoc[]
}

export interface getBatchesResponse {
    batchList:Batch[]
}

export interface getStudentsDataResponse { 
    studentInfo : StudentInfo[]
}

export interface getAssignedAssessmentsResponse{
    assessmentArr:string[]
}


export interface getCreateAssessmentCopyResponse{
    assessmentDoc: Assessment
}
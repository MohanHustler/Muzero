import axios from "axios";
import { FIRST_PATCH_ASSESSMENT, PATCH_ASSESSMENT ,CHECK_ASSESSMENT_STATUS,STUDENT_ASSESSMENT,GET_ANSWERS ,GET_ATTEMPT_ASSESSMENTS} from "./routes";
import {OngoingAssessment} from "../contracts/assessment_interface"
import {postAttemptAssessmentResponse,getAttemptAssessmentResponse,getAssessmentResponse , getAnswersResponse ,getAssessmentsResponse} from "./contracts"
import {Assessment} from "../../assessment/contracts/assessment_interface"



export const firstPatchAttemptAssessment = async (QUERY:string,OngoingDoc:Object) =>{
  const response = await axios.patch(FIRST_PATCH_ASSESSMENT+QUERY,OngoingDoc)
  return response
};

export const patchAttemptAssessment = async (QUERY:string,OngoingDoc:Object) =>{
  const response = await axios.patch(PATCH_ASSESSMENT+QUERY,OngoingDoc)
  return response
}

export const checkAssessmentStatus = async (QUERY:string) =>{
  const response = await axios.get<getAttemptAssessmentResponse>(CHECK_ASSESSMENT_STATUS+QUERY)
  return response.data.attemptAssessmentDoc
}

export const getAssessment = async (QUERY: string) => {
  const response = await axios.get<getAssessmentResponse>(STUDENT_ASSESSMENT + QUERY);
  const data: Assessment = response.data.assessment;
  return data;
};

export const getAssessmentAnswers = async (QUERY:string) => {
  const response = await axios.get<getAnswersResponse>(GET_ANSWERS+QUERY)
  return response.data.answersData
}

export const getAttemptAssessments = async () =>{
  const response = await axios.get<getAssessmentsResponse>(GET_ATTEMPT_ASSESSMENTS)
  return response.data.attemptAssessmentDocs
}


  

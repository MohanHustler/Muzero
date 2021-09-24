import axios from 'axios';
import { Assessment } from '../contracts/assessment_interface';
import { ASSESSMENTS_ROUTE , ASSESSMENT_ROUTE, DISTINCT_ASSESSMENTS ,DUPLICATE_ASSESSMENT , GET_QUESTIONS, TOPICS_ROUTE, BATCHES_ROUTE,ASSIGN_ASSESSMENT_ROUTE, GET_STUDENTS_DATA } from './routes';
import { getAssessmentsResponse , getAssignedAssessmentsResponse, getCreateAssessmentCopyResponse, getAssessmentResponse,getTopicsResponse , getBatchesResponse , getStudentsDataResponse } from "./contracts"


export const getAssessmentsForTutor = async (privateBool:boolean) => {
  const response = await axios.get<getAssessmentsResponse>(ASSESSMENTS_ROUTE,{params:{
    private:privateBool
  }});
  return response.data.assessmentList;
};

export const getAssessment = async (QUERY: string) => {
  const response = await axios.get<getAssessmentResponse>(ASSESSMENT_ROUTE + QUERY);
  const data: Assessment = response.data.assessment;
  return data;
};

export const deleteAssessment = async (QUERY: string) => {
  const response = await axios.delete(ASSESSMENT_ROUTE + QUERY);
  return response
}

export const patchAssessment = async (
  QUERY: string,
  assessment: Assessment
) => {
  const response = await axios.patch(ASSESSMENT_ROUTE + QUERY, assessment,{
    headers: { 'content-type': 'application/json' },
  });
  return response;
};

export const getTopics = async (QUERY: string) => {
  const response = await axios.get<getTopicsResponse>(TOPICS_ROUTE + QUERY);
  return response.data.topics;
};

export const getQuestions = async (
  boardname: string,
  classname: string,
  subjectname: string
) => {
  const response = await axios.get(GET_QUESTIONS, {
    params: {
      boardname,
      classname,
      subjectname,
    },
  });
  return response.data;
};

export const addAssessment = async (assessment: Object) => {
  const response = await axios.post<getAssessmentResponse>(ASSESSMENT_ROUTE, assessment, {
    headers: { 'content-type': 'application/json' },
  });
  return response.data.assessment;
};

export const assignAssessment = async  (assessmentData: Object , studentArray :Array<string>) =>{
  const response  = await axios.post(ASSIGN_ASSESSMENT_ROUTE,{assessmentData:assessmentData,studentArray:studentArray},{
    headers: { 'content-type': 'application/json' },
  })
  return response
}


export const getBatches = async (queryData:Object) =>{
  const response = await axios.get<getBatchesResponse>(BATCHES_ROUTE,{params:queryData})
  return response.data.batchList
}

export const getStudentsData = async () =>{
  const response = await axios.get<getStudentsDataResponse>(GET_STUDENTS_DATA)
  return response.data.studentInfo
}

export const getAssignedAssessmentData = async() =>{
  const response = await axios.get<getAssignedAssessmentsResponse>(DISTINCT_ASSESSMENTS)
  return response.data.assessmentArr
}

export const createAssessmentCopy = async (assessmentData:Assessment) =>{
  const response = await axios.post<getCreateAssessmentCopyResponse>(DUPLICATE_ASSESSMENT,{assessmentData:assessmentData})
  return response.data.assessmentDoc
}
const API_ROUTE = process.env.REACT_APP_API;
const BASE_ROUTE = API_ROUTE+"/assessment"
const QUESTION_ROUTE = API_ROUTE+"/assessmentquestion"
const BATCH_ROUTE =API_ROUTE+"/batch"
const ATTEMPT_ROUTE = API_ROUTE+"/attemptassessment"
export const ASSESSMENT_ROUTE =
  BASE_ROUTE + 
  '/assessment'

export const ASSESSMENTS_ROUTE = 
 BASE_ROUTE + 
 '/assessments'

export const ASSESSMENT_PATCH_ROUTE = 
BASE_ROUTE + 
'/editassessment'

export const GET_QUESTIONS =
  BASE_ROUTE +
   '/assessment/questions';


export const TOPICS_ROUTE = 
  QUESTION_ROUTE + 
  '/getTopics'


export const BATCHES_ROUTE = 
  BATCH_ROUTE+'/batchsearch'


export const ASSIGN_ASSESSMENT_ROUTE = 
BASE_ROUTE + '/assignassessment'

export const GET_STUDENTS_DATA = 
ATTEMPT_ROUTE+'/getStudents'

export const DISTINCT_ASSESSMENTS = 
ATTEMPT_ROUTE + '/getAssignedAssessments'

export const DUPLICATE_ASSESSMENT = 
BASE_ROUTE + '/copyAssessment'
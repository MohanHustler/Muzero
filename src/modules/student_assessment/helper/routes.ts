const API_ROUTE = process.env.REACT_APP_API;
const BASE_ROUTE = API_ROUTE+'/attemptassessment'
const ASSESSMENT_ROUTE = API_ROUTE+'/assessment'



export const PATCH_ASSESSMENT = 
BASE_ROUTE + '/patchAssessment'


export const FIRST_PATCH_ASSESSMENT = 
BASE_ROUTE + '/firstPatchAssessment'


export const CHECK_ASSESSMENT_STATUS = 
BASE_ROUTE + '/checkStatus'


export const STUDENT_ASSESSMENT = 
ASSESSMENT_ROUTE+'/assessmentstudent'

export const GET_ANSWERS = 
BASE_ROUTE + '/getAnswers'

export const GET_ATTEMPT_ASSESSMENTS = 
BASE_ROUTE + "/attemptassessments"
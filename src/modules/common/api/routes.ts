const BASE_ROUTE = process.env.REACT_APP_API;

export const GENERATE_OTP = BASE_ROUTE + '/otp/generateOTP';
export const VALIDATE_OTP = BASE_ROUTE + '/otp/validateOTP';
export const CHECK_ORG_CODE = BASE_ROUTE + '/auth/checkOrgCode';
export const LOGIN = BASE_ROUTE + '/auth/authenticate';
export const REGISTER = BASE_ROUTE + '/auth/register';
export const SET_PASSWORD = BASE_ROUTE + '/auth/setPassword';
export const VERIFY_CAPTCHA = BASE_ROUTE + '/auth/verifyCaptcha';

export const GET_MASTER_CHAPTERS = BASE_ROUTE + '/masterdata/getChapterList';
export const GET_CUSTOM_CHAPTERS = BASE_ROUTE + '/chapter/chapters';
export const CREATE_COURSE_CHAPTER = BASE_ROUTE + '/chapter/create';
export const UPDATE_CHAPTER = BASE_ROUTE + '/chapter/update';
export const DELETE_CHAPTER = BASE_ROUTE + '/chapter/delete';

export const GET_BOARDS = BASE_ROUTE + '/masterdata/getBoardsList';
export const GET_CLASSES = BASE_ROUTE + '/masterdata/getClassList';
export const GET_QUALIFICATIONS =
  BASE_ROUTE + '/masterdata/getQualificationList';

export const GET_CITY_SCHOOLS =
  BASE_ROUTE + '/masterdata/getSchoolsByCity';
export const GET_CITIES =
  BASE_ROUTE + '/masterdata/getCities';
export const GET_CITY_BY_PIN_CODE =
  BASE_ROUTE + '/masterdata/getCitiesByPinCode/';
export const GET_SUBJECTS =
  BASE_ROUTE + '/masterdata/getSubjectList';

export const GET_TUTOR_SUBJECTS = BASE_ROUTE + '/profiles/getCoursesForTutor';

export const GET_STUDENT = BASE_ROUTE + '/profiles/getStudent';
export const GET_PARENT = BASE_ROUTE + '/profiles/getParent';

export const GET_TUTOR_STUDENTS = BASE_ROUTE + '/profiles/getStudentsByTutor';
export const UPDATE_TUTOR_STUDENTS =
  BASE_ROUTE + '/profiles/addStudentsByTutor';

export const GET_TUTOR = BASE_ROUTE + '/profiles/getTutor';
export const UPDATE_TUTOR = BASE_ROUTE + '/profiles/addTutor';
export const UPDATE_STUDENT = BASE_ROUTE + '/profiles/updateStudent';
export const UPDATE_PARENT = BASE_ROUTE + '/profiles/updateParent';
export const DELETE_STUDENT = BASE_ROUTE + '/profiles/removeStudentsForTutor';

export const SET_CHANGE_PASSWORD = BASE_ROUTE + '/profiles/changePassword';

export const GET_ORGANIZATION = BASE_ROUTE + '/org/getOrganization';
export const UPDATE_ORGANIZATION = BASE_ROUTE + '/org/addOrganization';
export const ADD_ORGANIZATION_TUTORS = BASE_ROUTE + '/org/addTutors';
export const GET_ORGANIZATION_TUTORS = BASE_ROUTE + '/org/tutors';
export const DELETE_ORGANIZATION_TUTORS = BASE_ROUTE + '/org/removeTutors';
export const UPDATE_ORG_TUTOR = BASE_ROUTE + '/org/updateTutor';
export const GET_ORG_SUBJECTS = BASE_ROUTE + '/org/getCourses';
export const GET_ORG_STUDENTS = BASE_ROUTE + '/org/getStudents';
export const ADD_ORG_STUDENTS = BASE_ROUTE + '/org/addStudents';
export const DELETE_ORG_STUDENT = BASE_ROUTE + '/org/removeStudents';

export const GET_ADMIN = BASE_ROUTE + '/admin/getAdmin';
export const UPDATE_ADMIN = BASE_ROUTE + '/admin/updateAdmin';

export const GET_BATCH_DETAILS = BASE_ROUTE + '/batch/detail';

export const CREATE_TUTOR_BATCH = BASE_ROUTE + '/batch/create';
export const DELETE_TUTOR_BATCH = BASE_ROUTE + '/batch/delete';
export const UPDATE_TUTOR_BATCH = BASE_ROUTE + '/batch/update';
export const GET_BATCHES = BASE_ROUTE + '/batch/batches';


export const GET_ASSESSMENT = BASE_ROUTE + '/assessment'


export const CREATE_ORG_BATCH = BASE_ROUTE + '/org/batch/create';
export const DELETE_ORG_BATCH = BASE_ROUTE + '/org/batch/delete';
export const UPDATE_ORG_BATCH = BASE_ROUTE + '/org/batch/update';
export const GET_ORG_BATCHES = BASE_ROUTE + '/org/batch/batches';

export const CREATE_ORG_SCHEDULE = BASE_ROUTE + '/org/schedule/create';
export const UPDATE_ORG_SCHEDULE = BASE_ROUTE + '/schedule/update';
export const DELETE_ORG_SCHEDULE = BASE_ROUTE + '/org/schedule/delete';

export const GET_SCHEDULES = BASE_ROUTE + '/schedule/schedules';
export const GET_STUDENT_SCHEDULES = BASE_ROUTE + '/schedule/studentSchedules';
export const GET_PARENT_SCHEDULES = BASE_ROUTE + '/schedule/parentSchedules';
export const CREATE_TUTOR_SCHEDULE = BASE_ROUTE + '/schedule/create';
export const UPDATE_TUTOR_SCHEDULE = BASE_ROUTE + '/schedule/update';
export const DELETE_TUTOR_SCHEDULE = BASE_ROUTE + '/schedule/delete';

export const GET_CONTENT_DETAILS = BASE_ROUTE + '/content/detail';
export const GET_CONTENTS = BASE_ROUTE + '/content/contents';
export const GET_CHAPTER_CONTENT = BASE_ROUTE + '/chapter/detail';
export const DELETE_CHAPTER_CONTENT = BASE_ROUTE + '/content/delete';

export const CREATE_CHAPTER_CONTENT = BASE_ROUTE + '/content/create';
export const UPDATE_CHAPTER_CONTENT = BASE_ROUTE + '/content/update';

export const DELETE_ORG_CHAPTER_CONTENT = BASE_ROUTE + '/org/content/delete';
export const CREATE_ORG_CHAPTER_CONTENT = BASE_ROUTE + '/org/content/create';
export const GET_ORG_CHAPTER_CONTENT_UPLOAD_URL =
  BASE_ROUTE + '/org/content/getsignedurlforupload';

export const GET_STUDENT_CONTENT_DOWNLOAD_URL =
  BASE_ROUTE + '/content/student/getsignedurlfordownload';
export const GET_CHAPTER_CONTENT_UPLOAD_URL =
  BASE_ROUTE + '/content/getsignedurlforupload';
export const GET_KYC_DOCUMENT_UPLOAD_URL =
  BASE_ROUTE + '/profiles/getUploadUrlForKYCDoc';
export const UPDATE_KYC_DOCUMENT_URL =
  BASE_ROUTE + '/profiles/updateKYCDocsByTutor';
export const UPLOAD_ZIP = BASE_ROUTE + '/profiles/uploadZip';

export const GET_QUIZ_RESULT = BASE_ROUTE + '/studentcontent/viewresults';
export const START_QUIZ = BASE_ROUTE + '/studentcontent/create';
export const GET_STUDENT_QUIZZES = BASE_ROUTE + '/studentcontent/contents';
export const GET_STUDENT_QUIZ = BASE_ROUTE + '/studentcontent/details';
export const SUBMIT_STUDENT_QUIZ = BASE_ROUTE + '/studentcontent/saveAnswers';

export const CREATE_BATCH_CHAPTER = BASE_ROUTE + '/batchchapter/create';
export const GET_STUDENT_CHAPTERS =
  BASE_ROUTE + '/batchchapter/studentChapters';

export const GET_TUTOR_MEET_ROOM = BASE_ROUTE + '/schedule/tutorroom';

export const GET_STUDENT_MEET_ROOM = BASE_ROUTE + '/schedule/studentroom';

export const GET_AZURE_LOCATIONS =
  'https://atlas.microsoft.com/search/address/json';

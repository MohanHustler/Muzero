import axios from 'axios';
import {
  CREATE_CHAPTER_CONTENT,
  CREATE_TUTOR_BATCH,
  CREATE_COURSE_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER,
  CREATE_TUTOR_SCHEDULE,
  UPDATE_TUTOR_SCHEDULE,
  DELETE_TUTOR_BATCH,
  DELETE_TUTOR_SCHEDULE,
  GET_QUALIFICATIONS,
  GET_CITIES,
  GET_CITY_SCHOOLS,
  GET_SUBJECTS,
  GET_BATCHES,
  GET_SCHEDULES,
  GET_STUDENT_SCHEDULES,
  GET_PARENT_SCHEDULES,
  GET_TUTOR_SUBJECTS,
  GET_MASTER_CHAPTERS,
  GET_CUSTOM_CHAPTERS,
  GET_STUDENT_CONTENT_DOWNLOAD_URL,
  GET_CHAPTER_CONTENT_UPLOAD_URL,
  GET_CHAPTER_CONTENT,
  DELETE_CHAPTER_CONTENT,
  GET_TUTOR_STUDENTS,
  GET_BATCH_DETAILS,
  GET_CONTENT_DETAILS,
  GET_CONTENTS,
  CREATE_BATCH_CHAPTER,
  GET_STUDENT_CHAPTERS,
  START_QUIZ,
  GET_STUDENT_QUIZZES,
  GET_STUDENT_QUIZ,
  SUBMIT_STUDENT_QUIZ,
  GET_QUIZ_RESULT,
  GET_TUTOR_MEET_ROOM,
  GET_STUDENT_MEET_ROOM,
  UPDATE_CHAPTER_CONTENT,
  GET_CLASSES,
  GET_BOARDS,
  UPDATE_TUTOR_BATCH,
  GET_CITY_BY_PIN_CODE,
  UPDATE_ORG_BATCH,
} from './routes';
import { Batch } from '../../academics/contracts/batch';
import {
  ChapterContentDownloadUrlRequest,
  ChapterContentDownloadUrlResponse,
  ChapterContentFileRequest,
  CreateChapterContentRequest,
  FetchChapterContentRequest,
  FetchChapterContentResponse,
  ChapterContentUploadUrlRequest,
  ChapterContentUploadUrlResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  FetchCourseChapterRequest,
  FetchCustomChapterRequest,
  FetchCustomChapterResponse,
  DeleteChapterContentRequest,
  FetchContentDetailsRequest,
  FetchContentsRequest,
  FetchContentListResponse,
  FetchContentResponse,
  FetchMasterChapterRequest,
  FetchMasterChapterResponse,
  FetchScheduleListResponse,
  FetchScheduleResponse,
  DeleteScheduleRequest,
  FetchBatchDetailsRequest,
  FetchBatchDetailsResponse,
  CreateBatchChapterRequest,
  StartQuizRequest,
  GetStudentQuizzesRequest,
  GetStudentQuizDetailRequest,
  SubmitStudentQuizDetailRequest,
  FetchQuizResultRequest,
  FetchQuizResultListResponse,
  FetchQuizResultDetailResponse,
  FetchTutorRoomRequest,
  FetchRoomResponse,
  FetchStudentRoomRequest,
  UpdateChapterContentRequest,
  CreateCourseChapter,
  FetchClassesListResponse,
  FetchBoardsListResponse,
  FetchCitySchoolsRequest,
  FetchBatchListResponse,
  BatchChapterResponse,
  CourseListResponse,
  FetchCitiesByPinCodeRequest,
} from '../contracts/academic';
import { QuizContentResponse } from '../../academics/contracts/chapter_content';
import { Qualification } from '../../academics/contracts/qualification';
import { School } from '../../academics/contracts/school';
import { City } from '../../academics/contracts/city';
import { Subject } from '../../academics/contracts/subject';
import { StudentsResponse } from '../contracts/user';

export const fetchMasterChaptersList = async (
  params: FetchMasterChapterRequest
) => {
  const response = await axios.get<FetchMasterChapterResponse>(
    GET_MASTER_CHAPTERS,
    {
      params
    }
  );

  return response.data.chapterDetailsList;
};

export const fetchCustomChaptersList = async (
  params: FetchCustomChapterRequest
) => {
  const response = await axios.get<FetchCustomChapterResponse>(
    GET_CUSTOM_CHAPTERS,
    { params }
  );
  return response.data.chapterList;
};

export const fetchCourseChaptersList = async ({
  boardname,
  classname,
  subjectname
}: FetchCourseChapterRequest) => {
  const masterChaptersPromise = fetchMasterChaptersList({
    boardname: boardname,
    classname: classname,
    subjectname: subjectname
  });

  const customChaptersPromise = fetchCustomChaptersList({
    boardname,
    classname,
    subjectname
  });

  const [masterChapters, customChapters] = await Promise.all([
    masterChaptersPromise,
    customChaptersPromise
  ]);

  return {
    masterChapters,
    customChapters
  };
};

export const fetchChapterContent = async (
  params: FetchChapterContentRequest
) => {
  const response = await axios.get<FetchChapterContentResponse>(
    GET_CHAPTER_CONTENT,
    { params }
  );

  return response.data.chapter;
};

export const fetchContentDetails = async (
  params: FetchContentDetailsRequest
) => {
  const response = await axios.get<FetchContentResponse>(GET_CONTENT_DETAILS, {
    params
  });

  return response.data.content;
};

export const fetchContents = async (params: FetchContentsRequest) => {
  const response = await axios.get<FetchContentListResponse>(GET_CONTENTS, {
    params
  });

  return response.data.contentList;
};

export const fetchTutorCoursesList = async () => {
  const response = await axios.get<CourseListResponse>(GET_TUTOR_SUBJECTS);
  return response.data.courseList;
};

export const fetchQualificationsList = async () => {
  const response = await axios.get<{ qualificationDetails: Qualification[] }>(
    GET_QUALIFICATIONS
  );

  return response.data.qualificationDetails;
};

export const fetchCitySchoolsList = async (params: FetchCitySchoolsRequest) => {
  const response = await axios.get<{ schoolList: School[] }>(GET_CITY_SCHOOLS, {
    params
  });

  return response.data.schoolList;
};

export const fetchCitiesList = async () => {
  const response = await axios.get<{ cityList: City[] }>(GET_CITIES);

  return response.data.cityList;
};

export const fetchCitiesByPinCode = async (params: FetchCitiesByPinCodeRequest) => {
  const response = await axios.get<{ cityList: City[]}>(GET_CITY_BY_PIN_CODE, {params});  
  return response.data.cityList;
}

export const fetchSubjectsList = async (
  params: {boardname: string, classname : string}) => {
  const response = await axios.get<{ subjectList: Subject[] }>(GET_SUBJECTS,
    { params });
  return response.data.subjectList;
};

export const fetchBatchDetails = async (params: FetchBatchDetailsRequest) => {
  const response = await axios.get<FetchBatchDetailsResponse>(
    GET_BATCH_DETAILS,
    { params }
  );

  return response.data.batch;
};

export const fetchBatchesList = async () => {
  const response = await axios.get<FetchBatchListResponse>(GET_BATCHES);
  return response.data.batchList;
};

export const fetchTutorStudentsList = async () => {
  const response = await axios.get<StudentsResponse>(GET_TUTOR_STUDENTS);
  return response.data.studentList;
};

export const fetchStudentContentDownloadUrl = async (
  params: ChapterContentDownloadUrlRequest
) => {
  const response = await axios.get<ChapterContentDownloadUrlResponse>(
    GET_STUDENT_CONTENT_DOWNLOAD_URL,
    {
      params
    }
  );

  return response.data;
};

export const fetchChapterContentUploadUrl = async (
  params: ChapterContentUploadUrlRequest
) => {
  const response = await axios.get<ChapterContentUploadUrlResponse>(
    GET_CHAPTER_CONTENT_UPLOAD_URL,
    {
      params
    }
  );

  return response.data;
};

export const deleteChapterContent = async (
  data: DeleteChapterContentRequest
) => {
  const response = await axios.delete(DELETE_CHAPTER_CONTENT, {
    data
  });

  return response.data;
};

export const fetchUploadUrlForChapterContent = async (chapter: {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}) => {
  const response = await axios.get<{ url: string; uuid: string }>(
    GET_CHAPTER_CONTENT_UPLOAD_URL,
    { params: chapter }
  );

  return response.data;
};

export const uploadFileOnUrl = async (url: string, file: File) => {
  const formData = new FormData();
  // formData.append("Content-Type", file.type);
  // Object.entries(url.fields).forEach(([k, v]) => {
  //   formData.append(k, v);
  // });
  formData.append('file', file);

  const response = await axios.put(url, formData);

  return response.data;
};

export const downloadFile = async (url: string) => {
  const response = await axios.get(url);

  return response.data;
};

export const createChapterContent = async (
  data: CreateChapterContentRequest
) => {
  const response = await axios.post(CREATE_CHAPTER_CONTENT, data);

  return response.data;
};

export const updateChapterContent = async (
  data: UpdateChapterContentRequest
) => {
  const response = await axios.put(UPDATE_CHAPTER_CONTENT, data);

  return response.data;
};

export const createChapterContentFile = async (
  data: ChapterContentFileRequest
) => {
  const response = await axios.post(CREATE_CHAPTER_CONTENT, data);

  return response.data;
};

export const createTutorBatch = async (batch: Batch) => {
  const response = await axios.post(CREATE_TUTOR_BATCH, batch);
  return response.data;
};

export const createCourseChapter = async (chapter: CreateCourseChapter) => {
  const response = await axios.post(CREATE_COURSE_CHAPTER, chapter);

  return response.data;
};

export const updateChapter = (data: {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  newchaptername: string;
}) => {
  return axios.put(UPDATE_CHAPTER, data);
};

export const deleteChapter = (chapter: {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}) => {
  return axios.delete(DELETE_CHAPTER, {
    data: chapter
  });
};

export const deleteTutorBatch = (batch: Batch) => {
  return axios.delete(DELETE_TUTOR_BATCH, {
    data: batch
  });
};

export const updateTutorBatch = (batch: Batch) => {
  return axios.put(UPDATE_TUTOR_BATCH, batch);
};

export const fetchSchedulesList = async () => {
  const response = await axios.get<FetchScheduleListResponse>(GET_SCHEDULES);
  return response.data.scheduleList;
};

export const fetchStudentSchedulesList = async () => {
  const response = await axios.get<FetchScheduleListResponse>(
    GET_STUDENT_SCHEDULES
  );
  return response.data.scheduleList;
};

export const fetchParentSchedulesList = async () => {
  const response = await axios.get<FetchScheduleListResponse>(
    GET_PARENT_SCHEDULES
  );
  return response.data.scheduleList;
};

export const createTutorSchedule = async (batch: CreateScheduleRequest) => {
  const response = await axios.post<FetchScheduleResponse>(
    CREATE_TUTOR_SCHEDULE,
    batch
  );
  return response.data.schedule;
};

export const updateTutorSchedule = async (batch: UpdateScheduleRequest) => {
  return await axios.put(UPDATE_TUTOR_SCHEDULE, batch);
};

export const deleteTutorSchedule = (data: DeleteScheduleRequest) => {
  return axios.delete(DELETE_TUTOR_SCHEDULE, {
    data
  });
};

export const createBatchChapter = async (data: CreateBatchChapterRequest) => {
  const response = await axios.post(CREATE_BATCH_CHAPTER, data);

  return response.data;
};

export const getStudentChapters = async () => {
  const response = await axios.get<BatchChapterResponse>(GET_STUDENT_CHAPTERS);

  return response.data.batchChapters;
};

export const startStudentsQuiz = async (data: StartQuizRequest) => {
  const response = await axios.post(START_QUIZ, data);

  return response.data;
};

export const getStudentsQuizzes = async (params: GetStudentQuizzesRequest) => {
  const response = await axios.get<FetchQuizResultListResponse>(
    GET_STUDENT_QUIZZES,
    { params }
  );

  return response.data.contentList;
};

export const getStudentsQuizDetails = async (
  params: GetStudentQuizDetailRequest
) => {
  const response = await axios.get<QuizContentResponse>(GET_STUDENT_QUIZ, {
    params
  });

  return response.data.content;
};

export const submitStudentsQuiz = async (
  data: SubmitStudentQuizDetailRequest
) => {
  const response = await axios.put<FetchQuizResultDetailResponse>(
    SUBMIT_STUDENT_QUIZ,
    data
  );

  return response.data.content;
};

export const fetchQuizResult = async (data: FetchQuizResultRequest) => {
  const response = await axios.post<FetchQuizResultListResponse>(
    GET_QUIZ_RESULT,
    data
  );

  return response.data.contentList;
};

export const fetchTutorMeetRoom = async (params: FetchTutorRoomRequest) => {
  const response = await axios.get<FetchRoomResponse>(GET_TUTOR_MEET_ROOM, {
    params
  });

  return response.data;
};

export const fetchStudentMeetRoom = async (params: FetchStudentRoomRequest) => {
  const response = await axios.get<FetchRoomResponse>(GET_STUDENT_MEET_ROOM, {
    params
  });

  return response.data;
};

export const fetchBoardsList = async () => {
  const response = await axios.get<FetchBoardsListResponse>(GET_BOARDS);

  return response.data.boardDetailsList;
};

export const fetchClassesList = async (params: { boardname: string }) => {
  const response = await axios.get<FetchClassesListResponse>(GET_CLASSES, {
    params
  });

  return response.data.classList;
};

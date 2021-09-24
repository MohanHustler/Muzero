import { Batch } from '../../academics/contracts/batch';
import { Board } from '../../academics/contracts/board';
import { QuestionServer } from '../../academics/contracts/question';
import { Schedule } from '../../academics/contracts/schedule';
import { Standard } from '../../academics/contracts/standard';
import { Course } from '../../academics/contracts/course';
import { ContentType } from '../../academics/enums/content_type';
import { Student } from './user';
import { ChapterContent } from '../../academics/contracts/chapter_content';

export interface CreateCourseChapter {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}

export interface FetchMasterChapterRequest {
  boardname: string;
  classname: string;
  subjectname: string;
}

export interface FetchMasterChapterResponse {
  chapterDetailsList: { chapter: { name: string } }[];
}

export interface FetchCustomChapterRequest {
  boardname: string;
  classname: string;
  subjectname: string;
}

export interface FetchCustomChapterResponse {
  chapterList: CustomChapter[];
}

export interface CustomChapter {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}

export interface FetchCourseChapterRequest {
  boardname: string;
  classname: string;
  subjectname: string;
}

export interface FetchChapterContentRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}

export interface ChapterDetail {
  contents: {
    questions: string[];
    chapter: string;
    contentname: string;
    uuid: string;
    contenttype: ContentType;
  }[];
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}

export interface FetchChapterContentResponse {
  chapter: ChapterDetail;
}

export interface FetchContentDetailsRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contentname: string;
}

export interface FetchContentsRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
}

export interface ContentDetail {
  questions: QuestionServer[];
  chapter: string;
  contentname: string;
  contenttype: string;
  duration: number;
  marks: number;
  title: string;
}

export interface FetchContentListResponse {
  contentList: ContentDetail[];
}

export interface FetchContentResponse {
  content: ContentDetail;
}

export interface DeleteChapterContentRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contentname: string;
}

export interface ChapterContentDownloadUrlRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  tutorId: string;
  uuid: string;
}

export interface ChapterContentDownloadUrlResponse {
  url: string;
}

export interface ChapterContentUploadUrlRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contenttype: string;
  contentlength: number;
}

export interface ChapterContentUploadUrlResponse {
  // url : UploadUrlRequest;
  url: string;
  uuid: string;
}

export interface ChapterContentFileRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contenttype: string;
  contentlength: number;
  contentname: string;
  uuid: string;
}

export interface CreateChapterContentRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contenttype: string;
  contentname: string;
  title?: string;
  duration?: number;
  marks?: number;
  uuid?: string;
  questions?: QuestionServer[];
}

export interface UpdateChapterContentRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contenttype: string;
  contentname: string;
  title?: string;
  duration?: number;
  marks?: number;
  uuid?: string;
  questions?: QuestionServer[];
}

export interface FetchBatchDetailsRequest {
  batchfriendlyname: string;
}

export interface FetchBatchListResponse {
  batchList: Batch[];
}

export interface FetchBatchDetailsResponse {
  batch: BatchResponse;
}

export interface BatchResponse {
  students: {
    _id: string;
    batches: string[];
    mobileNo: string;
    studentName: string;
    className: string;
    schoolName: string;
    boardName: string;
  }[];
  schedules: {
    batch: string;
    dayname: string;
    fromhour: string;
    tohour: string;
  }[];
  content: [];
  boardname: string;
  classname: string;
  subjectname: string;
  batchfriendlyname: string;
  batchenddate: string;
  batchstartdate: string;
  batchicon: string;
}

export interface ScheduleDetail {
  _id?: string;
  dayname: string;
  fromhour: string;
  tohour: string;
  batch: Batch;
  ownerId: string;
  mobileNo: string;
}

export interface FetchScheduleListResponse {
  scheduleList: ScheduleDetail[];
}

export interface FetchScheduleResponse {
  schedule: ScheduleDetail;
}

export interface CreateScheduleRequest {
  batchfriendlyname: string;
  schedules: Schedule[];
}

export interface UpdateScheduleRequest {
  scheduleId?: string;
  dayname: string;
  fromhour: string;
  tohour: string;
}

export interface UploadUrlRequest {
  url: string;
  fields: UrlFields;
}

export interface UrlFields {
  key: string;
  bucket: string;
  'X-Amz-Algorithm': string;
  'X-Amz-Credential': string;
  'X-Amz-Date': string;
  Policy: string;
  'X-Amz-Signature': string;
}

export interface DeleteScheduleRequest {
  dayname: string;
  fromhour: string;
  tutorId?: string;
}

export interface CreateBatchChapterRequest {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  batchfriendlyname: string;
}

export interface StartQuizRequest {
  batchfriendlyname: string;
  contentname: string;
}

export interface GetStudentQuizzesRequest {
  tutorId: string;
}

export interface GetStudentQuizDetailRequest {
  tutorId: string;
  contentname: string;
}

export interface QuizAnswer {
  serialNo?: number;
  selectedOption: string;
  isCorrect: string;
}

export interface SubmitStudentQuizDetailRequest {
  tutorId: string;
  contentname: string;
  answers: QuizAnswer[];
}

export interface FetchQuizResultRequest {
  batchfriendlyname: string;
  contentname: string;
}

export interface QuizResult {
  attempted: number;
  content: ChapterContent;
  correct: number;
  isFinished: Boolean;
  total: number;
  tutorMobileNo: string;
  student: Student;
}

export interface FetchQuizResultListResponse {
  contentList: QuizResult[];
}

export interface FetchQuizResultDetailResponse {
  content: QuizResult;
}

export interface BatchChapterResponse {
  batchChapters: BatchChapter[];
}

export interface BatchChapter {
  chapter: Chapter;
}

export interface Chapter {
  boardname: string;
  classname: string;
  subjectname: string;
  chaptername: string;
  contents: Content[];
}

export interface Content {
  ownerId: string;
  contentname: string;
  uuid: string;
  contenttype: string;
}

export interface FetchTutorRoomRequest {
  fromhour: string;
  dayname: string;
}

export interface FetchRoomResponse {
  roomid: string;
}

export interface FetchStudentRoomRequest {
  tutorId: string;
  fromhour: string;
  dayname: string;
}

export interface FetchBoardsListResponse {
  boardDetailsList: Board[];
}

export interface FetchClassesListResponse {
  classList: Standard[];
}

export interface FetchCitySchoolsRequest {
  cityName: string;
}

export interface FetchCitiesByPinCodeRequest {
  pinCode: string;
}

export interface CourseListResponse {
  courseList: Course[];
}

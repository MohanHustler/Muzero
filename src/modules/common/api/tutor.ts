import axios from 'axios';
import {
  GET_TUTOR_SUBJECTS,
  GET_TUTOR_STUDENTS,
  GET_STUDENT,
  GET_TUTOR,
  GET_PARENT,
  UPDATE_TUTOR_STUDENTS,
  GET_ASSESSMENT
} from './routes';
import { Student, TutorResponse } from '../../common/contracts/user';
import { Course } from '../../academics/contracts/course';
import {CourseListResponse} from "../contracts/academic"
import {Assessment} from "../../assessment/contracts/assessment_interface";
import { getAssessmentsResponse,getAssessmentResponse } from '../contracts/tutor';

export const getCoursesOfTutor = async () => {
  const response = await axios.get<CourseListResponse>(GET_TUTOR_SUBJECTS);
  return response.data.courseList;
};



export const getAssessments = async () => {
  const response = await axios.get<getAssessmentsResponse>(GET_ASSESSMENT)
  return response.data.assessmentList
}

export const getAssessment  = async (QUERY:string) =>{
  const response = await axios.get<getAssessmentResponse>(GET_ASSESSMENT+QUERY)
  return response.data.assessment
}

export const updateStudentsOfTutor = async (
  students: Student[]
) => {
  const response = await axios.post<Student[]>(
    UPDATE_TUTOR_STUDENTS,
    { studentList: students }
  );

  return response.data;
};

export const getStudentsOfTutor = async () => {
  const response = await axios.get<Student[]>(GET_TUTOR_STUDENTS);

  return response.data;
};

export const getStudent = async () => {
  const response = await axios.get(GET_STUDENT);

  return response.data.student;
};

export const getParent = async () => {
  const response = await axios.get(GET_PARENT);

  return response.data.parent;
};

export const getTutor = async () => {
  const response = await axios.get<TutorResponse>(GET_TUTOR);

  return response.data.tutor;
};

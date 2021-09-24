import axios from 'axios';
import {
  GET_ORGANIZATION,
  UPDATE_ORGANIZATION,  
  ADD_ORGANIZATION_TUTORS,
  GET_ORGANIZATION_TUTORS,
  DELETE_ORGANIZATION_TUTORS,
  UPDATE_ORG_TUTOR,
  ADD_ORG_STUDENTS,
  GET_ORG_STUDENTS,
  DELETE_ORG_STUDENT,
  GET_ORG_SUBJECTS
} from './routes';
import { Organization, TutorsResponse, Tutor, StudentsResponse, Student } from '../contracts/user';
import {
  CourseListResponse
} from '../contracts/academic';

export const getOrganization = async () => {
  const response = await axios.get(GET_ORGANIZATION);
  return response.data.organization;
};

export const updateOrganization = async (organization: Organization) => {
  return axios.put(UPDATE_ORGANIZATION, organization);
};

export const addTutorsForOrganization = async (
  tutors: Tutor[]
) => {
  const response = await axios.post<Tutor[]>(ADD_ORGANIZATION_TUTORS, { tutorList: tutors });
  return response.data;
};

export const fetchOrgTutorsList = async () => {
  const response = await axios.get<TutorsResponse>(GET_ORGANIZATION_TUTORS);
  return response.data.tutorList;
};

export const deleteOrganizationTutors = async (tutors: string[]) => {
  return axios.delete(DELETE_ORGANIZATION_TUTORS, {
    data : { tutorList: tutors }
  });
};

export const updateOrgTutor = async(tutor: any) => {
  return axios.put(UPDATE_ORG_TUTOR, tutor);
}

export const getOrgStudentsList = async () => {
  const response = await axios.get<StudentsResponse>(GET_ORG_STUDENTS);
  return response.data.studentList;
};

export const addStudentsOfOrganization = async (
  students: Student[]
) => {
  const response = await axios.post<Student[]>(
    ADD_ORG_STUDENTS,
    { studentList: students }
  );
  return response.data;
};

export const deleteStudentsOfOrganization = async (students: string[]) => {
  return axios.delete(DELETE_ORG_STUDENT, {
    data : { studentList: students }
  });
};

export const fetchOrgCoursesList = async () => {
  const response = await axios.get<CourseListResponse>(GET_ORG_SUBJECTS);

  return response.data.courseList;
};

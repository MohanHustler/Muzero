import axios from 'axios';
import { GET_STUDENT, UPDATE_TUTOR, UPDATE_STUDENT, UPDATE_PARENT, DELETE_STUDENT, SET_CHANGE_PASSWORD, } from './routes';
import { Student, Tutor, Parent, StudentResponse } from '../contracts/user';

export const fetchStudent = async () => {
  const response = await axios.get<StudentResponse>(GET_STUDENT);

  return response.data.student;
};

export const updateTutor = async (tutor: Tutor) => {
  return axios.put(UPDATE_TUTOR, tutor);
};

export const updateStudent = async (student: Student) => {
  return axios.put(UPDATE_STUDENT, student);
};

export const updateParent = async (parent: Parent) => {
  return axios.put(UPDATE_PARENT, parent);
};

export const deleteStudents = async (students: string[]) => {
  return axios.delete(DELETE_STUDENT, {
    data : { studentList: students }
  });
};

export const setChangePassword = async (currPassword: string, newPassword: string) => {
  return axios.post(SET_CHANGE_PASSWORD, {currPassword, newPassword})
}
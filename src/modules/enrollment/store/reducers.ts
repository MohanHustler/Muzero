import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { setCurrentTutor, setCurrentStudent } from './actions';
import { CurrentTutor } from '../contracts/tutor';
import { CurrentStudent } from '../contracts/student';

const TUTOR: CurrentTutor = {
  mobileNo: '',
  name: '',
  email: '',
  schoolname: '',
  ownerId: '',
  qualifications: '',
  pinCode: '',
  cityName: '',
  stateName: '',
  tutorId: '',
  enrollmentId: ''
};
const tutor = createReducer(TUTOR, {
  [setCurrentTutor.type]: (_, action) => action.payload
});

const STUDENT: CurrentStudent = {
  name: '',
  enrollmentId: '',
  mobileNo: '',
  parentMobileNo: '',
  email: '',
  pincode: '',
  city: '',
  state: '',
  board: '',
  classname: '',
  schoolname: ''
};
const student = createReducer(STUDENT, {
  [setCurrentStudent.type]: (_, action) => action.payload
});

export const studentTutorReducer = combineReducers({
  tutor,
  student
});

import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { setSubjects, setTutorSubjects } from './actions';
import { Subject } from '../contracts/subject';
import { Course } from '../contracts/course';

const SUBJECTS: Subject[] = [];
const subjects = createReducer(SUBJECTS, {
  [setSubjects.type]: (_, action) => action.payload,
});

const TUTOR_SUBJECTS: Course[] = [];
const tutorSubjects = createReducer(TUTOR_SUBJECTS, {
  [setTutorSubjects.type]: (_, action) => action.payload,
});

export const academicsReducer = combineReducers({
  subjects,
  tutorSubjects,
});

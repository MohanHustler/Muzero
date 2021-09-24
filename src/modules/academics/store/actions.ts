import { createAction } from '@reduxjs/toolkit';
import { Subject } from '../contracts/subject';
import { Course } from '../contracts/course';

export const setSubjects = createAction(
  'SET_SUBJECTS',
  (subjects: Subject[]) => ({ payload: subjects })
);

export const setTutorSubjects = createAction(
  'SET_TUTOR_SUBJECTS',
  (subjects: Course[]) => ({ payload: subjects })
);

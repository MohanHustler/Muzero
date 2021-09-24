import { createAction } from '@reduxjs/toolkit';
import { CurrentTutor } from '../contracts/tutor';
import { CurrentStudent } from '../contracts/student';

export const setCurrentTutor = createAction(
  'SET_CURRENT_TUTOR',
  (tutor: CurrentTutor) => ({
    payload: tutor
  })
);

export const setCurrentStudent = createAction(
  'SET_CURRENT_STUDENT',
  (student: CurrentStudent) => ({
    payload: student
  })
);

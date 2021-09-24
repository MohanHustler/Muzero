import { combineReducers } from '@reduxjs/toolkit';
import { academicsReducer } from './modules/academics/store/reducers';
import { authReducer } from './modules/auth/store/reducers';
import { assessmentReducers } from './modules/assessment/store/reducers';
import { studentTutorReducer } from './modules/enrollment/store/reducers';
import { meetingReducer } from './modules/bbbconference/store/reducers';

export const rootReducer = combineReducers({
  academicsReducer,
  authReducer,
  assessmentReducers,
  studentTutorReducer,
  meetingReducer
});

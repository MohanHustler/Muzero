import { combineReducers, createReducer } from "@reduxjs/toolkit";
import { setAssessment, setQuestions } from "./actions";

const ASSESSMENT_INITAL_SETP = {};
const assessmentSetp = createReducer(ASSESSMENT_INITAL_SETP, {
  [setAssessment.type]: (_, action) => action.payload,
});

const QUESTIONS = {};
const questions = createReducer(QUESTIONS, {
  [setQuestions.type]: (_, action) => action.payload,
});

export const assessmentReducers = combineReducers({
  assessmentSetp,
  questions,
});

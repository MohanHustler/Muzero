import { combineReducers, createReducer } from "@reduxjs/toolkit";
import { setAssement, setQuestions } from "./actions";

const ASSESSMENT_INITAL_SETP = {};
const assessmentSetp = createReducer(ASSESSMENT_INITAL_SETP, {
  [setAssement.type]: (_, action) => action.payload,
});

const QUESTIONS = {};
const questions = createReducer(QUESTIONS, {
  [setQuestions.type]: (_, action) => action.payload,
});

export const assessmentReducers = combineReducers({
  assessmentSetp,
  questions,
});

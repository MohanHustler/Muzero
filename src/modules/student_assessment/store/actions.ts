import { createAction } from "@reduxjs/toolkit";
import { Assessment } from "../../assessment/contracts/assessment_interface";
import { QuestionBody } from "../../assessment/contracts/qustions_interface";

export const setAssement = createAction(
  "SET_ASSESSMENT_FIRST",
  (assessment: Assessment) => {
    localStorage.setItem("assessmentfirstpart", JSON.stringify(assessment));

    return {
      payload: assessment,
    }
  }
);

export const setQuestions = createAction(
  "SET_ASSESSMENT_all",
  (assessment: QuestionBody[]) => {
    localStorage.setItem("assessmentall", JSON.stringify(assessment));

    return {
      payload: assessment,
    };
  }
);

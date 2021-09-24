import { combineReducers, createReducer } from '@reduxjs/toolkit';
import {
  createNewMeeting,
  joinMeetingById,
  getMeetingInfoById,
  getRecordingInfoById,
  deleteRecordingInfoById
} from './actions';

const INITIAL_CREATE_MEETING_RESPONSE = {};
const createMeetingResponse = createReducer(INITIAL_CREATE_MEETING_RESPONSE, {
  [createNewMeeting.type]: (_, action) => action.payload
});

const INITIAL_JOIN_MEETING_RESPONSE = {};
const joinMeetingResponse = createReducer(INITIAL_JOIN_MEETING_RESPONSE, {
  [joinMeetingById.type]: (_, action) => action.payload
});

const INITIAL_GET_MEETING_INFO_RESPONSE = {};
const getMeetingInfoResponse = createReducer(
  INITIAL_GET_MEETING_INFO_RESPONSE,
  {
    [getMeetingInfoById.type]: (_, action) => action.payload
  }
);

const INITIAL_GET_RECORDING_INFO_RESPONSE = {};
const getRecordingInfoResponse = createReducer(
  INITIAL_GET_RECORDING_INFO_RESPONSE,
  {
    [getRecordingInfoById.type]: (_, action) => action.payload
  }
);

const INITIAL_DELETE_RECORDING_INFO_RESPONSE = {};
const deleteRecordingInfoResponse = createReducer(
  INITIAL_DELETE_RECORDING_INFO_RESPONSE,
  {
    [deleteRecordingInfoById.type]: (_, action) => action.payload
  }
);

export const meetingReducer = combineReducers({
  createMeetingResponse,
  joinMeetingResponse,
  getMeetingInfoResponse,
  getRecordingInfoResponse,
  deleteRecordingInfoResponse
});

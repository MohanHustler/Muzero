import axios from 'axios';
import { number } from 'yup';
import {
  CREATE_MEETING,
  JOIN_MEETING,
  GET_MEETING_INFO,
  GET_POST_MEETING_EVENTS_INFO,
  GET_RECORDING,
  DELETE_RECORDING,
  IS_MEETING_RUNNING,
  CREATE_WEBHOOK,
  GET_WEBHOOK_LIST,
  DELETE_WEBHOOK,
  GET_POST_INDIVIDUAL_MEETING_EVENTS_INFO,
  FEEDBACK
} from './routes';

export const createMeeting = async (meetingID: string, meetingName: string, scheduleID: string) => {
  const response = await axios.post(CREATE_MEETING, {
    meetingID,
    meetingName,
    scheduleID
  });
  return response.data;
};

export const joinMeeting = async (
  meetingID: string,
  joineeName: string,
  joineerole: string,
  userID: string
) => {
  const response = await axios.post(JOIN_MEETING, {
    meetingID,
    joineeName,
    joineerole,
    userID
  });
  return response.data;
};

export const isMeetingRunning = async (meetingID: string) => {
  const response = await axios.post(IS_MEETING_RUNNING, {
    meetingID
  });
  return response.data;
};

export const getMeetingInfo = async (meetingID: string) => {
  const response = await axios.post(GET_MEETING_INFO, {
    meetingID
  });
  return response.data;
};

export const getRecordingbyId = async (meetingID: string) => {
  const response = await axios.post(GET_RECORDING, {
    meetingID
  });
  return response.data;
};

export const getPostMeetingEventsInfo = async (meetingID: string) => {
  const response = await axios.get(GET_POST_MEETING_EVENTS_INFO, {params: {meetingID}})
  return response.data
}

export const getPostIndividualMeetingEventsInfo = async (internalMeetingID: string) => {
  const response = await axios.get(GET_POST_INDIVIDUAL_MEETING_EVENTS_INFO, {params: {internalMeetingID}})
  return response.data
}

export const deleteRecordingbyId = async (recordID: string) => {
  const response = await axios.post(DELETE_RECORDING, {
    recordID
  });
  return response.data;
};

export const createWebHook = async (meetingID: string) => {
  const response = await axios.post(CREATE_WEBHOOK, {
    meetingID
  });
  return response.data
}

export const deleteRecordingData = async (internalMeetingID: string) => {
  const response = await axios.get(DELETE_RECORDING, {params: {internalMeetingID}})
  return response.data
}

export const getWebbHookList = async (meetingID: string) => {
  const response = await axios.post(GET_WEBHOOK_LIST, {
    meetingID
  });
  return response.data
}

export const destroyWebHook = async (hookID: string) => {
  const response = await axios.post(DELETE_WEBHOOK, {
    hookID
  });
  return response.data
}

export const feedBack = async(interalMeetingID: string, rating: number, review: string) => {
  const response = await axios.post(FEEDBACK, {
    interalMeetingID,
    rating,
    review
  });
  return response.data
}
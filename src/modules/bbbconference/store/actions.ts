import { createAction } from '@reduxjs/toolkit';
import { xml2js } from 'xml-js'

export const createNewMeeting = createAction(
  'CREATE_NEW_MEETING',
  (createMeetingInfo: string) => {
    //Do Something
    //const jsResponse = xml2js(createMeetingInfo, { compact: true })
    return {
      payload: createMeetingInfo
    };
  }
);

export const joinMeetingById = createAction(
  'JOIN_MEETING_BY_ID',
  (joinUrl: string) => {
      //Do Something
      const redirect = () => {
        window.open(joinUrl)
      }
      setTimeout(redirect, 2000)
      return {
        payload: joinUrl
      }
  }
)

export const getMeetingInfoById = createAction(
  'GET_MEETING_INFO_BY_ID',
  (meetingInfo: string) => {
    //Do Something
    //const jsResponse = xml2js(meetingInfo, { compact: true })
    return {
      payload: meetingInfo
    }
  }
);

export const getRecordingInfoById = createAction(
  'GET_RECORDING_INFO_BY_ID',
  (recordingInfo: string) => {
    //Do Something
    //const jsResponse = xml2js(recordingInfo, { compact: true })
    return {
      payload: recordingInfo
    }
  }
);

export const deleteRecordingInfoById = createAction(
  'DELETE_RECORDING_INFO_BY_ID',
  (deleteRecordingInfo: string) => {
    //Do Something
    //const jsResponse = xml2js(deleteRecordingInfo, { compact: true })
    return {
      payload: deleteRecordingInfo
    }
  }
);
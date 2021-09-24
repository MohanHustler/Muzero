import { BBBEvents } from './bbbevent_interface';

export interface Meeting {
  _id: string;
  isRecorded: boolean;
  events: BBBEvents[];
  meetingID: string;
  internalMeetingID: string;
  scheduleID: string;
  meetingName: string;
  createDate: string;
  createTime: number;
  tutorID: string;
  tutorName: string;
  isRecordingDeleted?: boolean;
  recordingURL?: string;
}

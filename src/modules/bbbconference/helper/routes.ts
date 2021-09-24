const BASE_ROUTE = process.env.REACT_APP_API;
const MEETING_BASE_ROUTE = BASE_ROUTE + '/bbb';
const RECORDING_BASE_ROUTE = BASE_ROUTE + '/bbb/recordings';
const WEBHOOK_BASE_ROUTE = BASE_ROUTE + '/bbbhooks';

export const CREATE_MEETING = MEETING_BASE_ROUTE + '/create';

export const JOIN_MEETING = MEETING_BASE_ROUTE + '/join';

export const GET_MEETING_INFO = MEETING_BASE_ROUTE + '/info';

export const IS_MEETING_RUNNING = MEETING_BASE_ROUTE + '/ismeetingrunning';

export const GET_POST_MEETING_EVENTS_INFO = MEETING_BASE_ROUTE + '/getmeeting';

export const GET_POST_INDIVIDUAL_MEETING_EVENTS_INFO = MEETING_BASE_ROUTE + '/getindividualmeeting'

export const FEEDBACK = MEETING_BASE_ROUTE + '/feedback';

export const GET_RECORDING = RECORDING_BASE_ROUTE + '/recordinginfo';

export const DELETE_RECORDING = RECORDING_BASE_ROUTE + '/delete';

export const CREATE_WEBHOOK = WEBHOOK_BASE_ROUTE + '/create';

export const GET_WEBHOOK_LIST = WEBHOOK_BASE_ROUTE + '/lists';

export const DELETE_WEBHOOK = WEBHOOK_BASE_ROUTE + '/destroy';

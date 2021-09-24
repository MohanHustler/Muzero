import axios from 'axios';
import {
  CREATE_ORG_SCHEDULE,
  UPDATE_ORG_SCHEDULE,
  DELETE_ORG_SCHEDULE
} from './routes';
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  FetchScheduleResponse,
  DeleteScheduleRequest
} from '../contracts/academic';

export const createOrgSchedule = async (batch: CreateScheduleRequest) => {
  const response = await axios.post<FetchScheduleResponse>(
    CREATE_ORG_SCHEDULE,
    batch
  );
  return response.data.schedule;
};

export const updateOrgSchedule = async (batch: UpdateScheduleRequest) => {
  return await axios.put(UPDATE_ORG_SCHEDULE, batch);
};

export const deleteOrgSchedule = (data: DeleteScheduleRequest) => {
  return axios.delete(DELETE_ORG_SCHEDULE, {
    data
  });
};

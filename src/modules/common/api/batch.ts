import axios from 'axios';
import {
  CREATE_ORG_BATCH,
  DELETE_ORG_BATCH,
  GET_ORG_BATCHES,
  UPDATE_ORG_BATCH
} from './routes';
import { Batch } from '../../academics/contracts/batch';
import {  
  FetchBatchListResponse,
} from '../contracts/academic';


export const createOrgBatch = async (batch: Batch) => {
  const response = await axios.post(CREATE_ORG_BATCH, batch);
  return response.data;
};

export const deleteOrgBatch = (batch: Batch) => {
  return axios.delete(DELETE_ORG_BATCH, {
    data: batch,
  });
};

export const fetchOrgBatchesList = async () => {
  const response = await axios.get<FetchBatchListResponse>(GET_ORG_BATCHES);
  return response.data.batchList;
};

export const updateOrgBatch = (batch: Batch) => {
  return axios.put(UPDATE_ORG_BATCH, batch)
};
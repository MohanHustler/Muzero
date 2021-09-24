import axios from 'axios';
import {
  GET_ADMIN,
  UPDATE_ADMIN
} from './routes';

import { Admin } from '../../common/contracts/user';

export const getAdmin = async () => {
  const response = await axios.get(GET_ADMIN);
  return response.data.admin;
};

export const updateAdmin = async (admin: Admin) => {
  return axios.put(UPDATE_ADMIN, admin);
};
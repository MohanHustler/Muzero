import axios from 'axios';
import {
  GENERATE_OTP,
  CHECK_ORG_CODE,
  LOGIN,
  REGISTER,
  VALIDATE_OTP,
  SET_PASSWORD,
  VERIFY_CAPTCHA,
} from './routes';
import { Role } from '../enums/role';
import { getRfuData } from '../helpers';

export const checkOrgCode = async (orgCode: string) => {
  return axios.post(CHECK_ORG_CODE, {
    orgCode,
  });
};

export const generateOTP = async (countryCode: string, phone: string) => {
  return axios.post(GENERATE_OTP, {
    countryCode,
    mobileNo: phone,
    rfuData: await getRfuData(),
  });
};

export const verifyOTP = async (
  ownerId: string,
  phone: string,
  otp: string,
  userType: string,
) => {
  return axios.post(VALIDATE_OTP, {
    ownerId,
    mobileNo: phone,
    otp,
    userType,
    rfuData: await getRfuData(),
  });
};

export const loginUser = (userName: string, password: string) => {
  return axios.post(LOGIN, { userName, password });
};

export const verifyCaptcha = (captchaValue: string) => {
  return axios.post(VERIFY_CAPTCHA, { captchaValue });
};

export const registerUser = (
  orgCode: string,
  phone: string,
  otp: string,
  password: string,
  userType: Role
) => {
  return axios.put(REGISTER, {
    orgCode,
    mobileNo: phone,
    otp,
    password,
    userType,
  });
};

export const setPassword = (orgCode: string, phone: string, otp: string, password: string) => {
  return axios.post(SET_PASSWORD, {
    orgCode,
    mobileNo: phone,
    otp,
    password,
  });
};

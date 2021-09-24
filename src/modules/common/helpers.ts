import 'clientjs';
import moment from 'moment';
import ReactGA from 'react-ga';
import { AppointmentSchedule, Schedule } from '../academics/contracts/schedule';
import { fetchClientIpAddress } from './api/client';
import { ClientData } from './contracts/client';
import {
  Student,
  Tutor,
  User,
  Parent,
  Organization,
  Admin
} from './contracts/user';
import { Role } from './enums/role';

export const generateEmbedLink = (url: string) =>
  'https://www.youtube.com/embed' + new URL(url).pathname;

export const getIpAddress = (() => memoize(fetchClientIpAddress))();

export const getClientData = async (): Promise<ClientData> => {
  // @ts-ignore
  const client = new ClientJS();

  return {
    fingerprint: client.getFingerprint(),
    user_agent: client.getUserAgent(),
    browser: client.getBrowser(),
    browser_version: client.getBrowserVersion(),
    engine: client.getEngine(),
    engine_version: client.getEngineVersion(),
    os: client.getOS(),
    os_version: client.getOSVersion(),
    device: client.getDevice(),
    device_type: client.getDeviceType(),
    device_vendor: client.getDeviceVendor(),
    cpu: client.getCPU(),
    color_depth: client.getColorDepth(),
    current_resolution: client.getCurrentResolution(),
    available_resolution: client.getAvailableResolution(),
    device_xdpi: client.getDeviceXDPI(),
    device_ydpi: client.getDeviceYDPI(),
    timezone: client.getTimeZone(),
    language: client.getLanguage(),
    system_language: client.getSystemLanguage()
  };
};

export const getRfuData = async () => {
  const clientData = await getClientData();

  const clientRfuData = Object.keys(clientData)
    .filter((key) => clientData[key]) // Filter out the keys that have undefined data.
    .map((key) => ({ [key]: clientData[key] }));

  return [
    {
      ip: await getIpAddress()
    },
    ...clientRfuData
  ];
};

export const generateSchedulerSchema = (schedules: Schedule[]) => {
  const weekStart = moment().startOf('week');
  const weekEnd = moment().endOf('week');

  let schedulerData: AppointmentSchedule[] = [];

  for (
    const m = moment(weekStart);
    m.diff(weekEnd, 'days') <= 0;
    m.add(1, 'days')
  ) {
    const day = moment(m, 'YYYY-MM-DD HH:mm:ss').format('dddd');

    const daySchedules: Schedule[] = schedules.filter(
      (schedule) => schedule.dayname.toLowerCase() === day.toLowerCase()
    );

    const structuredSchedules = daySchedules.map((schedule) => ({
      startDate: moment(
        m.format('YYYY-MM-DD') + ' ' + schedule.fromhour
      ).toISOString(),
      endDate: moment(
        m.format('YYYY-MM-DD') + ' ' + schedule.tohour
      ).toISOString(),
      title: schedule.batch
        ? `${schedule.batch.classname} - ${schedule.batch.subjectname}`
        : '',
      class: schedule.batch ? schedule.batch.classname : '',
      subject: schedule.batch ? schedule.batch.subjectname : '',
      schedule
    }));

    schedulerData = [...schedulerData, ...structuredSchedules];
  }

  return schedulerData;
};

export function memoize<T>(resolver: (key?: string | number) => T) {
  const memo: { [key in string | number]: any } = {};

  function resolve(key?: string): T {
    const memoKey = key ? key : 0;

    if (!memo[memoKey]) memo[memoKey] = resolver(memoKey);

    return memo[memoKey];
  }

  return resolve;
}

export const isStudent = (user: User): user is Student =>
  localStorage.getItem('authUserRole') === Role.STUDENT;

export const isOrgTutor = (user: User): user is Tutor =>
  localStorage.getItem('authUserRole') === Role.ORG_TUTOR;

export const isTutor = (user: User): user is Tutor =>
  localStorage.getItem('authUserRole') === Role.TUTOR ||
  localStorage.getItem('authUserRole') === Role.ORG_TUTOR;

export const isAdminTutor = (user: User): user is Tutor =>
  localStorage.getItem('authUserRole') === Role.TUTOR;

export const isOrganization = (user: User): user is Organization =>
  localStorage.getItem('authUserRole') === Role.ORGANIZATION;

export const isParent = (user: User): user is Parent =>
  localStorage.getItem('authUserRole') === Role.PARENT;

export const isAdmin = (user: User): user is Admin =>
  localStorage.getItem('authUserRole') === Role.ADMIN;

export const isGstValid = (gstin: string) => {
  //https://medium.com/@dhananjaygokhale/decoding-gst-number-checksum-digit-1ef2c8c53ad6

  //https://gist.github.com/karthikeyan5/f7b28e66ac9617603622491950bda77a

  const gstArr = gstin.split('');
  //input for check sum is gstin without last character
  const input = gstArr.filter((e, i) => i !== gstArr.length - 1);
  //our checksum in the end should be equal to last char
  const lastChar = gstArr[gstArr.length - 1];

  const code_point_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let factor = 1,
    total = 0,
    checksum = '';
  const mod = code_point_chars.length;

  input.forEach((curr) => {
    let product = factor * code_point_chars.indexOf(curr);
    //hash is quotient + remainder
    let hash = Math.floor(product / mod) + (product % mod);
    total += hash;
    //multiplying factor is 1 and 2 alternatively for each character
    factor === 1 ? (factor = 2) : (factor = 1);
    checksum = code_point_chars.charAt((mod - (total % mod)) % mod);
  });
  return lastChar === checksum;
};

export const eventTracker = (
  category = 'Event Category',
  action = 'action',
  label = 'label'
) => {
  ReactGA.event({ category, action, label });
};

export const exceptionTracker = (description = 'exception description') => {
  ReactGA.exception({ description });
};

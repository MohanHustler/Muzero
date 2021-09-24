import { Batch } from './batch';
import { Tutor } from '../../common/contracts/user';

export interface AppointmentSchedule {
  startDate: string;
  endDate: string;
  title: string;
  class: string;
  subject: string;
  schedule: Schedule;
}

export interface Schedule {
  _id?: string;
  ownerId?: string;
  tutorId?: Tutor;
  tutor?: string;
  mobileNo?: string;
  dayname: string;
  fromhour: string;
  tohour: string;
  batch?: Batch;
}

import { Schedule } from './schedule';
import { Tutor } from '../../common/contracts/user';

export interface Batch {
  _id?: string;
  schedules?: Schedule[];
  content?: string[];
  students: string[];
  boardname: string;
  classname: string;
  subjectname: string;
  batchfriendlyname: string;
  batchenddate: string;
  batchstartdate: string;
  batchicon: string;
  tutor: string;
  tutorId?: Tutor;
}

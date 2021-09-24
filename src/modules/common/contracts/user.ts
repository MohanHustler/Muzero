import { RFU } from './rfu';
import { TutorQualification } from '../../academics/contracts/tutor_qualification';
import { Course } from '../../academics/contracts/course';
import { KycDocument } from './kyc_document';
import { Package } from './package';

export interface RawRule {
    action: string | string[]
    subject: string | string[]
    /** an array of fields to which user has (or not) access */
    fields?: string[]
    /** an object of conditions which restricts the rule scope */
    conditions?: any
    /** indicates whether rule allows or forbids something */
    inverted?: boolean
    /** message which explains why rule is forbidden */
    reason?: string
  }


export interface permissions {
  controlpermissions: {
    pageId: string,
    userId : string,
    consumerId : string[],
    abilityJSON : RawRule[]
  }[],
  accesspermissions: {
    pageId: string ,
    userId : string,
    consumerId : string[],
    abilityJSON : RawRule[]
  }[]
}
export interface Tutor {
  mobileNo: string;
  tutorName: string;
  enrollmentId?: string | number;
  emailId: string;
  schoolName: string;
  qualifications: TutorQualification[];
  pinCode: string;
  stateName: string;
  cityName: string;
  courseDetails: Course[];
  dob?: string;
  kycDetails?: KycDocument[];
  countryCode?: string;
  rfuData?: RFU[];
  ownerId?: string | number;
  package?: Package;
  image?: string;
  aadhaar?: string;
  pan?: string;
  bankIfsc?: string;
  bankAccount?: string;
  aadhaarKycZip?: string;
  aadhaarKycShareCode?: string;
  aadhaarKycStatus?: string;
  _id?: string;
}

export interface TutorResponse {
  tutor: Tutor;
}

export interface Organization {
  mobileNo: string;
  organizationName: string;
  emailId: string;
  businessType: string;
  dob?: string;
  businessPAN: string;
  businessName: string;
  ownerPAN: string;
  ownerName: string;
  address: string;
  city: string;
  pinCode: string;
  stateName: string;
  courseDetails: Course[];
  kycDetails: KycDocument[];
  ownerId: string;
  package: Package;
  image?: string;
  aadhaar?: string;
  bankIfsc?: string;
  bankAccount?: string;
  gstin: string;
  aadhaarKycZip?: string;
  aadhaarKycShareCode?: string;
  aadhaarKycStatus?: string;
}

export interface Student {
  studentName: string;
  enrollmentId?: string;
  mobileNo: string;
  parentMobileNo: string;
  emailId: string;
  boardName: string;
  className: string;
  pinCode: string;
  stateName: string;
  cityName: string;
  schoolName: string;
  ownerId?: string;
  image?: string;
  _id?: string;
}

export interface Parent {
  parentName: string;
  mobileNo: string;
  emailId?: string;
  ownerId: string;
  image?: string;
}

export interface Admin {
  adminName: string;
  mobileNo: string;
  emailId?: string;
  image?: string;
}

export interface StudentResponse {
  student: Student;
}

export interface StudentsResponse {
  studentList: Student[];
}

export interface TutorsResponse {
  tutorList: Tutor[];
}

export type User = Student | Tutor | Parent | Organization | Admin;

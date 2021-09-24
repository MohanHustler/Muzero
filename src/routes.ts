import { ReactType } from 'react';
import {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  SetPassword,
  PrivacyPolicy,
  TermsConditions,
  UserGuide,
  LegalNotice
} from './modules/auth/containers';
import { Home } from './modules/home/containers';
import {
  Students,
  StudentUpdate,
  Tutors,
  StudentsEnrollment,
  TutorsEnrollment,
  TutorUpdate
} from './modules/enrollment/containers';
import {
  ProfileDashboard,
  ProfileNotes,
  ProfileAssessments,
  ProfileOtherInformation,
  ProfilePersonalInformation,
  ProfileProcess,
  ProfileProcessOrganization,
  ProfileSubjectInformation,
  ProfileSecurity,
  ProfileChangePassword,
  ProfileKyc
} from './modules/dashboard/containers';
import {
  CreateBatchTutor,
  CreateBatchOrg,
  Courses,
  CreateScheduleTutor,
  CreateScheduleOrg,
  Schedules
} from './modules/academics/containers';
import { CourseQuiz } from './modules/quiz/containers';
import {
  AssessmentCreate,
  AssessmentQuestions,
  AssessmentSelect,
  ConfirmAsessment,
  AssignAssessment
} from "./modules/assessment/containers";
import { StudentTest } from "./modules/student_assessment/containers";
import ProfileImage from './modules/dashboard/containers/profile_image';
import {Upload} from "./modules/upload/containers"
import {LandingPage} from "./modules/permissionstest/containers"
import { Role } from "./modules/common/enums/role"
import { MeetingDashboard, MeetingFeedBack, MeetingWaiting } from './modules/bbbconference/containers';
interface RouteDesc {
  path: string;
  component: ReactType;
  exact?: boolean;
  roles? : string[] 
}

export const routes: RouteDesc[] = [
  {
    path: '/quizes',
    component: CourseQuiz,
  },
  {
    path: '/profile/students/create',
    component: StudentsEnrollment
  },
  {
    path: '/profile/students/:mode',
    component: StudentUpdate
  },
  {
    path: '/profile/students',
    component: Students
  },
  {
    path: '/profile/tutors/create',
    component: TutorsEnrollment
  },
  {
    path: '/profile/tutors/:mode',
    component: TutorUpdate
  },
  {
    path: '/profile/tutors',
    component: Tutors
  },
  {
    path: '/profile/tutor/batches/create',
    component: CreateBatchTutor
  },
  {
    path: '/profile/org/batches/create',
    component: CreateBatchOrg
  },
  {
    path: '/profile/tutor/schedules/create',
    component: CreateScheduleTutor
  },
  {
    path: '/profile/org/schedules/create',
    component: CreateScheduleOrg
  },
  {
    path: '/profile/schedules',
    component: Schedules
  },
  {
    path: '/profile/process/:step',
    component: ProfileProcess
  },
  {
    path: '/profile/org/process/:step',
    component: ProfileProcessOrganization
  },
  {
    path: '/forgot-password/reset',
    component: ResetPassword
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register/security',
    component: SetPassword
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy
  },
  {
    path: '/terms-conditions',
    component: TermsConditions
  },
  {
    path: '/user-guide',
    component: UserGuide
  },
  {
    path: '/legal-notice',
    component: LegalNotice
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/profile/assessments',
    component: ProfileAssessments
  },
  {
    path: '/profile/dashboard',
    component: ProfileDashboard
  },
  {
    path: '/profile/notes',
    component: ProfileNotes
  },
  {
    path: '/profile/others',
    component: ProfileOtherInformation
  },
  {
    path: '/profile/personal-information',
    component: ProfilePersonalInformation
  },
  {
    path: '/profile/profile-image',
    component: ProfileImage
  },
  {
    path: '/profile/security/change-password',
    component: ProfileChangePassword
  },
  {
    path: '/profile/security',
    component: ProfileSecurity,
    exact: true
  },
  {
    path: '/profile/subjects',
    component: ProfileSubjectInformation
  },
  {
    path: '/profile/courses',
    component: Courses
  },
  {
    path: '/profile/confirm_assessment',
    component: ConfirmAsessment
  },
  {
    path: '/profile/assessment/:mode',
    component: AssessmentCreate
  },
  {
    path: '/profile/assessment_questions',
    component: AssessmentQuestions
  },
  { path: '/profile/assessment_assign', component: AssignAssessment },
  {
    path: '/profile/assessment',
    component: AssessmentSelect
  },
  {
    path: '/profile/kyc',
    component: ProfileKyc
  },
  {
    path: '/students/:id/student_assessement_test',
    component: StudentTest
  },
  {
    path: '/uploadData',
    component: Upload
  },
  {
    path: '/landingpage',
    component:LandingPage
  },
  {
    path: '/meetings/dashboard',
    component: MeetingDashboard,
  },
  {
    path: '/meetings/:meetingID/:uuid/:uName/:meetingName',
    component: MeetingWaiting,
  },
  {
    path: '/feedback/:meetingID/:scheduleID/:meetingName',
    component: MeetingFeedBack
  },
  {
    path: '/',
    component: Home,
    exact: true
  }
];

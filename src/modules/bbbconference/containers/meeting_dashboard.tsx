import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import {
  User,
  Tutor,
  Student,
  Parent,
  Organization,
  Admin
} from '../../common/contracts/user';
import {
  isAdminTutor,
  isOrgTutor,
  isStudent,
  isParent,
  isAdmin
} from '../../common/helpers';
import StudentMeetingDashboard from '../components/layouts/studentMeeting_dashboard';
import TutorMeetingDashboard from '../components/layouts/tutorMeeting_dashboard';
import OrgMeetingDashboard from '../components/layouts/orgMeeting_dashboard';
import OrgTutorMeetingDashboard from '../components/layouts/orgTutorMeeting_dashboard';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const MeetingDashboard: FunctionComponent<Props> = ({ authUser, match }) => {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo('/login');
    }
  }, [authUser.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }
  
  if (isAdminTutor(authUser)) {
    return <TutorMeetingDashboard profile={authUser as Tutor} />;
  }
  if (isOrgTutor(authUser)) {
    return <OrgTutorMeetingDashboard profile={authUser as Tutor} />;
  }
  if (isStudent(authUser)) {
    return <StudentMeetingDashboard profile={authUser as Student} />;
  }
  // if(isParent(authUser)){
  //   return <ParentMeetingDashboard profile={authUser as Parent} />;
  // }
  // if(isAdmin(authUser)){
  //   return <AdminMeetingDashboard profile={authUser as Admin} />;
  // }
  return <OrgMeetingDashboard profile={authUser as Organization} />;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User,
});

export default connect(mapStateToProps)(withRouter(MeetingDashboard));

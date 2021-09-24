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
import TutorDashboard from '../components/layouts/tutor_dashboard';
import StudentDashboard from '../components/layouts/student_dashboard';
import ParentDashboard from '../components/layouts/parent_dashboard';
import OrganizationDashboard from '../components/layouts/organization_dashboard';
import OrgTutorDashboard from '../components/layouts/org_tutor_dashboard';
import AdminDashboard from '../components/layouts/admin_dashboard';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfileDashboard: FunctionComponent<Props> = ({ authUser }) => {
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
    return <TutorDashboard profile={authUser as Tutor} />;
  }
  if (isOrgTutor(authUser)) {
    return <OrgTutorDashboard profile={authUser as Tutor} />;
  }
  if (isStudent(authUser)) {
    return <StudentDashboard profile={authUser as Student} />;
  }
  if (isParent(authUser)) {
    return <ParentDashboard profile={authUser as Parent} />;
  }
  if (isAdmin(authUser)) {
    return <AdminDashboard profile={authUser as Admin} />;
  }
  return <OrganizationDashboard profile={authUser as Organization} />;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileDashboard));

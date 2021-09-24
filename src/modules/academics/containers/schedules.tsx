import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import {
  Tutor,
  User,
  Student,
  Organization
} from '../../common/contracts/user';
import { isAdminTutor, isOrganization, isOrgTutor } from '../../common/helpers';
import TutorSchedules from '../components/layouts/tutor_schedules';
import StudentSchedules from '../components/layouts/student_schedules';
import OrgSchedules from '../components/layouts/org_schedules';
import OrgTutorSchedules from '../components/layouts/org_tutor_schedules';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const Schedules: FunctionComponent<Props> = ({ authUser }) => {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo(`/profile/personal-information`);
    }
  }, [authUser]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }
  if (isAdminTutor(authUser)) {
    return <TutorSchedules profile={authUser as Tutor} />;
  }
  if (isOrganization(authUser)) {
    return <OrgSchedules profile={authUser as Organization} />;
  }
  if (isOrgTutor(authUser)) {
    return <OrgTutorSchedules profile={authUser as Tutor} />;
  }
  return <StudentSchedules profile={authUser as Student} />;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(Schedules));

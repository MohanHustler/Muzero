import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { Tutor, User, Organization } from '../../common/contracts/user';
import { isTutor } from '../../common/helpers';
import TutorCourses from '../components/layouts/tutor_courses';
import OrgCourses from '../components/layouts/org_courses';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const Courses: FunctionComponent<Props> = ({ authUser }) => {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo(`/profile/personal-information`);
    }
  }, [authUser.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  if (isTutor(authUser)) {
    return <TutorCourses profile={authUser as Tutor} />;
  }
  return <OrgCourses profile={authUser as Organization} />;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(Courses));

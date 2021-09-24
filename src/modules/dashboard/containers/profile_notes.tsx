import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { User, Tutor, Student } from '../../common/contracts/user';
import { isTutor } from '../../common/helpers';
import TutorDashboard from '../components/layouts/tutor_dashboard';
import StudentNotes from '../components/layouts/student_notes';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfileNotes: FunctionComponent<Props> = ({ authUser }) => {
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
  if (isTutor(authUser)) {
    return <TutorDashboard profile={authUser as Tutor} />;
  }

  return <StudentNotes profile={authUser as Student} />;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileNotes));

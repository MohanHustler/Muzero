import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { Tutor, Student, User } from '../../common/contracts/user';
import { isTutor, isStudent } from '../../common/helpers';
import TutorQuiz from '../components/layouts/tutor_quiz';
import StudentQuiz from '../components/layouts/student_quiz';

interface Props extends RouteComponentProps {
  authUser: User;
}

const CourseQuiz: FunctionComponent<Props> = ({ authUser, location }) => {
  const [redirectTo, setRedirectTo] = useState('');

  const params = new URLSearchParams(location.search);

  const batchfriendlyname = params.get('batchname');
  const tutorId = params.get('tutorId');
  const fromhour = params.get('fromhour');
  const weekday = params.get('weekday');

  useEffect(() => {
    if (
      batchfriendlyname == null ||
      fromhour === null ||
      weekday === null ||
      (isStudent(authUser) && tutorId == null)
    ) {
      setRedirectTo(`/profile/dashboard`);
    }
  }, [authUser, batchfriendlyname, tutorId, fromhour, weekday]);

  if (redirectTo && redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  if (isTutor(authUser)) {
    return (
      <TutorQuiz
        profile={authUser as Tutor}
        batchfriendlyname={batchfriendlyname as string}
        fromhour={fromhour as string}
        weekday={weekday as string}
      />
    );
  }

  return (
    <StudentQuiz
      profile={authUser as Student}
      batchfriendlyname={batchfriendlyname as string}
      tutorId={tutorId as string}
      fromhour={fromhour as string}
      weekday={weekday as string}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(CourseQuiz));

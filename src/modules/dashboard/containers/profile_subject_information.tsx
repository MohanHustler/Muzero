import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { setAuthUser } from '../../auth/store/actions';
import { User, Tutor, Organization } from '../../common/contracts/user';
import { isTutor } from '../../common/helpers';
import TutorSubjectInformation from '../components/layouts/tutor_subject_information';
import OrganizationCourseInformation from '../components/layouts/organization_course_information';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfileSubjectInformation: FunctionComponent<Props> = ({ authUser }) => {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo('/login');
    }
  }, [authUser.mobileNo]);

  const dispatch = useDispatch();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  if (isTutor(authUser)) {
    return (
      <TutorSubjectInformation
        profile={authUser as Tutor}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  return (
    <OrganizationCourseInformation
      profile={authUser as Organization}
      profileUpdated={(profile) => dispatch(setAuthUser(profile))}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileSubjectInformation));

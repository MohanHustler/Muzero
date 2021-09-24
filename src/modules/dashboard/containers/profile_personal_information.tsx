import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { setAuthUser } from '../../auth/store/actions';
import { User } from '../../common/contracts/user';
import { isTutor, isStudent, isParent, isAdmin } from '../../common/helpers';
import StudentPersonalInformation from '../components/layouts/student_personal_information';
import TutorPersonalInformation from '../components/layouts/tutor_personal_information';
import ParentPersonalInformation from '../components/layouts/parent_personal_information';
import OrganizationPersonalInformation from '../components/layouts/organization_personal_information';
import AdminPersonalInformation from '../components/layouts/admin_personal_information';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfilePersonalInformation: FunctionComponent<Props> = ({ authUser }) => {
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
      <TutorPersonalInformation
        profile={authUser}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  if (isStudent(authUser)) {
    return (
      <StudentPersonalInformation
        profile={authUser}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  if (isParent(authUser)) {
    return (
      <ParentPersonalInformation
        profile={authUser}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  if (isAdmin(authUser)) {
    return (
      <AdminPersonalInformation
        profile={authUser}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  return (
    <OrganizationPersonalInformation
      profile={authUser}
      profileUpdated={(profile) => dispatch(setAuthUser(profile))}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfilePersonalInformation));

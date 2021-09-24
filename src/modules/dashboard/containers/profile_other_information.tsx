import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { isTutor, isOrganization } from '../../common/helpers';
import { RootState } from '../../../store';
import { setAuthUser } from '../../auth/store/actions';
import { User, Tutor, Organization } from '../../common/contracts/user';
import TutorOtherInformation from '../components/layouts/tutor_other_information';
import OrganizationBusinessInformation from '../components/layouts/organization_business_information';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfileOtherInformation: FunctionComponent<Props> = ({ authUser }) => {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo('/login');
    }

    if (!isTutor(authUser) && !isOrganization(authUser)) {
      setRedirectTo('/login');
    }
  }, [authUser.mobileNo, authUser]);

  const dispatch = useDispatch();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  if (isTutor(authUser)) {
    return (
      <TutorOtherInformation
        profile={authUser as Tutor}
        profileUpdated={(profile) => dispatch(setAuthUser(profile))}
      />
    );
  }

  return (
    <OrganizationBusinessInformation
      profile={authUser as Organization}
      profileUpdated={(profile) => dispatch(setAuthUser(profile))}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileOtherInformation));

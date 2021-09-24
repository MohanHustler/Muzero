import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Box, Container, Grid } from '@material-ui/core';
import {
  createStyles,
  fade,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import {
  AccountBalanceOutlined as AccountBalanceIcon,
  InfoOutlined as InfoIcon,
  SettingsOutlined as SettingsIcon
} from '@material-ui/icons';
import { RootState } from '../../../store';
import { setAuthUser } from '../../auth/store/actions';
import { Organization, User } from '../../common/contracts/user';
import { updateOrganization } from '../../common/api/organization';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import OrganizationOtherInformation from '../components/process_forms/organization_business_information';
import OrganizationPersonalInformation from '../components/process_forms/organization_personal_information';
import OrganizationBusinessInformation from '../components/process_forms/organization_course_information';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formHeader: {
      backgroundColor: theme.palette.primary.main,
      minHeight: '150px',
      padding: '20px',
      width: '100%'
    },

    headerIcon: {
      alignItems: 'center',
      border: '1px solid #fff',
      borderRadius: '1000px',
      display: 'flex',
      height: '48px',
      justifyContent: 'center',
      margin: '0 auto 10px',
      padding: '10px',
      width: '48px',

      '& svg': {
        fill: '#fff'
      }
    },

    headerIconActive: {
      backgroundColor: '#fff',
      '& svg': {
        fill: theme.palette.primary.main
      }
    },

    headerIconTitle: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      },
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '18px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: '#FFFFFF'
    },

    progressLine: {
      backgroundColor: '#fff',
      display: 'block',
      height: '2px',
      left: '75%',
      position: 'absolute',
      top: '50%',
      width: '50%',

      [theme.breakpoints.up('sm')]: {
        left: '65%',
        top: 'calc(50% - 15px)',
        width: '70%'
      }
    }
  })
);

interface Props
  extends RouteComponentProps<{ username: string; step: string }> {
  authUser: User;
}

const MAX_STEPS = 3;

const ProfileProcessOrganization: FunctionComponent<Props> = ({
  match,
  history,
  authUser
}) => {
  const [profile, setProfile] = useState(authUser);
  const [redirectTo, setRedirectTo] = useState('');

  const classes = useStyles();
  const step = parseInt(match.params.step);

  const dispatch = useDispatch();

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

  const saveUser = async (data: Organization) => {
    setProfile(data);

    if (step < MAX_STEPS) {
      history.push(`/profile/org/process/${step + 1}`);
      return;
    }

    try {
      dispatch(setAuthUser(data));
      await updateOrganization(data);
      history.push(`/profile/personal-information`);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const OrganizationEnrollmentForm = () => (
    <Switch>
      <Route
        path="/profile/org/process/1"
        render={() => (
          <OrganizationPersonalInformation
            user={profile as Organization}
            saveUser={saveUser}
            submitButtonText="Next Step"
          />
        )}
      />
      <Route
        path="/profile/org/process/2"
        render={() => (
          <OrganizationBusinessInformation
            user={profile as Organization}
            saveUser={saveUser}
            submitButtonText="Next Step"
          />
        )}
      />
      <Route
        path="/profile/org/process/3"
        render={() => (
          <OrganizationOtherInformation
            user={profile as Organization}
            saveUser={saveUser}
            submitButtonText="Finish"
          />
        )}
      />
    </Switch>
  );

  return (
    <div>
      <Navbar />

      <Container maxWidth="md">
        <Box marginY="30px" bgcolor="white">
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.formHeader}
          >
            <Grid item xs={4}>
              <Box textAlign="center" fontWeight="bold" position="relative">
                <span
                  className={`${classes.headerIcon} ${
                    step === 1 ? classes.headerIconActive : ''
                  }`}
                >
                  <InfoIcon />
                </span>

                <span className={classes.headerIconTitle}>CONTACT DETAILS</span>
                <span className={classes.progressLine} />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box textAlign="center" fontWeight="bold" position="relative">
                <span
                  className={`${classes.headerIcon} ${
                    step === 2 ? classes.headerIconActive : ''
                  }`}
                >
                  <AccountBalanceIcon />
                </span>

                <span className={classes.headerIconTitle}>COURSE DETAILS</span>
                <span className={classes.progressLine} />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box textAlign="center" fontWeight="bold">
                <span
                  className={`${classes.headerIcon} ${
                    step === 3 ? classes.headerIconActive : ''
                  }`}
                >
                  <SettingsIcon />
                </span>

                <span className={classes.headerIconTitle}>
                  BUSINESS DETAILS
                </span>
              </Box>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" padding="20px">
            <Box maxWidth="600px" width="100%">
              <OrganizationEnrollmentForm />
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileProcessOrganization));

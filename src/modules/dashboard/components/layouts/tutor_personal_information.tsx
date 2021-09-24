import React, { FunctionComponent, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Create as CreateIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Subject as SubjectIcon,
  Subscriptions as SubscriptionIcon,
  LocationCity as LocationIcon,
  Smartphone as SmartPhoneIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../../modules/auth/store/actions';
import { Tutor } from '../../../common/contracts/user';
import { updateTutor } from '../../../common/api/profile';
import ProfileEditIcon from '../../../../assets/svgs/profile-edit.svg';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { profilePageStyles } from '../../../common/styles';
import Layout from '../tutor_layout';
import ProfileImage from '../../../dashboard/containers/profile_image';
import TutorPersonalInformationModal from '../modals/tutor_personal_information_modal';
import { Redirect } from 'react-router-dom';

interface Props extends WithStyles<typeof profilePageStyles> {
  profile: Tutor;
  profileUpdated: (user: Tutor) => any;
}

const TutorPersonalInformation: FunctionComponent<Props> = ({
  classes,
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  const dispatch = useDispatch();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const savePersonalInformation = async (data: Tutor) => {
    const user = Object.assign({}, profile, data);

    try {
      profileUpdated(user);
      await updateTutor(user);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        profileUpdated(profile);
      }
    }
  };

  return (
    <Layout profile={profile}>
      <TutorPersonalInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={savePersonalInformation}
        user={profile}
      />

      <Box className={classes.profileContainer}>
        <Box className={classes.profileSection}>
          <Box>
            <ProfileImage
              profileUpdated={(profile) => dispatch(setAuthUser(profile))}
              profile={profile}
              name={profile.tutorName}
            />
          </Box>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center" marginBottom="20px">
                <img src={ProfileEditIcon} alt="Personal Info" />

                <Box marginLeft="15px">
                  <Box component="h2" className={classes.profileheading}>
                    Personal Information
                  </Box>

                  <Typography className={classes.helperText}>
                    View &amp; Edit Your Personal &amp; Contact Details
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box className={classes.yellowBtn}>
                <Button variant="outlined" onClick={() => setOpenModal(true)}>
                  <Box display="flex" alignItems="center">
                    <Box component="span" display="flex" marginRight="10px">
                      <CreateIcon fontSize="small" />
                    </Box>
                    Edit
                  </Box>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <AccountCircleIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Your Name</Box>
                  <Box className={classes.inputValue}>{profile.tutorName}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <AccountCircleIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Enrollment Id</Box>
                  <Box className={classes.inputValue}>
                    {profile.enrollmentId ? profile.enrollmentId : '-'}
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <EmailIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Email Address</Box>
                  <Box className={classes.inputValue}>{profile.emailId}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <SmartPhoneIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Phone Number</Box>
                  <Box className={classes.inputValue}>{profile.mobileNo}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <CalendarTodayIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Date of Birth</Box>
                  <Box className={classes.inputValue}>
                    {profile.dob && profile.dob.length > 0
                      ? new Date(profile.dob).toDateString()
                      : '-'}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <SubjectIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Qualifications</Box>
                  <Box className={classes.inputValue}>
                    {profile.qualifications &&
                      profile.qualifications.join(', ')}
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <SchoolIcon color="primary" />
                <Box>
                  <Box className={classes.label}>School / University</Box>
                  <Box className={classes.inputValue}>{profile.schoolName}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <SubscriptionIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Package</Box>
                  <Box className={classes.inputValue}>
                    {profile.package && profile.package.name}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="primary" />
                <Box>
                  <Box className={classes.label}>City</Box>
                  <Box className={classes.inputValue}>{profile.cityName}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="primary" />
                <Box>
                  <Box className={classes.label}>PIN code</Box>
                  <Box className={classes.inputValue}>{profile.pinCode}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="primary" />
                <Box>
                  <Box className={classes.label}>State</Box>
                  <Box className={classes.inputValue}>{profile.stateName}</Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default withStyles(profilePageStyles)(TutorPersonalInformation);

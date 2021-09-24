import React, { FunctionComponent, useState } from 'react';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Smartphone as SmartPhoneIcon,
  LocationCity as LocationIcon
} from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Student } from '../../../common/contracts/user';
import { updateStudent } from '../../../common/api/profile';
import ProfileEditIcon from '../../../../assets/svgs/profile-edit.svg';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import Layout from '../student_layout';
import StudentPersonalInformationModal from '../modals/student_personal_information_modal';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profileContainer: {
      background: '#fff',
      boxShadow: '0px 10px 20px rgb(31 32 65 / 5%)',
      borderRadius: '4px'
    },
    profileSection: {
      borderBottom: '0.5px solid #E3E3E3',
      padding: '20px 0px 10px 40px'
    },
    profileheading: {
      fontWeight: 500,
      fontSize: '24px',
      lineHeight: '30px',
      letterSpacing: '1px',
      color: '#010101'
    },
    helperText: {
      fontWeight: 300,
      fontSize: '15px',
      lineHeight: '18px',
      color: '#606A7B'
    },
    yellowBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '40px',
      '& button': {
        border: '2px solid #F9BD33',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '1px',
        color: '#F9BD33',
        padding: '7px 15px'
      }
    },
    label: {
      fontWeight: 500,
      color: '#606A7B',
      marginBottom: '12px'
    },
    inputValueContainer: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    inputValue: {
      fontSize: '16px',
      lineHeight: '18px',
      color: '#151522',
      marginLeft: '5px'
    }
  })
);

interface Props {
  profile: Student;
  profileUpdated: (user: Student) => any;
}

const StudentPersonalInformation: FunctionComponent<Props> = ({
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  const classes = useStyles();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const savePersonalInformation = async (data: Student) => {
    const user = Object.assign({}, profile, data);

    try {
      profileUpdated(user);
      await updateStudent(user);
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
      <StudentPersonalInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={savePersonalInformation}
        user={profile}
      />

      <Box className={classes.profileContainer}>
        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center" marginBottom="20px">
                <img src={ProfileEditIcon} alt="Personal Info" />

                <Box marginLeft="15px">
                  <Typography component="span" color="secondary">
                    <Box component="h2" className={classes.profileheading}>
                      Personal Information
                    </Box>
                  </Typography>

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
                    Edit
                    <Box component="span" display="flex" marginLeft="10px">
                      <CreateIcon fontSize="small" />
                    </Box>
                  </Box>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Your Name</Box>
              <Box className={classes.inputValueContainer}>
                <AccountCircleIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.studentName}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Enrollment Id</Box>
              <Box className={classes.inputValueContainer}>
                <AccountCircleIcon color="secondary" />
                <Box className={classes.inputValue}>
                  {profile.enrollmentId ? profile.enrollmentId : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Email Address</Box>
              <Box className={classes.inputValueContainer}>
                <EmailIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.emailId}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Phone Number</Box>
              <Box className={classes.inputValueContainer}>
                <SmartPhoneIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.mobileNo}</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Board</Box>
              <Box className={classes.inputValue}>{profile.boardName}</Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Class</Box>
              <Box className={classes.inputValue}>{profile.className}</Box>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className={classes.label}>School</Box>
              <Box className={classes.inputValueContainer}>
                <SchoolIcon color="primary" />
                <Box className={classes.inputValue}>{profile.schoolName}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>City</Box>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.cityName}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>State</Box>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.stateName}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>PIN code</Box>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="secondary" />
                <Box className={classes.inputValue}>{profile.pinCode}</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default StudentPersonalInformation;

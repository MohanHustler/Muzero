import React, { FunctionComponent, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Email as EmailIcon,
  Subscriptions as SubscriptionIcon,
  LocationCity as LocationIcon,
  Smartphone as SmartPhoneIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../../modules/auth/store/actions';
import { Organization } from '../../../common/contracts/user';
import { updateOrganization } from '../../../common/api/organization';
import ProfileEditIcon from '../../../../assets/svgs/profile-edit.svg';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { profilePageStyles } from '../../../common/styles';
import ProfileImage from '../../../dashboard/containers/profile_image';
import Layout from '../organization_layout';
import OrganizationPersonalInformationModal from '../modals/organization_personal_information_modal';
import { Redirect } from 'react-router-dom';

interface Props extends WithStyles<typeof profilePageStyles> {
  profile: Organization;
  profileUpdated: (user: Organization) => any;
}

const OrganizationPersonalInformation: FunctionComponent<Props> = ({
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

  const savePersonalInformation = async (data: Organization) => {
    const user = Object.assign({}, profile, data);

    try {
      profileUpdated(user);
      await updateOrganization(user);
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
      <OrganizationPersonalInformationModal
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
              name={profile.organizationName}
            />
          </Box>
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
              <Box className={classes.inputValueContainer}>
                <AccountCircleIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Institute Name</Box>
                  <Box className={classes.inputValue}>
                    {profile.organizationName}
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <EmailIcon color="primary" />
                <Box>
                  <Box className={classes.label}>Email Address</Box>
                  {profile.emailId ? profile.emailId : '-'}
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
          </Grid>
        </Box>

        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
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
                  <Box className={classes.label}>Address</Box>
                  <Box className={classes.inputValue}>{profile.address}</Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="primary" />
                <Box>
                  <Box className={classes.label}>City</Box>
                  <Box className={classes.inputValue}>{profile.city}</Box>
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

            <Grid item xs={12} md={6}>
              <Box className={classes.inputValueContainer}>
                <LocationIcon color="primary" />
                <Box>
                  <Box className={classes.label}>PIN code</Box>
                  <Box className={classes.inputValue}>{profile.pinCode}</Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default withStyles(profilePageStyles)(OrganizationPersonalInformation);

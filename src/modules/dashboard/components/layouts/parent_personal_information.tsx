import React, { FunctionComponent, useState } from 'react';
import { Box, Divider, Grid, Typography } from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Smartphone as SmartPhoneIcon
} from '@material-ui/icons';
import { Parent } from '../../../common/contracts/user';
import { updateParent } from '../../../common/api/profile';
import Contact from '../../../../assets/svgs/contact.svg';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import Layout from '../parent_layout';
import ParentPersonalInformationModal from '../modals/parent_personal_information_modal';
import { Redirect } from 'react-router-dom';

interface Props {
  profile: Parent;
  profileUpdated: (user: Parent) => any;
}

const ParentPersonalInformation: FunctionComponent<Props> = ({
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const savePersonalInformation = async (data: Parent) => {
    const user = Object.assign({}, profile, data);

    try {
      profileUpdated(user);
      await updateParent(user);
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
      <ParentPersonalInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={savePersonalInformation}
        user={profile}
      />

      <Box bgcolor="white">
        <Box padding="20px">
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center">
                <img src={Contact} alt="Personal Info" />

                <Box marginLeft="15px">
                  <Typography component="span" color="secondary">
                    <Box component="h2" fontWeight="500" margin="0 0 5px 0">
                      Personal Information
                    </Box>
                  </Typography>

                  <Typography>
                    View &amp; Edit Your Personal &amp; Contact Details
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOpenModal(true)}
                >
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

        <Divider />

        <Box padding="20px">
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box fontWeight="bold" marginBottom="5px">
                Your Name
              </Box>
              <Box display="flex" alignItems="center">
                <AccountCircleIcon color="secondary" />
                <Box marginLeft="5px">{profile.parentName}</Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box fontWeight="bold" marginBottom="5px">
                Email Address
              </Box>
              <Box marginBottom="20px">
                {profile.emailId ? profile.emailId : '-'}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box fontWeight="bold" marginBottom="5px">
                Phone Number
              </Box>
              <Box display="flex" alignItems="center">
                <SmartPhoneIcon color="secondary" />
                <Box marginLeft="5px">{profile.mobileNo}</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider />
      </Box>
    </Layout>
  );
};

export default ParentPersonalInformation;

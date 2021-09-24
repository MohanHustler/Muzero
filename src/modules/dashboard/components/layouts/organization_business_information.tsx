import React, { FunctionComponent, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import { Create as CreateIcon } from '@material-ui/icons';
import { Organization } from '../../../common/contracts/user';
import { updateOrganization } from '../../../common/api/organization';
import IdCard from '../../../../assets/images/id-card-blue.png';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { profilePageStyles } from '../../../common/styles';
import Layout from '../organization_layout';
import OrganizationBusinessInformationModal from '../modals/organization_business_information_modal';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badge: {
      background: theme.palette.primary.main,
      borderRadius: '9999px',
      color: '#FFF',
      marginLeft: '5px',
      padding: '5px 10px'
    },
    label: {
      color: '#606A7B'
    },
    docList: {
      fontWeight: 'normal',
      textTransform: 'uppercase',
      fontSize: '16px',
      lineHeight: '24px',
      color: 'rgba(0, 0, 0, 0.87)',
      padding: '12px 30px',
      borderBottom: '1px solid rgb(239, 239, 239)'
    }
  })
);

interface BusinessInformationProps {
  profile: Organization;
}

const BusinessInformation: FunctionComponent<BusinessInformationProps> = ({
  profile
}) => {
  const classes = useStyles();

  if (profile.kycDetails && profile.kycDetails.length > 0) {
    return (
      <Box>
        <Box padding="20px">
          <Typography variant="subtitle2" className={classes.label}>
            Documents{' '}
            <span className={classes.badge}>{profile.kycDetails.length}</span>
          </Typography>

          <Box
            marginTop="20px"
            border="1px solid #EFEFEF"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
            maxWidth="400px"
          >
            {profile.kycDetails.map((document, index) => (
              <Box key={index} className={classes.docList}>
                {document.kycDocType}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginTop="10px">
      <Typography>No documents added.</Typography>
    </Box>
  );
};

interface Props extends WithStyles<typeof profilePageStyles> {
  profile: Organization;
  profileUpdated: (user: Organization) => any;
}

const OrganizationBusinessInformation: FunctionComponent<Props> = ({
  classes,
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const saveBusinessInformation = async (data: Organization) => {
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
      <OrganizationBusinessInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={saveBusinessInformation}
        user={profile as Organization}
      />

      <Box className={classes.profileContainer}>
        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center" marginBottom="20px">
                <img src={IdCard} alt="Business Information" />

                <Box marginLeft="15px">
                  <Typography component="span" color="primary">
                    <Box component="h2" className={classes.profileheading}>
                      Business Information
                    </Box>
                  </Typography>

                  <Typography className={classes.helperText}>
                    View &amp; Edit Your Business Details
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
            <Grid item xs={12} md={12}>
              <Box className={classes.label}>Business Type</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.businessType ? profile.businessType : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Date of Incorporation</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.dob ? profile.dob : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Business PAN</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.businessPAN ? profile.businessPAN : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Business Name</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.businessName ? profile.businessName : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>GSTIN</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.gstin ? profile.gstin : '-'}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Owner PAN</Box>
              <Box className={classes.inputValue}>
                {profile.ownerPAN ? profile.ownerPAN : '-'}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.label}>Owner Name</Box>
              <Box className={classes.inputValueContainer}>
                <Box className={classes.inputValue}>
                  {profile.ownerName ? profile.ownerName : '-'}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <BusinessInformation profile={profile} />
      </Box>
    </Layout>
  );
};

export default withStyles(profilePageStyles)(OrganizationBusinessInformation);

import React, { FunctionComponent, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import { Create as CreateIcon } from '@material-ui/icons';
import { Tutor } from '../../../common/contracts/user';
import { updateTutor } from '../../../common/api/profile';
import IdCard from '../../../../assets/images/id-card-blue.png';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { profilePageStyles } from '../../../common/styles';
import Layout from '../tutor_layout';
import TutorOtherInformationModal from '../modals/tutor_other_information_modal';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    },
    badge: {
      background: theme.palette.primary.main,
      borderRadius: '9999px',
      color: '#FFF',
      marginLeft: '5px',
      padding: '5px 10px'
    }
  })
);

interface OtherInformationProps {
  profile: Tutor;
}

const OtherInformation: FunctionComponent<OtherInformationProps> = ({
  profile
}) => {
  const classes = useStyles();

  if (
    (profile.dob && profile.dob.length > 0) ||
    (profile.kycDetails && profile.kycDetails.length > 0)
  ) {
    return (
      <Box>
        <Box padding="20px">
          <Typography variant="subtitle2" className={classes.label}>
            Documents{' '}
            <span className={classes.badge}>
              {profile.kycDetails && profile.kycDetails.length}
            </span>
          </Typography>

          <Box
            marginTop="20px"
            border="1px solid #EFEFEF"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
            maxWidth="400px"
          >
            {profile.kycDetails &&
              profile.kycDetails.map((document, index) => (
                <Box className={classes.docList} key={index}>
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
      <Typography>No data available on other details.</Typography>
    </Box>
  );
};

interface Props extends WithStyles<typeof profilePageStyles> {
  profile: Tutor;
  profileUpdated: (user: Tutor) => any;
}

const TutorOtherInformation: FunctionComponent<Props> = ({
  classes,
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const saveOtherInformation = async (data: Tutor) => {
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
      <TutorOtherInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={saveOtherInformation}
        user={profile as Tutor}
      />

      <Box className={classes.profileContainer}>
        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center" marginBottom="20px">
                <img src={IdCard} alt="Other Information" />

                <Box marginLeft="15px">
                  <Box component="h2" className={classes.profileheading}>
                    Other
                  </Box>

                  <Typography className={classes.helperText}>
                    View &amp; edit your Identity Proof details here
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

        <OtherInformation profile={profile} />
      </Box>
    </Layout>
  );
};

export default withStyles(profilePageStyles)(TutorOtherInformation);

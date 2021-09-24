import React, {
  FunctionComponent,
  useState,
  useEffect,
  ChangeEvent
} from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import { isTutor, isStudent, isOrganization } from '../../common/helpers';
import {
  Box,
  Divider,
  Grid,
  Theme,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Contact from '../../../assets/svgs/contact.svg';
import TutorLayout from '../components/tutor_layout';
import StudentLayout from '../components/student_layout';
import OrganizationLayout from '../components/organization_layout';
import ProfileChangePassword from './profile_change_password';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary
    }
  })
);

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const ProfileSecurity: FunctionComponent<Props> = ({ authUser }) => {
  //Accordion
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChangeAccordion = (panel: string) => (
    event: ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  //Redirect wrong users to login page
  const [redirectTo, setRedirectTo] = useState('');
  useEffect(() => {
    if (!authUser.mobileNo) {
      setRedirectTo('/login');
    }
  }, [authUser.mobileNo]);
  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const toRenderSecurity = () => {
    return (
      <Box bgcolor="white">
        <Box padding="20px">
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" alignItems="center">
                <img src={Contact} alt="Security Settings" />

                <Box marginLeft="15px">
                  <Typography component="span" color="secondary">
                    <Box component="h2" fontWeight="500" margin="0 0 5px 0">
                      Security
                    </Box>
                  </Typography>

                  <Typography>
                    Settings to help you keep your account secure
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <div className={classes.root}>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChangeAccordion('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                Password settings
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Change your password here
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ProfileChangePassword />
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    );
  };

  if (isTutor(authUser)) {
    return <TutorLayout profile={authUser}>{toRenderSecurity()}</TutorLayout>;
  }

  if (isStudent(authUser)) {
    return (
      <StudentLayout profile={authUser}>{toRenderSecurity()}</StudentLayout>
    );
  }

  if (isOrganization(authUser)) {
    return (
      <OrganizationLayout profile={authUser}>
        {toRenderSecurity()}
      </OrganizationLayout>
    );
  }

  return <div>Hello</div>;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileSecurity));

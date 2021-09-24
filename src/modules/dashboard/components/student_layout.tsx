import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../auth/store/actions';
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter
} from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Student } from '../../common/contracts/user';
import Navbar from '../../common/components/navbar';
import { profileLayoutStyles } from '../../common/styles';
import ProfileImage from '../containers/profile_image';

interface Props
  extends WithStyles<typeof profileLayoutStyles>,
    RouteComponentProps {
  profile: Student;
}

const StudentLayout: FunctionComponent<Props> = ({
  children,
  classes,
  profile,
  match
}) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box paddingY="20px">
          <Grid item container>
            <Grid item md={3}>
              <Box>
                <ProfileImage
                  profileUpdated={(profile) => dispatch(setAuthUser(profile))}
                  profile={profile}
                  name={profile.studentName}
                />
              </Box>
            </Grid>
            <Grid item md={9}>
              <Box component="h2" className={classes.welcomeHeading}>
                Welcome, {profile.studentName}!
              </Box>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={3}>
              <Box className={classes.navList}>
                <ListItem
                  button
                  component={RouterLink}
                  to={`/profile/personal-information`}
                  className={classes.navItem}
                >
                  <ListItemText>
                    <Typography
                      color={
                        match.path === '/profile/personal-information'
                          ? 'primary'
                          : 'inherit'
                      }
                    >
                      Personal Information
                    </Typography>
                  </ListItemText>
                </ListItem>
                <List dense>
                  <ListItem
                    button
                    component={RouterLink}
                    to={`/profile/security`}
                    className={classes.navItem}
                  >
                    <ListItemText>
                      <Typography
                        color={
                          match.path === '/profile/security'
                            ? 'primary'
                            : 'inherit'
                        }
                      >
                        Security
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Box className={classes.bodyContainer}>{children}</Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default withStyles(profileLayoutStyles)(withRouter(StudentLayout));

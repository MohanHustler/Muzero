import React, { FunctionComponent } from 'react';
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
import { Tutor } from '../../common/contracts/user';
import Navbar from '../../common/components/navbar';
import { profileLayoutStyles } from '../../common/styles';

interface Props
  extends WithStyles<typeof profileLayoutStyles>,
    RouteComponentProps {
  profile: Tutor;
}

const TutorLayout: FunctionComponent<Props> = ({
  children,
  classes,
  match,
  profile
}) => {
  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box padding="50px 0px 20px 0px">
          <Grid container>
            <Grid item xs={12} md={3}>
              <Box className={classes.navList}>
                <List dense>
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

                  <ListItem
                    button
                    component={RouterLink}
                    to={`/profile/subjects`}
                    className={classes.navItem}
                  >
                    <ListItemText>
                      <Typography
                        color={
                          match.path === '/profile/subjects'
                            ? 'primary'
                            : 'inherit'
                        }
                      >
                        Course Details
                      </Typography>
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    button
                    component={RouterLink}
                    to={`/profile/others`}
                    className={classes.navItem}
                  >
                    <ListItemText>
                      <Typography
                        color={
                          match.path === '/profile/others'
                            ? 'primary'
                            : 'inherit'
                        }
                      >
                        Others
                      </Typography>
                    </ListItemText>
                  </ListItem>

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

                  <ListItem
                    button
                    component={RouterLink}
                    to={`/profile/kyc`}
                    className={classes.navItem}
                  >
                    <ListItemText>
                      <Typography
                        color={
                          match.path === '/profile/kyc' ? 'primary' : 'inherit'
                        }
                      >
                        Kyc
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

export default withStyles(profileLayoutStyles)(withRouter(TutorLayout));

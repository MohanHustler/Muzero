import React, { FunctionComponent } from 'react';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Admin } from '../../../common/contracts/user';
import BoyWavingHand from '../../../../assets/svgs/boy-waving-hand.svg';
import Navbar from '../../../common/components/navbar';
//import { Redirect } from 'react-router-dom';

const styles = createStyles({
  boyWavingHard: {
    maxHeight: '145px',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

interface Props extends WithStyles<typeof styles> {
  profile: Admin;
}

const AdminDashboard: FunctionComponent<Props> = ({ classes, profile }) => {
  //const [redirectTo, setRedirectTo] = useState('');

  // if (redirectTo.length > 0) {
  //   return <Redirect to={redirectTo} />;
  // }

  //const subjects = Array.from(
  //  new Set(profile.courseDetails.map((course) => course.subject))
  //);

  return (
    <div>
      <Navbar />

      <Box marginY="50px">
        <Container>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box paddingX="15px">
                <Box
                  bgcolor="white"
                  padding="35px 30px"
                  marginBottom="30px"
                  position="relative"
                >
                  <Box>
                    <Typography variant="h5" color="secondary">
                      Hello {profile.adminName}!
                    </Typography>
                    <Typography>It's good to see you again.</Typography>
                  </Box>

                  <img
                    className={classes.boyWavingHard}
                    src={BoyWavingHand}
                    alt={`Hello ${profile.adminName}!`}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default withStyles(styles)(AdminDashboard);

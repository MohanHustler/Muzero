import React, { useState, useEffect, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import MainLayoutBBB from '../components/bbb_mainLayout'
import {
  createStyles,
  withStyles,
  WithStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import { Box, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import FeedBack_Vector from '../../../assets/images/feedback-vector.png'
import { Rating } from '@material-ui/lab';

// http://localhost:3000/feedback/1001idnewmeeningID/10012002internalMeetingID/Science%20Class%20VI

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  paper_1: {
    background:
      'url(' +
      FeedBack_Vector +
      ')',
    backgroundSize: 'contain',
    // backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    minHeight: '70vH',
    padding: '0 0'
  },
  typography_1:{
    fontWeight:400,
    color: "#708090"
  },
  typography_2: {
    fontWeight:400,
    //color: "#808080"
  },
  typography_3: {
    fontWeight: 900,
    color:"#4285F4"
  },
  width: {
    width: "400px",
    marginBottom:"12px"
  }
});

interface Props extends WithStyles<typeof styles> {}
interface Props
  extends RouteComponentProps<{
    meetingID: string;
    scheduleID: string;
    meetingName: string;
  }> {
  authUser: User;
}

const MeetingFeedBack: FunctionComponent<Props> = ({
  classes,
  authUser,
  match
}) => {
  const meetingID = match.params.meetingID;
  const scheduleID = match.params.scheduleID;
  const meetingName = match.params.meetingName;

  const history = useHistory()

  const [redirectTo, setRedirectTo] = useState('');
  const [value, setValue] = React.useState<number | null>(0);
  const [textValue, setTextValue] = useState<string>('')
  console.log('',value,'\n', textValue)

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo('/login');
    }
  }, [authUser.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const homeRedirect = () => {
    history.push(`/profile/dashboard`)
  }
  const meetingDashRedirect = () => {
    history.push(`/meetings/dashboard`)
  }

  const submit_feedbak = () => {

  }

  return (
    <MainLayoutBBB>
      <Box width="90%" height="86vH" bgcolor="#fff" margin="12px auto" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center"  className={classes.paper_1}>
            <Box width="100%" display="flex" justifyContent="space-evenly">
              <Button onClick={() => homeRedirect()} size="large" variant="outlined" color="secondary">
                Back to Home
              </Button>
              <Button onClick={() => meetingDashRedirect()} size="large" variant="outlined" color="secondary">
                Class History
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box textAlign="center" height="100%" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
              <h1 className={classes.typography_1}>Your last classroom session was<br/><strong>{meetingName}</strong></h1>
              <h2 className={classes.typography_2}>Thank You for using Edumatica platform,<br/> We would love to host you again.</h2>
              <h3 className={classes.typography_2}>We work hard to provide you seamless experience.<br/>Your feedback matters the most.</h3>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <h2 className={classes.typography_3}><strong>Kindly rate us</strong></h2>
                <Box component="fieldset" mb={3} borderRadius="5px">
                  <Rating
                    size="large"
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                  />
                </Box>
              </Box>
              <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <TextField
                  className={classes.width}
                  id="outlined-textarea"
                  label="Your Review"
                  placeholder="Write about your experience"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
                <Button onClick={()=>submit_feedbak()} size="large" variant="contained" color="secondary">
                  Submit
                </Button>
              </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
    </MainLayoutBBB>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

//export default connect(mapStateToProps)(withRouter(MeetingFeedBack));
export default withStyles(styles)(
  connect(mapStateToProps)(withRouter(MeetingFeedBack))
);

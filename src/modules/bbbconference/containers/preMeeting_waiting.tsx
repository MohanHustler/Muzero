import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../../store';
import { Student, User } from '../../common/contracts/user';
import { isStudent } from '../../common/helpers';
import StudentMeetingWaiting from '../components/layouts/studentMeeting_Waiting';

const styles = createStyles({
  root: {
    flexGrow: 1
  },
})

interface Props extends WithStyles<typeof styles> {}
interface Props extends RouteComponentProps<{ username: string, meetingID: string, uName: string, uuid: string, meetingName: string }> {
  authUser: User;
}

const MeetingWaiting: FunctionComponent<Props> = ({
  classes,
  authUser,
  match,
}) => {
  //console.log(match.params)
  const meetingID = match.params.meetingID;
  const uName = match.params.uName;
  const uuid = match.params.uuid;
  const meetingName = match.params.meetingName;
  // const urlDirect = match.params.username;
  const [redirectTo, setRedirectTo] = useState('');

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
  if (isStudent(authUser)) {
    return <StudentMeetingWaiting profile={authUser as Student}
    meetingID={meetingID}
    userName={uName}
    uuid={uuid}
    meetingName={meetingName}
    // urlDirect={urlDirect}
     />;
  }

  return (
    <div>Not Authorized</div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default withStyles(styles)(
  connect(mapStateToProps)(withRouter(MeetingWaiting))
);

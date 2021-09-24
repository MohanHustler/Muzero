import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  createStyles,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles';
import Logo from '../../../../assets/svgs/book.svg';
import { ChevronRight as ChevronRightIcon, Group } from '@material-ui/icons';
import { Student } from '../../../common/contracts/user';
import MainLayoutBBB from '../bbb_mainLayout';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import { getMeetingInfo, joinMeeting } from '../../helper/api';
import { joinMeetingById } from '../../store/actions';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Divider, Grid } from '@material-ui/core';
import axios from 'axios';
import { xml2js } from 'xml-js';

const styles = createStyles({
  typography_1: {
    color: "#4C8BF5",
    fontWeight: 500,
  },
  typography_2: {
    color: "#FFFFFF",
    fontWeight: 400,
  },
  navIcon: {
    height: '25px',
    width: '25px'
  },
  nav: {
    minHeight: '85px',
    display:"flex",
    justifyContent:"flex-start", 
    alignItems:"center", 
    width:"100%", 
    backgroundColor:"#FFFFFF",
    paddingLeft:"24px"
  },
});

interface Props extends WithStyles<typeof styles> {
  profile: Student;
  meetingID: String;
  userName: String;
  uuid: String;
  meetingName: String;
  //urlDirect: String;
}

const StudentMeetingWaiting: FunctionComponent<Props> = ({classes ,profile, meetingID, userName, uuid, meetingName}) => {

  // console.log('',meetingID,'\n',userName,'\n',uuid)
  const dispatch = useDispatch()
  const history = useHistory()
  //const [url, setUrl] = useState("")
  //console.log(event)
  const MEETING_ID = meetingID.toString()
  const USER_NAME = userName.toString()
  const joinTypeValue = 'Attendee';
  const UID = uuid.toString();
  const MEETING_NAME = meetingName.toString();

  var url = `${process.env.REACT_APP_API}/bbbevents/eventlistener`;
  var eventSourceInitDict = {headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
  }};

  useEffect(() => {

    var eventSource = new EventSource(
      url, eventSourceInitDict as EventSourceInit
    )

    eventSource.onmessage = (e) => {
      console.log(JSON.parse(e.data));
      const sse_data = JSON.parse(e.data).meetingID;
      if(sse_data !== ""){
        var flag = 0
        //check if user already in meeting
        getMeetingInfo(MEETING_ID).then(res => {
          axios.get(res.data).then(res => {
            const js_res: any = xml2js(res.data, { compact: true });
            //console.log(js_res)
            
            if(Array.isArray(js_res.response.attendees.attendee) === true){
              const members: any[] = js_res.response.attendees.attendee
              members.map(member => {
                if(member.userID._text === UID) flag = 1
              })
              if(flag === 0) {
                // joining meeting
                joinMeeting(MEETING_ID, USER_NAME, joinTypeValue, UID).then(
                  (res) => {
                    dispatch(joinMeetingById(res.data));
                    eventSource.close()
                  }
                );
              }
            }else{
              joinMeeting(MEETING_ID, USER_NAME, joinTypeValue, UID).then(
                (res) => {
                  dispatch(joinMeetingById(res.data));
                  eventSource.close()
                }
              );
            }
          })
        })
        
        history.push(`/profile/dashboard`)
      } 
    };
  }, []);

  const closeWaitingRoom = () => {
    history.push(`/profile/dashboard`)
  }

  return (
    <>
      <Box className={classes.nav}>
        <img className={classes.navIcon} src={Logo} alt="Logo" />
        <Box
          fontSize="24px"
          fontWeight="bold"
          lineHeight="134.69%"
          color="#4C8BF5"
          marginLeft="9px"
          marginBottom="1px"
        >
          Edumatica
        </Box>
      </Box>
      <Container>
        <Box
          height="88vH"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          margin="auto"
        >
          <Box marginBottom="12px">
            <h2 className={classes.typography_1}>{MEETING_NAME}</h2>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                borderRadius="5px"
                height="520px"
                bgcolor="#212121"
              >
                <Box display="flex">
                  <CircularProgress size="80px" color="secondary" />
                  <h1 style={{color:"#4C8BF5", marginLeft:"12px"}}>WELCOME</h1>
                </Box>
                <h3 className={classes.typography_2}>Class yet to be started by Tutor</h3>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box borderRadius="5px" height="520px" bgcolor="#7C7171">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-evenly"
                >
                  <Group className={classes.typography_2} fontSize="large" />
                  <h2 className={classes.typography_2}>
                    Students in Waiting Room
                  </h2>
                </Box>
                <hr style={{ backgroundColor: '#ffffff' }} />
                {/* <Divider light={true} /> */}
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="center" width="100%" marginTop="24px">
            <Button
              style={{
                textAlign: 'center'
              }}
              onClick={()=>closeWaitingRoom()}
              variant="outlined"
              size="large"
              color="primary"
              disableElevation
            >
              Leave Waiting Room
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

function mapStateToProps(state: RootState) {
  return {
  
  };
}

export default withStyles(styles)(
  connect(mapStateToProps)(StudentMeetingWaiting)
);

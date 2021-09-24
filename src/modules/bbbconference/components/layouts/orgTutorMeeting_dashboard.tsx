import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import {
  createStyles,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles';
import { ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import AccessTimeTwoToneIcon from '@material-ui/icons/AccessTimeTwoTone';
import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import { Tutor } from '../../../common/contracts/user';
import MainLayoutBBB from '../bbb_mainLayout';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import Button from '../../../common/components/form_elements/button';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  fetchBatchesList,
  fetchSchedulesList
} from '../../../common/api/academics';
import {
  getRecordingbyId,
  deleteRecordingbyId,
  createMeeting,
  joinMeeting,
  getMeetingInfo,
  createWebHook,
  getPostMeetingEventsInfo,
  deleteRecordingData,
  getPostIndividualMeetingEventsInfo
} from '../../helper/api';
import {
  createNewMeeting,
  getRecordingInfoById,
  joinMeetingById
} from '../../store/actions';
import { Batch } from '../../../academics/contracts/batch';
import { Schedule } from '../../../academics/contracts/schedule';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import { generateSchedulerSchema } from '../../../common/helpers';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { xml2js } from 'xml-js';
import BatchIcon from '../../../../assets/svgs/student-with-monitor-light.svg';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import DynamicFeedRoundedIcon from '@material-ui/icons/DynamicFeedRounded';
import moment from 'moment';
import { Meeting } from '../../contracts/meeting_interface';
import { BBBEvents } from '../../contracts/bbbevent_interface';
import { AttendanceOption } from '../../enums/attendance_options';

const styles = createStyles({
  typography_1: {
    color: '#4285F4'
  },
  typography_2: {
    color: 'red',
    paddingTop: '160px'
  },
  sidepanel_1: {
    //backgroundColor: '#FFFFFF',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  root: {
    boxShadow: 'none'
  },
  wireframe: {
    backgroundColor: 'coral'
  }
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}

interface Props extends WithStyles<typeof styles> {
  profile: Tutor;
}

const OrgTutorMeetingDashboard: FunctionComponent<Props> = ({
  classes,
  profile
}) => {
  const user = localStorage.getItem('authUser');
  const history = useHistory();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [redirectTo, setRedirectTo] = useState('');
  let [batchMeetings, setBatchMeetings] = useState<Meeting[]>([]);
  let [individualMeetingInfo, setIndividualMeetingInfo] = useState<Meeting>();
  let [recording, setRecording] = useState<Boolean>(false);
  let [attendance, setAttendance] = useState<Boolean>(false);
  const [thumbnail, setThumbnail] = useState('');
  let [attandanceChart, setAttandanceChart] = useState<any[]>([]);

  //MUI TABS
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    (async () => {
      try {
        if (user === null) return;
        const batchesList = await fetchBatchesList();
        const sortedbatches = batchesList.filter(function (batch) {
          return JSON.parse(user)._id === batch.tutorId;
        });
        setBatches(sortedbatches);
        getBatchClasses(sortedbatches[0]._id)
        const schedulesList = await fetchSchedulesList();
        setSchedules(schedulesList);
      } catch (error) {
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [profile.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const getBatchClasses = (batchID: string | undefined) => {
    setAttendance(false);
    setRecording(false);
    setThumbnail('');
    setIndividualMeetingInfo(undefined);
    setBatchMeetings([]);
    if (batchID === undefined) return;
    getPostMeetingEventsInfo(batchID).then((result) => {
      if (result.message === 'Success') setBatchMeetings(result.data);
    });
  };

  const getPostIndividualMeetingEventDetails = (internalMeetingID: string) => {
    setAttendance(true);
    setRecording(false);
    setIndividualMeetingInfo(undefined);
    getPostIndividualMeetingEventsInfo(internalMeetingID).then((result) => {
      if (result.message === 'Success') {
        setIndividualMeetingInfo(result.data);
        createTable(result.data);
      }
    });
  };

  const getmetadata = (internlMeetingID: string | undefined) => {
    axios
      .get(
        `https://bbb-testbucket.s3.ap-south-1.amazonaws.com/${internlMeetingID}/metadata.xml`
      )
      .then((result) => {
        const js_res: any = xml2js(result.data, { compact: true });
        var thumbnailURL =
          js_res.recording.playback.extensions.preview.images.image[0]._text;
        var length = thumbnailURL.length;
        var newthumbnailURL = `https://bbb-testbucket.s3.ap-south-1.amazonaws.com${thumbnailURL.substring(
          32,
          length
        )}`;
        setThumbnail(newthumbnailURL);
      });
  };

  const viewRecording = (recordingURL: string | undefined) => {
    if (recordingURL) window.open(recordingURL);
  };

  const deleteRecording = (internalMeetingID: string | undefined) => {
    if (internalMeetingID === undefined) return;
    deleteRecordingData(internalMeetingID).then((result) => {
      getPostIndividualMeetingEventDetails(result.internalMeetingID);
    });
  };

  const createTable = (individualMeetingInfo: Meeting | undefined) => {
    if (individualMeetingInfo === undefined) return;
    const events: BBBEvents[] = individualMeetingInfo.events;
    function createData(
      userID: string | undefined,
      userName: string | undefined,
      entryTime: string | Date,
      attended: string,
      ispresent: string
    ) {
      return {userID, userName, entryTime, attended, ispresent };
    }
    var rows: any[] = []
    // var defaulters: any [] = []
    const meetingEndEvent = events.filter(function (items) {
      return items.type === 'meeting-ended';
    });
    //console.log(meetingEndEvent)
    var totalMeetingTime =
      meetingEndEvent[0].eventTriggerTime - individualMeetingInfo.createTime;

    const students_array = (batches.find(batch => batch._id === individualMeetingInfo.meetingID))?.students
    console.log(students_array)
    // const tutorID = (batches.find(batch => batch._id === individualMeetingInfo.meetingID))?.tutorId
    // console.log(batches.find(batch => batch._id === individualMeetingInfo.meetingID))

    students_array?.map(student => {
      let total_time = 0
      const userEvent = events.filter(function (item) {
        if(item.userID === student) {
          return item.type === 'user-joined' || item.type === 'user-left';
        }
      });

      console.log('',userEvent,'\n',userEvent.length)

      const length = userEvent.length
      if(length === 0){
        rows.push(createData('-' , student, '-', '-', AttendanceOption.IS_ABSENT))
        return
      }

      // userEvent.map(eachEvent => {
      //   if(eachEvent.type === "user-joined"){
      //     if(eachEvent.userID === undefined) return
      //     students_array.map(student => {
      //       if(student !== eachEvent.userID) {
      //         rows.push(createData(student, '-', '-', '-', AttendanceOption.IS_ABSENT))
      //       }
      //     })
      //   }
      // })
      //console.log(userEvent)
      
      if((length % 2) !== 0) {
        for (let i=0; i<userEvent.length - 1; i+=2){
          const time = userEvent[i+1].eventTriggerTime - userEvent[i].eventTriggerTime
          total_time = total_time + time
        }
        total_time = total_time + (meetingEndEvent[0].eventTriggerTime - userEvent[length-1].eventTriggerTime)
        const percentage = (total_time/totalMeetingTime)*100
        var ispresent = AttendanceOption.IS_ABSENT;
        if (percentage > 75) ispresent = AttendanceOption.IS_PRESENT;
        rows.push(
          createData(userEvent[0].userID, userEvent[0]?.name, (new Date(userEvent[0].eventTriggerTime)).toLocaleTimeString(), percentage.toFixed(2), ispresent)
        )
      }
      if((length % 2) === 0) {
        for (let i=0; i<userEvent.length; i+=2){
          const time = userEvent[i+1].eventTriggerTime - userEvent[i].eventTriggerTime
          total_time = total_time + time
        }
        const percentage = (total_time/totalMeetingTime)*100;
        var ispresent = AttendanceOption.IS_ABSENT;
        if (percentage > 75) ispresent = AttendanceOption.IS_PRESENT;
        rows.push(
          createData(userEvent[0].userID, userEvent[0]?.name, (new Date(userEvent[0].eventTriggerTime)).toLocaleTimeString(), percentage.toFixed(2), ispresent)
        )
      }
    })
    // students_array?.filter(function(student){

    // })
    setAttandanceChart(rows);
    // console.log(rows)
  };

  return (
    <MainLayoutBBB>
      <Container maxWidth="xl" style={{padding:"0 120px"}}>
      <Box bgcolor="#fff" width="100%" padding="18px 30px" display="flex" alignItems="center">
            <img src={BatchIcon} alt="Create Batch" />

            <Box marginLeft="15px">
              <Typography component="span" color="secondary">
                <Box component="h3" fontWeight="600" margin="0">
                  Meeting Dashoard
                </Box>
              </Typography>
            </Box>
          </Box>
          <Divider/>
        <Box minHeight="78vH" bgcolor="#fff" padding="24px">
          <Grid style={{ minHeight: '100%' }} container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box className={classes.sidepanel_1}>
                <AppBar
                  className={classes.root}
                  position="static"
                  color="transparent"
                >
                  <Tabs
                    style={{ border: 'none' }}
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs"
                  >
                    {batches.map((batch) => {
                      return (
                        <Tab
                          onClick={() => getBatchClasses(batch._id)}
                          label={batch.batchfriendlyname}
                          {...a11yProps(batches.indexOf(batch))}
                        />
                      );
                    })}
                  </Tabs>
                </AppBar>

                {batches.map((batch) => {
                  return (
                    <TabPanel value={value} index={batches.indexOf(batch)}>
                      <Box width="100%" height="100%">
                        {
                          batchMeetings.length > 0 ? (
                            <h4
                          style={{ margin: "6px 0" }}
                        >{`${batch.boardname} ${batch.batchfriendlyname} - ${batch.classname} ${batch.subjectname}`}</h4>
                          ) : ''
                        }
                        <Box>
                          <Scrollbars
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            style={{ width: '744px', height: '455px' }}
                          >
                            {batchMeetings.map((meeting) => {
                              const date = new Date(meeting.createTime);
                              return (
                                <Box
                                  width="98%"
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  marginY="12px"
                                  bgcolor="#FFF"
                                  padding="0 8px"
                                  border="2px solid #373737"
                                  borderRadius="5px"
                                >
                                  <p style={{ marginLeft: '5px' }}>
                                    {meeting.meetingName}
                                  </p>
                                  <Box display="flex" alignItems="center">
                                    <CalendarTodayTwoToneIcon
                                      style={{ marginRight: '3px' }}
                                    />
                                    <p>{date.toLocaleDateString()}</p>
                                  </Box>
                                  <Box display="flex" alignItems="center">
                                    <AccessTimeTwoToneIcon
                                      style={{ marginRight: '3px' }}
                                    />
                                    <p>{date.toLocaleTimeString()}</p>
                                  </Box>
                                  <Button
                                    onClick={() => {
                                      getPostIndividualMeetingEventDetails(
                                        meeting.internalMeetingID
                                      );
                                      
                                    }
                                    }
                                  >
                                    <ChevronRightIcon />
                                  </Button>
                                </Box>
                              );
                            })}
                          </Scrollbars>
                        </Box>
                      </Box>
                    </TabPanel>
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                {!individualMeetingInfo ? (
                  ''
                ) : (
                  <Box
                    borderRadius="5px"
                    bgcolor="#373737"
                    width="100%"
                    //height="450px"
                    marginTop="100px"
                    display="flex"
                    flexDirection="column"
                  >
                    <Box
                      borderBottom="2px solid lightgray"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-evenly"
                    >
                      <Button
                        onClick={() => {
                          getmetadata(individualMeetingInfo?.internalMeetingID);
                          setRecording(true);
                          setAttendance(false);
                        }}
                        style={{ color: '#4C8BF5' }}
                      >
                        Recording
                      </Button>
                      <Divider
                        orientation="vertical"
                        flexItem
                        style={{ backgroundColor: 'lightgray' }}
                      />
                      <Button
                        onClick={() => {
                          createTable(individualMeetingInfo);
                          setAttendance(true);
                          setRecording(false);
                        }}
                        style={{ color: '#4C8BF5' }}
                      >
                        Attendance
                      </Button>
                    </Box>
                    {recording === false ? (
                      ''
                    ) : (
                      <Box
                        width="100%"
                        height="420px"
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                      >
                        {individualMeetingInfo.isRecorded === false ? (
                          <h4 className={classes.typography_2}>
                            Meeting was not recorded
                          </h4>
                        ) : individualMeetingInfo.isRecordingDeleted ===
                          true ? (
                          <h4 className={classes.typography_2}>
                            Recording was deleted by Tutor
                          </h4>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            style={{ paddingTop: '70px' }}
                          >
                            <img
                              style={{ height: '240px', width: '420px' }}
                              src={thumbnail}
                              alt="ThumbNail"
                            />
                            <Box
                              width="420px"
                              marginTop="12px"
                              display="flex"
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Button
                                onClick={() =>
                                  viewRecording(
                                    individualMeetingInfo?.recordingURL
                                  )
                                }
                                variant="outlined"
                                size="small"
                                style={{
                                  width: '100px',
                                  color: '#fff',
                                  border: '1px solid #4C8BF5'
                                }}
                              >
                                Play  <PlayCircleFilledWhiteIcon fontSize='small'/>
                              </Button>
                              <Button
                                onClick={() =>
                                  deleteRecording(
                                    individualMeetingInfo?.internalMeetingID
                                  )
                                }
                                variant="outlined"
                                size="small"
                                style={{
                                  width: '100px',
                                  color: '#fff',
                                  border: '1px solid red'
                                }}
                              >
                                Delete  <DeleteForeverIcon fontSize='small'/>
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                    {attendance === false ? (
                      ''
                    ) : (
                      <Scrollbars
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        style={{ width: '100%', height: '420px' }}
                      >
                        {attandanceChart.length === 0 ? (
                            ''
                          ) : (
                            <Box padding="5px 10px">
                              <TableContainer component={Box}>
                                <Table style={{ minWidth: '650px' }} aria-label="simple table">
                                  <TableHead style={{ backgroundColor: '#212121' }}>
                                    <TableRow>
                                      <TableCell style={{color:'#ffffff'}}>S.No</TableCell>
                                      <TableCell style={{color:'#ffffff'}}>Student Name</TableCell>
                                      <TableCell style={{color:'#ffffff'}} align="left">Entry Time</TableCell>
                                      <TableCell style={{color:'#ffffff'}} align="left">% Attended</TableCell>
                                      <TableCell style={{color:'#ffffff'}} align="left">Attendance</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {attandanceChart.map((row) => (
                                      <TableRow key={row.userID}>
                                        <TableCell style={{color:'#ffffff'}} component="th" scope="row">
                                          {attandanceChart.indexOf(row)+1}
                                        </TableCell>
                                        <TableCell style={{color:'#ffffff'}} align="left">{row.userName}</TableCell>
                                        <TableCell style={{color:'#ffffff'}} align="left">{row.entryTime}</TableCell>
                                        <TableCell style={{color:'#ffffff'}} align="left">{row.attended}</TableCell>
                                        <TableCell style={{color:'#ffffff'}} align="left">{row.ispresent}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          )}
                      </Scrollbars>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainLayoutBBB>
  );
};

function mapStateToProps(state: RootState) {
  return {
    meetingState: state.meetingReducer
  };
}

export default withStyles(styles)(
  connect(mapStateToProps)(OrgTutorMeetingDashboard)
);

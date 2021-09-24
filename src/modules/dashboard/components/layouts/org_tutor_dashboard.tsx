import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button as MuButton,
  Container,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import {
  CalendarViewDayRounded as CalendarIcon,
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  WatchLater as ClockIcon
} from '@material-ui/icons';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  fetchBatchDetails,
  fetchSchedulesList
} from '../../../common/api/academics';
import { Tutor } from '../../../common/contracts/user';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import CourseBlue from '../../../../assets/svgs/course-blue.svg';
import StudentWithMonitor from '../../../../assets/svgs/student-with-monitor.svg';
import Button from '../../../common/components/form_elements/button';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { generateSchedulerSchema } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
import { setAuthUser } from '../../../auth/store/actions';
import ProfileImage from '../../containers/profile_image';
import { useDispatch } from 'react-redux';
import { createMeeting, createWebHook, getMeetingInfo, joinMeeting } from '../../../bbbconference/helper/api';
import { createNewMeeting, joinMeetingById } from '../../../bbbconference/store/actions';
import { xml2js } from 'xml-js';
import axios from 'axios';
import { MeetingRoles } from '../../../bbbconference/enums/meeting_roles';

const styles = createStyles({
  boyWavingHard: {
    maxHeight: '145px',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

interface UpcomingCourseBlockProps {
  item: AppointmentSchedule;
}

const UpcomingCourseBlock: FunctionComponent<UpcomingCourseBlockProps> = ({
  item
}) => {
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = useState(false);
  const [students, setStudents] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const batch = await fetchBatchDetails({
          batchfriendlyname: item.schedule.batch
            ? item.schedule.batch.batchfriendlyname
            : ''
        });

        setStudents(
          batch.students.map((student) => student.studentName).join(', ')
        );
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [item]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const CourseIcon = () => {
    // if (isActive) {
    return (
      <Box marginRight="20px">
        <img src={CourseBlue} alt="Course" />
      </Box>
    );
    // }

    // return (
    //   <Box marginRight="20px">
    //     <img src={CourseOrange} alt="Course" />
    //   </Box>
    // );
  };

  const joinBlock = (MEETING_ID: string, userName: string) => {
    const uuid = JSON.parse(userName)._id;
    let u_name = JSON.parse(userName).tutorName;
    u_name = u_name.split(' ');
    u_name = u_name.join('+');
    const USER_NAME = `Tutor:+${u_name}`;
    joinMeeting(MEETING_ID, USER_NAME, MeetingRoles.TUTOR, uuid).then((res) => {
      dispatch(joinMeetingById(res.data));
    });
  };

  const join_Meeting = () => {
    //console.log(item.schedule.batch)
    const MEETING_ID = item.schedule.batch?._id
    const m_name = `${item.schedule.batch?.batchfriendlyname}+${item.title}`
    const userName = localStorage.getItem('authUser')
    const scheduleID = item.schedule._id
    
    if (MEETING_ID !== undefined && m_name !== undefined && scheduleID !== undefined) {
      const MEETING_NAME = m_name.split(' ').join('+');
      getMeetingInfo(MEETING_ID).then((res) => {
        axios.get(res.data).then((res) => {
          const js_res: any = xml2js(res.data, { compact: true });
          if (js_res.response.returncode._text === 'FAILED') {
            //create meeting if no meeting found
            //create meeting specific hook before creating meeting
            createWebHook(MEETING_ID);
            //create meeting after hook is created
            createMeeting(MEETING_ID, MEETING_NAME, scheduleID).then((res) => {
              dispatch(createNewMeeting(res.data));
              if (userName !== null) joinBlock(MEETING_ID, userName);
            });
          } else {
            if (userName !== null) joinBlock(MEETING_ID, userName);
          }
        });
      });
    }
  }

  const CourseActionButton = () => {
    return (
      <Button
        disableElevation
        color="secondary"
        variant="contained"
        onClick = {join_Meeting}
      >
        Start Class{' '}
        <Box
          component="span"
          display="flex"
          alignItems="center"
          marginLeft="5px"
        >
          <ChevronRightIcon fontSize="small" />
        </Box>
      </Button>
    )
  }

  // const CourseActionButton = () => {
  //   // if (isActive) {
  //   return (
  //     <Button
  //       disableElevation
  //       color="secondary"
  //       variant="contained"
  //       component={RouterLink}
  //       to={`/quizes?batchname=${
  //         item.schedule.batch && item.schedule.batch.batchfriendlyname
  //       }&fromhour=${item.schedule.fromhour}&weekday=${item.schedule.dayname}`}
  //     >
  //       Start Class{' '}
  //       <Box
  //         component="span"
  //         display="flex"
  //         alignItems="center"
  //         marginLeft="5px"
  //       >
  //         <ChevronRightIcon fontSize="small" />
  //       </Box>
  //     </Button>
  //   );
  //   // }

  //   // return (
  //   //   <Button disabled disableElevation variant="contained">
  //   //     Start Class{' '}
  //   //     <Box
  //   //       component="span"
  //   //       display="flex"
  //   //       alignItems="center"
  //   //       marginLeft="5px"
  //   //     >
  //   //       <LockIcon fontSize="small" />
  //   //     </Box>
  //   //   </Button>
  //   // );
  // };

  const scheduleSessionStart = moment(item.startDate);

  return (
    <Box bgcolor="white" marginTop="10px" padding="30px">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <CourseIcon />

          <Box>
            <Typography variant="subtitle2">
              {item.schedule.batch && item.schedule.batch.classname} -{' '}
              {item.schedule.batch && item.schedule.batch.subjectname}
            </Typography>
            <Typography variant="subtitle1">
              {item.schedule.batch && item.schedule.batch.batchfriendlyname},{' '}
              {item.schedule.batch && item.schedule.batch.boardname}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <Box display="flex" marginRight="15px">
            <Box
              component="span"
              display="flex"
              alignItems="center"
              marginRight="15px"
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                marginRight="5px"
              >
                <ClockIcon />
              </Box>{' '}
              {scheduleSessionStart.format('hh:mm A')}
            </Box>

            <Box component="span" display="flex" alignItems="center">
              <Box
                component="span"
                display="flex"
                alignItems="center"
                marginRight="5px"
              >
                <CalendarIcon />
              </Box>{' '}
              {scheduleSessionStart.format('YYYY-MM-DD')}
            </Box>
          </Box>

          <CourseActionButton />

          <Box component="span" marginLeft="10px">
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        bgcolor="#f2d795"
        marginTop="15px"
        style={{ display: isExpanded ? 'block' : 'none' }}
      >
        <Box padding="15px" display="flex" alignItems="center">
          <img src={StudentWithMonitor} alt="Student with Monitor" />

          <Box marginLeft="15px">
            <Typography>{students}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface Props extends WithStyles<typeof styles> {
  profile: Tutor;
}

const OrgTutorDashboard: FunctionComponent<Props> = ({ classes, profile }) => {
  const [schedules, setSchedules] = useState<AppointmentSchedule[]>([]);
  const [subject] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const schedulesList = await fetchSchedulesList();
        const schedulerSchema = generateSchedulerSchema(
          schedulesList
        ).sort((a, b) => moment(a.startDate).diff(moment(b.startDate)));

        setSchedules(schedulerSchema);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [profile.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  // const subjects = Array.from(
  //   new Set(profile.courseDetails.map((course) => course.subject))
  // );

  // TODO: Filter schedules based on the upcoming date and time.
  const filteredSchedules = schedules
    .filter((item) => moment(item.startDate).isSameOrAfter(moment()))
    .filter((item) =>
      subject.length > 0
        ? item.schedule.batch &&
          item.schedule.batch.subjectname.toLowerCase() ===
            subject.toLowerCase()
        : true
    );

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
                  <Grid item container>
                    <Grid item md={9}>
                      <Box>
                        <Typography variant="h5" color="secondary">
                          Hello {profile.tutorName}!
                        </Typography>
                        <Typography>It's good to see you again.</Typography>
                      </Box>
                    </Grid>

                    {/* <img
                    className={classes.boyWavingHard}
                    src={BoyWavingHand}
                    alt={`Hello ${profile.tutorName}!`}
                  /> */}
                    <Grid item md={3}>
                      <Box>
                        <ProfileImage
                          profile={profile}
                          name={profile.tutorName}
                          profileUpdated={(profile) =>
                            dispatch(setAuthUser(profile))
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* <Typography variant="h6">Upcoming Classes</Typography>

                <Box display="flex" marginTop="30px">
                  <Box marginRight="10px">
                    <MuButton
                      color="secondary"
                      size="small"
                      onClick={() => setSubject('')}
                    >
                      All Courses
                    </MuButton>
                  </Box>

                  {subjects.map((subject, index) => (
                    <Box key={index} marginRight="10px">
                      <MuButton
                        size="small"
                        onClick={() => setSubject(subject)}
                      >
                        {subject}
                      </MuButton>
                    </Box>
                  ))}
                </Box> */}
                {filteredSchedules.length > 0 && (
                  <Box>
                    {filteredSchedules.slice(0, 5).map((item, index) => (
                      <UpcomingCourseBlock key={index} item={item} />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box paddingX="15px">
                <Box display="flex">
                  <Box
                    bgcolor="#FBBC05"
                    color="white"
                    display="flex"
                    alignItems="center"
                    marginRight="10px"
                    padding="15px"
                  >
                    <Box marginRight="10px">
                      <Typography variant="h3">11</Typography>
                    </Box>

                    <Typography variant="subtitle1">
                      Classes Completed
                    </Typography>
                  </Box>

                  <Box
                    bgcolor="#4285F4"
                    color="white"
                    display="flex"
                    alignItems="center"
                    padding="15px"
                  >
                    <Box marginRight="10px">
                      <Typography variant="h3">14</Typography>
                    </Box>

                    <Typography variant="subtitle1">
                      Classes in Progress
                    </Typography>
                  </Box>
                </Box>

                <Box bgcolor="white" marginY="20px" padding="20px">
                  <Typography variant="h6">Your statistics</Typography>

                  <Box display="flex" alignItems="center" marginY="10px">
                    {/* <Box marginRight="5px">
                      <MuButton size="small">Teaching Hours</MuButton>
                    </Box>

                    <Box>
                      <MuButton size="small">My Classes</MuButton>
                    </Box> */}
                    <Button
                      color="primary"
                      variant="outlined"
                      size="large"
                      disableElevation
                    >
                      Teaching Hours
                    </Button>
                    <Button
                      style={{
                        marginLeft: '12px',
                        backgroundColor: '#4F4F4F',
                        color: '#fff',
                        textAlign: 'center'
                      }}
                      component={RouterLink}
                      to={`/meetings/dashboard`}
                      variant="outlined"
                      size="large"
                      disableElevation
                    >
                      Meeting Dashboard
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default withStyles(styles)(OrgTutorDashboard);

import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../auth/store/actions';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button as MuButton,
  Container,
  Grid,
  IconButton,
  Typography,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link
} from '@material-ui/core';
import {
  AllInclusive as AllInclusiveIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon,
  ArrowForward as ArrowForwardIcon,
  WatchLater as ClockIcon,
  Lock as LockIcon,
  Schedule as ScheduleIcon
} from '@material-ui/icons';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment';
import Chart from 'react-google-charts';
import {
  fetchBatchDetails,
  fetchSchedulesList
} from '../../../common/api/academics';
import { Tutor } from '../../../common/contracts/user';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import CourseBlue from '../../../../assets/svgs/course-blue.svg';
import StudentWithMonitor from '../../../../assets/images/student-with-monitor.png';
import BoyWavingHand from '../../../../assets/images/boy-waving-hand.png';
import Button from '../../../common/components/form_elements/button';
import Navbar from '../../../common/components/navbar';
import { generateSchedulerSchema } from '../../../common/helpers';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
// import ProfileImage from '../../containers/profile_image';
import {
  createMeeting,
  createWebHook,
  getMeetingInfo,
  joinMeeting
} from '../../../bbbconference/helper/api';
import {
  createNewMeeting,
  joinMeetingById
} from '../../../bbbconference/store/actions';
import axios from 'axios';
import { xml2js } from 'xml-js';
import { MeetingRoles } from '../../../bbbconference/enums/meeting_roles';

const useStyles = makeStyles({
  welcomeNote: {
    fontSize: '32px',
    lineHeight: '37px',
    color: '#000000',
    marginBottom: '10px'
  },
  boyWavingHard: {
    maxHeight: '165px',
    position: 'absolute',
    bottom: 0,
    right: '50px'
  },
  heading: {
    fontSize: '22px',
    lineHeight: '26px',
    color: '#4E4E4E'
  },
  allClasses: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '19px',
    color: 'rgba(0,0,0,0.3)'
  },
  selectedClass: {
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '19px',
    color: '#4C8BF5'
  },
  courseImage: {
    background: '#FBFAF9',
    borderRadius: '12px',
    padding: '12px 13px'
  },
  courseName: {
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#405169',
    marginBottom: '8px'
  },
  batchName: {
    fontSize: '13px',
    lineHeight: '15px',
    color: '#000000'
  },
  courseDetails: {
    fontSize: '13px',
    color: '#000000'
  },
  startBtn: {
    '& a': {
      fontWeight: 'bold',
      fontSize: '13px',
      lineHeight: '15px',
      color: '#FFFFFF'
    }
  },
  halfOpacity: {
    opacity: '0.5'
  },
  thirdOpacity: {
    opacity: '0.75'
  },
  progressContainer: {
    width: '185px',

    '& p': {
      marginBottom: '10px'
    },
    '& span': {
      fontSize: '12px',
      color: '#333333',
      textAlign: 'center',
      paddingTop: '5px',
      display: 'block'
    }
  },
  commonBox: {
    bgcolor: '#FFFFFF',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
    padding: '16px',
    textAlign: 'center',
    width: '185px'
  },
  boxHeading: {
    fontSize: '18px',
    lineHeight: '21px',
    color: '#212121',
    marginBottom: '10px'
  },
  boxNav: {
    fontSize: '18px',
    lineHeight: '21px',
    color: '#4C8BF5'
  },
  topicsHeading: {
    fontSize: '18px',
    lineHeight: '21px',
    color: '#00B9F5',
    marginBottom: '10px'
  },
  topicsList: {
    fontSize: '14px',
    lineHeight: '16px',
    color: '#000000'
  },
  classDetails: {
    display: 'flex',
    marginBottom: '10px',

    '& h5': {
      fontWeight: 'bold',
      fontSize: '18px',
      lineHeight: '23px',
      color: '#333333',
      marginRight: '10px'
    },
    '& h6': {
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '21px',
      color: '#333333',
      display: 'flex',
      alignItems: 'center',

      '& svg': {
        marginRight: '6px'
      }
    },
    '& span': {
      fontWeight: 500,
      fontSize: '16px',
      color: '#4C8BF5',
      marginRight: '20px'
    }
  },
  studentList: {
    fontSize: '15px',
    lineHeight: '19px',
    letterSpacing: '0.25px',
    color: '#000000'
  }
});

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 10,
    border: '1px solid #00B9F5'
  },
  colorPrimary: {
    backgroundColor: '#fff'
  },
  bar: {
    borderRadius: 10,
    backgroundColor: '#4C8BF5'
    // margin: '1px 0'
  }
}))(LinearProgress);

interface UpcomingCourseBlockProps {
  item: AppointmentSchedule;
}

const UpcomingCourseBlock: FunctionComponent<UpcomingCourseBlockProps> = ({
  item
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [students, setStudents] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [redirectTo, setRedirectTo] = useState('');

  const classes = useStyles();

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
        <img
          src={CourseBlue}
          className={`${classes.courseImage} ${
            isActive ? classes.halfOpacity : ''
          }`}
          alt="Course"
        />
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
    const MEETING_ID = item.schedule.batch?._id;
    const m_name = `${item.schedule.batch?.batchfriendlyname}+${item.title}`;
    const userName = localStorage.getItem('authUser');
    const scheduleID = item.schedule._id;

    if (
      MEETING_ID !== undefined &&
      m_name !== undefined &&
      scheduleID !== undefined
    ) {
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
  };

  const CourseActionButton = () => {
    return (
      <Box
        className={`${classes.startBtn} ${
          isActive ? classes.thirdOpacity : ''
        }`}
      >
        <Button
          disableElevation
          color="primary"
          variant="contained"
          // component={RouterLink}
          // to={`/quizes?batchname=${
          //   item.schedule.batch && item.schedule.batch.batchfriendlyname
          // }&fromhour=${item.schedule.fromhour}&weekday=${
          //   item.schedule.dayname
          // }`}
          onClick={join_Meeting}
        >
          {`${isActive ? 'Start Class' : ''}`}
          {isActive ? (
            <Box
              component="span"
              display="flex"
              alignItems="center"
              marginLeft="5px"
            >
              <ArrowForwardIcon fontSize="small" />
            </Box>
          ) : (
            <Box
              component="span"
              display="flex"
              alignItems="center"
              marginLeft="5px"
            >
              <LockIcon fontSize="small" />
            </Box>
          )}
          {`${isActive ? '' : 'Start Class'}`}
        </Button>
      </Box>
    );

    // return (
    // <Button disabled disableElevation variant="contained">
    //   Start Class{' '}
    //   <Box
    //     component="span"
    //     display="flex"
    //     alignItems="center"
    //     marginLeft="5px"
    //   >
    //     <LockIcon fontSize="small" />
    //   </Box>
    // </Button>
    // );
  };

  const scheduleSessionStart = moment(item.startDate);

  return (
    <Box
      bgcolor="white"
      borderRadius="3px"
      marginTop="16px"
      padding="8px 20px 8px 8px"
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <CourseIcon />

          <Box marginRight="10px">
            <Typography variant="subtitle2" className={classes.courseName}>
              {item.schedule.batch && item.schedule.batch.classname} -{' '}
              {item.schedule.batch && item.schedule.batch.subjectname}
            </Typography>
            <Typography variant="subtitle1" className={classes.batchName}>
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
              className={classes.courseDetails}
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
                className={classes.courseDetails}
              >
                <CalendarIcon />
              </Box>{' '}
              {scheduleSessionStart.format('YYYY-MM-DD')}
            </Box>
          </Box>

          <CourseActionButton />

          {/* <Box component="span" marginLeft="10px">
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </IconButton>
          </Box> */}
        </Box>
      </Box>

      {/* <Box
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
      </Box> */}
    </Box>
  );
};

interface Props {
  profile: Tutor;
}

const TutorDashboard: FunctionComponent<Props> = ({ profile }) => {
  const [schedules, setSchedules] = useState<AppointmentSchedule[]>([]);
  const [subject] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const dispatch = useDispatch();

  const classes = useStyles();

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

  const data = [
    ['Element', 'Hours', { role: 'style' }],
    ['Vanshika', 28, '#F9E5A2'],
    ['Antanu', 30, '#98F3B2'],
    ['Pravez', 20, '#e5e4e2'],
    ['Sudir', 12, '#EDADAD']
  ];

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const subjects = Array.from(
    new Set(profile.courseDetails.map((course) => course.subject))
  );

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

  const HelpText = () => {
    return (
      <Grid item md={12}>
        <Box>
          <ListItem dense>
            <ListItemIcon>
              <AllInclusiveIcon color="primary" />
            </ListItemIcon>

            <ListItemText>
              <Box component="h2">Usage Tips</Box>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>

            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/students`}
            >
              Add your Student details
            </Link>
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/tutor/batches/create`}
            >
              Create BATCH and include students to Batch
            </Link>
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/schedules`}
            >
              Create weekly SCHEDULE for each batch
            </Link>
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/dashboard`}
            >
              View Classes on dashboard
            </Link>
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/courses`}
            >
              Add content (Doc/Image/PDF) to your syllabus and publish during
              classes
            </Link>
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <Link
              color="inherit"
              component={RouterLink}
              to={`/profile/personal-information`}
            >
              Review/Update your profile
            </Link>
          </ListItem>
        </Box>
      </Grid>
    );
  };

  return (
    <div>
      <Navbar />

      <Box marginY="50px">
        <Container>
          <Grid container>
            <Grid item xs={12} md={7}>
              <Box paddingX="15px">
                <Box
                  bgcolor="white"
                  padding="35px 30px"
                  marginBottom="30px"
                  position="relative"
                  borderRadius="14px"
                >
                  <Grid item container>
                    <Grid item md={9}>
                      <Box>
                        <Typography
                          variant="h5"
                          className={classes.welcomeNote}
                        >
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
                        <img
                          className={classes.boyWavingHard}
                          src={BoyWavingHand}
                          alt={`Hello ${profile.tutorName}!`}
                        />
                        {/* <ProfileImage
                          profile={profile}
                          name={profile.tutorName}
                          profileUpdated={(profile) =>
                            dispatch(setAuthUser(profile))
                          }
                        /> */}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {filteredSchedules.length < 1 && <HelpText />}

                <Typography variant="h6" className={classes.heading}>
                  Upcoming Classes
                </Typography>

                <Box display="flex" margin="30px 0 15px 0">
                  <Box marginRight="20px" className={classes.selectedClass}>
                    All Courses
                  </Box>

                  {subjects.map((subject, index) => (
                    <Box
                      key={index}
                      marginRight="20px"
                      className={classes.allClasses}
                    >
                      {/* <MuButton
                        size="small"
                        onClick={() => setSubject(subject)}
                      > */}
                      {subject}
                      {/* </MuButton> */}
                    </Box>
                  ))}
                </Box>
                {filteredSchedules.length > 0 && (
                  <Box>
                    {filteredSchedules.slice(0, 5).map((item, index) => (
                      <UpcomingCourseBlock key={index} item={item} />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box paddingX="15px">
                <Box display="flex">
                  <Box
                    bgcolor="#00B9F5"
                    borderRadius="5px"
                    color="#ffffff"
                    display="flex"
                    alignItems="center"
                    marginRight="10px"
                    padding="15px"
                  >
                    <Box marginRight="15px">
                      <Typography variant="h2">11</Typography>
                    </Box>

                    <Typography variant="subtitle1">
                      Classes Completed
                    </Typography>
                  </Box>

                  <Box
                    bgcolor="#4C8BF5"
                    borderRadius="5px"
                    color="#ffffff"
                    display="flex"
                    alignItems="center"
                    padding="15px"
                  >
                    <Box marginRight="15px">
                      <Typography variant="h2">14</Typography>
                    </Box>

                    <Typography variant="subtitle1">
                      Classes in Progress
                    </Typography>
                  </Box>
                </Box>

                <Box
                  bgcolor="white"
                  marginY="20px"
                  padding="10px 30px"
                  boxShadow="1px 1px 1px rgba(0, 0, 0, 0.25), -1px -1px 1px rgba(0, 0, 0, 0.25)"
                  borderRadius="14px"
                >
                  {/* <Typography variant="h6">Your statistics</Typography>

                  <Box
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginY="10px"
                  >
                    {/* <Box marginRight="5px">
                      <MuButton size="small">Teaching Hours</MuButton>
                    </Box>

                    <Box>
                      <MuButton size="small">My Classes</MuButton>
                    </Box>
                  </Box> */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginBottom="15px"
                  >
                    <Box className={classes.progressContainer}>
                      <Typography>Progress</Typography>
                      <BorderLinearProgress variant="determinate" value={70} />
                      <Typography component="span">30 of 42 hour</Typography>
                    </Box>
                    <Box
                      className={classes.commonBox}
                      border="1px solid #4C8BF5"
                    >
                      <Typography className={classes.boxHeading}>
                        Class History
                      </Typography>
                      <Link className={classes.boxNav}>View</Link>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginBottom="15px"
                  >
                    <Box
                      className={classes.commonBox}
                      border="1px solid #22C5F8"
                    >
                      <Typography className={classes.topicsHeading}>
                        Topics Covered
                      </Typography>
                      <Typography className={classes.topicsList}>
                        Triangles, cirecle, lines
                      </Typography>
                    </Box>
                    <Box
                      className={classes.commonBox}
                      border="1px solid #4C8BF5"
                    >
                      <Typography className={classes.boxHeading}>
                        Syllabus
                      </Typography>
                      <Link className={classes.boxNav}>View</Link>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      Student Progress
                    </Typography>
                    <Box>
                      <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="200px"
                        data={data}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box
                  bgcolor="white"
                  borderRadius="7px"
                  padding="20px"
                  display="flex"
                  alignItems="center"
                >
                  <Box marginRight="20px">
                    <img src={StudentWithMonitor} alt="Student with Monitor" />
                  </Box>
                  <Box>
                    <Box className={classes.classDetails}>
                      <Typography variant="h5">Class VII</Typography>
                      <Typography component="span">[ English 2020]</Typography>
                      <Typography variant="h6">
                        <ScheduleIcon /> 06 PM-07 PM
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className={classes.studentList}>
                        Vanshika, Sumit, Antanu, Parvexz, Sudhir, +5...{' '}
                      </Typography>
                    </Box>
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

export default TutorDashboard;

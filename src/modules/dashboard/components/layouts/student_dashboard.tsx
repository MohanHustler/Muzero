import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button as MuButton,
  Container,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  LinearProgress,
  Typography
} from '@material-ui/core';
import {
  CalendarViewDayRounded as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  ArrowForward as ArrowForwardIcon,
  Lock as LockIcon,
  WatchLater as ClockIcon
} from '@material-ui/icons';
import {
  createStyles,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles';
import moment from 'moment';
import { fetchStudentSchedulesList } from '../../../common/api/academics';
import { Student } from '../../../common/contracts/user';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import CourseBlue from '../../../../assets/svgs/course-blue.svg';
import AttendaceIcon from '../../../../assets/svgs/attendance_svg.svg';
import Button from '../../../common/components/form_elements/button';
import Navbar from '../../../common/components/navbar';
import { generateSchedulerSchema } from '../../../common/helpers';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
import { getAttemptAssessments } from '../../../student_assessment/helper/api';
import { OngoingAssessment } from '../../../student_assessment/contracts/assessment_interface';
import GraduatedStudent from '../../../../assets/images/student.png';
import Knowledge from '../../../../assets/images/knowledge.png';
import Syllabus from '../../../../assets/images/syllabus.png';
import Clock from '../../../../assets/images/clock.png';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../auth/store/actions';
import ProfileImage from '../../containers/profile_image';
import {
  getMeetingInfo,
  isMeetingRunning,
  joinMeeting
} from '../../../bbbconference/helper/api';
import { joinMeetingById } from '../../../bbbconference/store/actions';
import { xml2js } from 'xml-js';
import axios from 'axios';
import { MeetingRoles } from '../../../bbbconference/enums/meeting_roles';

const styles = createStyles({
  boyWavingHard: {
    maxHeight: '145px',
    position: 'absolute',
    bottom: '10px',
    right: '250px'
  },
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  welcomeNote: {
    fontSize: '36px',
    lineHeight: '42px',
    color: '#FFFFFF',
    marginBottom: '10px'
  },
  helperText: {
    color: '#FFFFFF'
  },
  heading: {
    fontSize: '22px',
    lineHeight: '26px',
    color: '#4E4E4E'
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
    color: '#212121',
    marginBottom: '10px'
  },
  topicsList: {
    fontSize: '14px',
    lineHeight: '16px',
    color: '#000000'
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
  navItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '13px',

    '& p': {
      fontFamily: 'Libre Baskerville',
      fontSize: '22px',
      color: '#212121',
      marginLeft: '10px'
    }
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& a': {
      fontFamily: 'Libre Baskerville',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#4C8BF5',
      marginRight: '14px'
    }
  },
  studentProgressContainer: {
    '& a': {
      display: 'inline-block',
      marginTop: '10px',
      marginLeft: '25px'
    }
  },
  studentProgress: {
    textAlign: 'center',
    flex: 1,

    '& h3': {
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '21px',
      color: '#212121',
      marginBottom: '10px'
    },
    '& h4': {
      fontSize: '24px',
      lineHeight: '28px',
      color: '#212121',
      width: '37%',
      margin: '0 auto',
      marginTop: '5px'
    },
    '& h5': {
      fontSize: '18px',
      lineHeight: '21px',
      color: '#212121',
      marginTop: '5px'
    }
  },
  learnMore: {
    '& h5': {
      fontFamily: 'Libre Baskerville',
      fontSize: '22px',
      color: '#000000',
      marginBottom: '12px'
    },
    '& p': {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#000000',
      marginBottom: '15px',
      width: '70%'
    }
  },
  btnYellow: {
    '& button': {
      background: '#F9BD33',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: 'bold',
      fontSize: '13px',
      lineHeight: '15px',
      color: '#FFFFFF'
    }
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

interface CardProps {
  data: OngoingAssessment;
  profile: Student;
}

const SimpleCard: FunctionComponent<CardProps> = ({ profile, data }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {data.isSubmitted
            ? 'Submitted'
            : data.isStarted
            ? 'Ongoing'
            : 'Not Attempted'}
        </Typography>
        <Typography variant="h5" component="h2">
          {data.assessment.assessmentname}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {data.assessment.boardname +
            '-' +
            data.assessment.classname +
            '-' +
            data.assessment.subjectname}
        </Typography>
        <Typography variant="body2" component="p">
          Attempt Window
          <br />
          Start Time : {new Date(data.startDate).toLocaleString()}
          <br />
          End Time : {new Date(data.endDate).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            history.push(
              '/students/' +
                profile.mobileNo +
                '/student_assessement_test?attemptassessmentId=' +
                data._id
            );
          }}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

const UpcomingCourseBlock: FunctionComponent<UpcomingCourseBlockProps> = ({
  item
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isActive, setIsActive] = useState(true);

  const styles = useStyles();

  const CourseIcon = () => {
    // if (isActive) {
    return (
      <Box marginRight="20px">
        <img
          src={CourseBlue}
          className={`${styles.courseImage} ${
            isActive ? styles.halfOpacity : ''
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

  const join_Meeting = () => {
    var flag = 0;
    //console.log(item.schedule.batch)
    const MEETING_NAME = `${item.schedule.dayname} - ${item.schedule.fromhour} to ${item.schedule.tohour} | ${item.schedule.batch?.batchfriendlyname} | ${item.title}`;
    const MEETING_ID = item.schedule.batch?._id;
    const userName = localStorage.getItem('authUser');
    if (MEETING_ID !== undefined && userName !== null) {
      const uuid = JSON.parse(userName)._id;
      const u_name = JSON.parse(userName).studentName;
      const user_name = u_name.split(' ');
      const USER_NAME = `${user_name.join('+')}+ID:${
        JSON.parse(userName).enrollmentId
      }`;
      //checking if meeting is running
      isMeetingRunning(MEETING_ID).then((response) => {
        const js_response: any = response.data;
        if (js_response.response.running._text === 'false') {
          //window.alert('Class yet to be started by Tutor')
          //history.push(`/meetings/${JSON.parse(userName).mobileNo}/${MEETING_ID}/${uuid}/${USER_NAME}`)
          history.push(
            `/meetings/${MEETING_ID}/${uuid}/${USER_NAME}/${MEETING_NAME}`
          );
          return;
        }
        // Check if user already present in meeting room
        getMeetingInfo(MEETING_ID).then((res) => {
          axios.get(res.data).then((res) => {
            const js_res: any = xml2js(res.data, { compact: true });
            //console.log(js_res)

            if (Array.isArray(js_res.response.attendees.attendee) === true) {
              const members: any[] = js_res.response.attendees.attendee;
              //console.log(members)
              members.map((member) => {
                if (member.userID._text === uuid) flag = 1;
              });
            }
            if (flag === 0) {
              //joining meeting
              joinMeeting(
                MEETING_ID,
                USER_NAME,
                MeetingRoles.STUDENT,
                uuid
              ).then((res) => {
                dispatch(joinMeetingById(res.data));
              });
            } else {
              window.alert(
                'Multiple Instance Alert. You are already in the classroom'
              );
            }
          });
        });
      });
    }
  };

  const CourseActionButton = () => {
    return (
      <Box
        className={`${styles.startBtn} ${isActive ? styles.thirdOpacity : ''}`}
      >
        <Button
          disableElevation
          color="primary"
          variant="contained"
          // component={RouterLink}
          // to={`/quizes?batchname=${
          //   item.schedule.batch && item.schedule.batch.batchfriendlyname
          // }&tutorId=${item.schedule.tutorId}&fromhour=${
          //   item.schedule.fromhour
          // }&weekday=${item.schedule.dayname}`}
          onClick={() => {
            join_Meeting();
          }}
        >
          {`${isActive ? 'Join Class' : ''}`}
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
          {`${isActive ? '' : 'Join Class'}`}
        </Button>
      </Box>
    );
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
            <Typography variant="subtitle2" className={styles.courseName}>
              {item.schedule.batch && item.schedule.batch.classname} -{' '}
              {item.schedule.batch && item.schedule.batch.subjectname}
            </Typography>
            <Typography variant="subtitle1" className={styles.batchName}>
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
              className={styles.courseDetails}
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
                className={styles.courseDetails}
              >
                <CalendarIcon />
              </Box>{' '}
              {scheduleSessionStart.format('YYYY-MM-DD')}
            </Box>
          </Box>

          <CourseActionButton />
        </Box>
      </Box>
    </Box>
  );
};

interface Props extends WithStyles<typeof styles> {
  profile: Student;
}

const StudentDashboard: FunctionComponent<Props> = ({ classes, profile }) => {
  const [schedules, setSchedules] = useState<AppointmentSchedule[]>([]);
  const [subject, setSubject] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [attemptAssessments, setAttemptAssessments] = useState<
    OngoingAssessment[]
  >([]);
  const [dashboardObject, setDashboardObject] = useState<string>('courses');

  const styles = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const schedulesList = await fetchStudentSchedulesList();
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

  useEffect(() => {
    getAllAttemptAssessments();
  }, []);

  const getAllAttemptAssessments = async () => {
    try {
      const response = await getAttemptAssessments();
      console.log(response);
      setAttemptAssessments(response);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };
  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  //const subjects = Array.from(
  //  new Set(profile.courseDetails.map((course) => course.subject))
  //);

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
            <Grid item xs={12} md={7}>
              <Box paddingX="15px">
                <Box
                  bgcolor="#00B9F5"
                  padding="40px 30px"
                  marginBottom="30px"
                  position="relative"
                  borderRadius="14px"
                >
                  <Grid item container>
                    <Grid item md={9}>
                      <Box>
                        <Typography variant="h5" className={styles.welcomeNote}>
                          Hello {profile.studentName}!
                        </Typography>
                        <Typography className={styles.helperText}>
                          It's good to see you again.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item md={3}>
                      <Box>
                        <img
                          className={classes.boyWavingHard}
                          src={GraduatedStudent}
                          alt={`Hello ${profile.studentName}!`}
                        />
                        {/* <ProfileImage
                        profile={profile}
                        name={profile.studentName}
                        profileUpdated={(profile) =>
                          dispatch(setAuthUser(profile))
                        }
                      /> */}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="h6" className={styles.heading}>
                  Upcoming Classes
                </Typography>

                <Box display="flex" margin="30px 0 15px 0">
                  <Box marginRight="20px" className={styles.selectedClass}>
                    <MuButton
                      size="small"
                      onClick={() => {
                        setDashboardObject('courses');
                        setSubject('');
                      }}
                    >
                      All Courses
                    </MuButton>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" marginTop="30px">
                <Box>
                  {dashboardObject === 'assessments' && (
                    <Grid container>
                      {attemptAssessments.map((el, index) => {
                        return (
                          <Grid item md={6} lg={6} sm={6} xs={6} key={index}>
                            <Box marginTop="10px" marginLeft="10px">
                              <SimpleCard data={el} profile={profile} />
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}

                  {dashboardObject === 'courses' &&
                    filteredSchedules
                      .slice(0, 5)
                      .map((item, index) => (
                        <UpcomingCourseBlock key={index} item={item} />
                      ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box paddingX="15px"></Box>
              <Box paddingX="15px">
                <Box display="flex">
                  <Box
                    bgcolor="#FFFFFF"
                    color="#212121"
                    alignItems="center"
                    marginRight="20px"
                    padding="20px 35px"
                    borderRadius="5px"
                  >
                    <Box className={styles.navItem}>
                      <img src={Syllabus} alt="Syllabus" />
                      <Typography>Syllabus</Typography>
                    </Box>
                    <Box className={styles.navLinks}>
                      <Link>View</Link>
                      <Link>Download</Link>
                    </Box>
                  </Box>

                  <Box
                    bgcolor="#FFFFFF"
                    color="#212121"
                    alignItems="center"
                    padding="20px 35px"
                    borderRadius="5px"
                  >
                    <Box className={styles.navItem}>
                      <img src={Clock} alt="Clock" />
                      <Typography>Time Table</Typography>
                    </Box>
                    <Box className={styles.navLinks}>
                      <Link>View</Link>
                    </Box>
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
                    <Box className={styles.progressContainer}>
                      <Typography>Progress</Typography>
                      <BorderLinearProgress variant="determinate" value={70} />
                      <Typography component="span">30 of 42 hour</Typography>
                    </Box>
                    <Box
                      className={styles.commonBox}
                      border="1px solid #4C8BF5"
                      bgcolor="#4F4F4F"
                    >
                      <Typography
                        className={styles.boxHeading}
                        style={{ color: '#fff' }}
                      >
                        Class History
                      </Typography>
                      <Link className={styles.boxNav}>View</Link>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginBottom="15px"
                  >
                    <Box
                      className={styles.commonBox}
                      border="1px solid #22C5F8"
                    >
                      <Typography className={styles.topicsHeading}>
                        Topics Covered
                      </Typography>
                      <Typography className={styles.topicsList}>
                        Triangles, cirecle, lines
                      </Typography>
                    </Box>
                    <Box
                      className={styles.commonBox}
                      border="1px solid #4C8BF5"
                    >
                      <Typography className={styles.boxHeading}>
                        My Attendance
                      </Typography>
                      <Link className={styles.boxNav}>70%</Link>
                    </Box>
                  </Box>
                  <Box className={styles.studentProgressContainer}>
                    <Typography variant="subtitle1">My Progress</Typography>
                    <Box
                      bgcolor="#FFFFFF"
                      border="1px solid #4C8BF5"
                      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                      borderRadius="5px"
                      padding="20px 50px 20px 50px"
                      margin="20px 0"
                    >
                      <Box display="flex">
                        <Box
                          className={styles.studentProgress}
                          borderRight="1px solid #212121"
                        >
                          <Typography variant="h3">Score</Typography>
                          <Typography variant="h5">Full Mark - 50</Typography>
                          <Typography variant="h5">My Score - 35</Typography>
                        </Box>
                        <Box className={styles.studentProgress}>
                          <Typography variant="h3">Rank</Typography>
                          <Typography variant="h4">
                            5 Out of 25 Students
                          </Typography>
                        </Box>
                      </Box>
                      <Link className={styles.boxNav}>Details</Link>
                    </Box>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  bgcolor="#F5F5F7"
                  borderRadius="14px"
                  padding="20px"
                >
                  <Box className={styles.learnMore}>
                    <Typography variant="h5">Learn even more!</Typography>
                    <Typography>
                      Classes related Information will be come here
                    </Typography>
                    <Box className={styles.btnYellow}>
                      <Button>More Details</Button>
                    </Box>
                  </Box>
                  <Box>
                    <img src={Knowledge} alt="Knowledge" />
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

export default withStyles(styles)(StudentDashboard);

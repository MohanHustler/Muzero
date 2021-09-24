import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Box,
  Button as MuButton,
  Container,
  Grid,
  Typography
} from '@material-ui/core';
import {
  CalendarViewDayRounded as CalendarIcon,
  WatchLater as ClockIcon
} from '@material-ui/icons';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { fetchParentSchedulesList } from '../../../common/api/academics';
import { Parent } from '../../../common/contracts/user';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import BoyWavingHand from '../../../../assets/svgs/boy-waving-hand.svg';
import CourseBlue from '../../../../assets/svgs/course-blue.svg';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { generateSchedulerSchema } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';

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
        </Box>
      </Box>
    </Box>
  );
};

interface Props extends WithStyles<typeof styles> {
  profile: Parent;
}

const ParentDashboard: FunctionComponent<Props> = ({ classes, profile }) => {
  const [schedules, setSchedules] = useState<AppointmentSchedule[]>([]);
  const [subject, setSubject] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const schedulesList = await fetchParentSchedulesList();
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
                      Hello {profile.parentName}!
                    </Typography>
                    <Typography>It's good to see you again.</Typography>
                  </Box>

                  <img
                    className={classes.boyWavingHard}
                    src={BoyWavingHand}
                    alt={`Hello ${profile.parentName}!`}
                  />
                </Box>

                <Typography variant="h6">Upcoming Classes</Typography>

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
                </Box>

                <Box>
                  {filteredSchedules.slice(0, 5).map((item, index) => (
                    <UpcomingCourseBlock key={index} item={item} />
                  ))}
                </Box>
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
                    <Box marginRight="5px">
                      <MuButton size="small">Teaching Hours</MuButton>
                    </Box>

                    <Box>
                      <MuButton size="small">My Classes</MuButton>
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

export default withStyles(styles)(ParentDashboard);

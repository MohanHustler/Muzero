import React, { FunctionComponent, useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  Resources,
  Scheduler,
  WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { generateSchedulerSchema } from '../../../common/helpers';
import {
  fetchStudentSchedulesList,
  fetchParentSchedulesList
} from '../../../common/api/academics';
import { Student } from '../../../common/contracts/user';
import { Schedule } from '../../contracts/schedule';
import Calender from '../../../../assets/images/schedule-calendar.png';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
import { Role } from '../../../common/enums/role';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    todayCell: {
      backgroundColor: theme.palette.background.paper,
      border: 0
    },
    weekdayCell: {
      backgroundColor: theme.palette.background.default,
      border: 0
    },
    today: {
      backgroundColor: theme.palette.background.paper,
      textTransform: 'uppercase',

      '& .Cell-highlightedText-100': {
        color: '#333333',
        fontWeight: 'normal'
      }
    },
    weekday: {
      backgroundColor: theme.palette.background.default,
      textTransform: 'uppercase',
      color: '#333333'
    },
    paperContainer: {
      background: '#F9F9F9',
      boxShadow: '0px 10px 20px rgb(31 32 65 / 5%)',
      borderRadius: '4px',

      '& .makeStyles-stickyElement-68': {
        background: '#F9F9F9'
      }
    },
    heading: {
      margin: '0px',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#666666'
    }
  })
);

const TimeTableCell: FunctionComponent<WeekView.TimeTableCellProps> = (
  props
) => {
  const { startDate } = props;

  const date = new Date(startDate as Date);

  const classes = useStyles();

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  }

  return <WeekView.TimeTableCell {...props} className={classes.weekdayCell} />;
};

const DayScaleCell: FunctionComponent<WeekView.DayScaleCellProps> = (props) => {
  const { today } = props;

  const classes = useStyles();

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  }

  return <WeekView.DayScaleCell {...props} className={classes.weekday} />;
};

const generateInstancesSchema = (schedules: Schedule[]) => {
  const subjects = schedules.map((schedule) =>
    schedule.batch ? schedule.batch.subjectname : ''
  );

  return [...Array.from(subjects)].map((subject) => ({
    id: subject,
    text: subject
  }));
};

interface Props {
  profile: Student;
}

const StudentSchedules: FunctionComponent<Props> = ({ profile }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const authUserRole = localStorage.getItem('authUserRole');
        if (authUserRole === Role.STUDENT) {
          const schedulesList = await fetchStudentSchedulesList();
          setSchedules(schedulesList);
        } else {
          const schedulesList = await fetchParentSchedulesList();
          setSchedules(schedulesList);
        }
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

  const currentDate = new Date();

  const schedulerData = generateSchedulerSchema(schedules);

  const resources = [
    {
      fieldName: 'subject',
      title: 'Subjects',
      instances: generateInstancesSchema(schedules)
    }
  ];

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box marginY="20px">
          <Paper className={classes.paperContainer}>
            <Box padding="20px">
              <Box marginBottom="20px">
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center">
                      <img src={Calender} alt="Calender" />

                      <Box marginLeft="15px">
                        <Typography component="span" color="secondary">
                          <Box component="h3" className={classes.heading}>
                            My Schedule
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box
                maxHeight="500px"
                borderBottom="1px solid rgba(0, 0, 0, 0.1)"
                style={{ overflowY: 'auto' }}
              >
                <Scheduler data={schedulerData}>
                  <ViewState currentDate={currentDate} />
                  <WeekView
                    timeTableCellComponent={TimeTableCell}
                    dayScaleCellComponent={DayScaleCell}
                    startDayHour={6}
                    endDayHour={24}
                  />
                  <Appointments
                    appointmentComponent={(props) => (
                      <Appointments.Appointment {...props} />
                    )}
                  />
                  <Resources data={resources} mainResourceName="subject" />
                </Scheduler>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default StudentSchedules;

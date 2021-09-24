import React, { FunctionComponent, useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Schedule as ScheduleIcon } from '@material-ui/icons';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  Resources,
  Scheduler,
  WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { generateSchedulerSchema } from '../../../common/helpers';
import {
  fetchBatchDetails,
  fetchSchedulesList
} from '../../../common/api/academics';
import { Tutor } from '../../../common/contracts/user';
import { AppointmentSchedule, Schedule } from '../../contracts/schedule';
import Calender from '../../../../assets/svgs/calender.svg';
import StudentWithMonitor from '../../../../assets/svgs/student-with-monitor.svg';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';

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
      backgroundColor: theme.palette.background.paper
    },
    weekday: {
      backgroundColor: theme.palette.background.default
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

interface ScheduleSummaryProps {
  item: AppointmentSchedule;
}

const ScheduleSummary: FunctionComponent<ScheduleSummaryProps> = ({ item }) => {
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

  return (
    <Box bgcolor="#f2d795">
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <Box padding="15px" display="flex" alignItems="center">
            <img src={StudentWithMonitor} alt="Student with Monitor" />

            <Box marginLeft="15px">
              <Box display="flex">
                <Box display="flex" alignItems="center">
                  <Box component="h3" margin="0 10px 0 0" fontWeight="bold">
                    {item.schedule.batch && item.schedule.batch.classname}
                  </Box>
                  <Box
                    component="h3"
                    margin="0 10px 0 0"
                    color="#ad7f2b"
                    fontWeight="bold"
                  >
                    [{item.schedule.batch && item.schedule.batch.subjectname}]
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    marginLeft="15px"
                    marginRight="5px"
                  >
                    <ScheduleIcon fontSize="small" />
                  </Box>

                  <Typography>
                    {item.schedule.fromhour} - {item.schedule.tohour}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography>{students}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
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
  profile: Tutor;
}

const OrgTutorSchedules: FunctionComponent<Props> = ({ profile }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [
    selectedSchedule,
    setSelectedSchedule
  ] = useState<AppointmentSchedule | null>(null);
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const schedulesList = await fetchSchedulesList();
        setSchedules(schedulesList);
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
          <Paper>
            <Box padding="20px">
              <Box marginBottom="15px">
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center">
                      <img src={Calender} alt="Calender" />

                      <Box marginLeft="15px">
                        <Typography component="span" color="secondary">
                          <Box component="h3" fontWeight="600" margin="0">
                            Class Schedule
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box maxHeight="500px" style={{ overflowY: 'auto' }}>
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
                      <Appointments.Appointment
                        {...props}
                        onClick={(schedule) =>
                          setSelectedSchedule(schedule.data)
                        }
                      />
                    )}
                  />
                  <Resources data={resources} mainResourceName="subject" />
                </Scheduler>
              </Box>
            </Box>
            {selectedSchedule && <ScheduleSummary item={selectedSchedule} />}
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default OrgTutorSchedules;

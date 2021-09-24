import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Select,
  Paper,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  BorderColor as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@material-ui/icons';
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
import {
  updateOrgSchedule,
  deleteOrgSchedule
} from '../../../common/api/schedule';
import { fetchOrgTutorsList } from '../../../common/api/organization';
import { Organization, Tutor } from '../../../common/contracts/user';
import { AppointmentSchedule, Schedule } from '../../contracts/schedule';
import Calender from '../../../../assets/images/schedule-calendar.png';
import StudentWithMonitor from '../../../../assets/images/schedule-student.png';
import Button from '../../../common/components/form_elements/button';
import Navbar from '../../../common/components/navbar';
import ConfirmationModal from '../../../common/components/confirmation_modal';
import { exceptionTracker } from '../../../common/helpers';
import { scheduleStyles, scheduleSummaryStyles } from '../../../common/styles';
import { Redirect } from 'react-router-dom';
import EditOrgScheduleModal from '../edit_org_schedule_modal';

const TimeTableCell: FunctionComponent<WeekView.TimeTableCellProps> = (
  props
) => {
  const { startDate } = props;

  const date = new Date(startDate as Date);

  const classes = scheduleSummaryStyles();

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  }

  return <WeekView.TimeTableCell {...props} className={classes.weekdayCell} />;
};

const DayScaleCell: FunctionComponent<WeekView.DayScaleCellProps> = (props) => {
  const { today } = props;

  const classes = scheduleSummaryStyles();

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  }

  return <WeekView.DayScaleCell {...props} className={classes.weekday} />;
};

interface ScheduleSummaryProps {
  item: AppointmentSchedule;
  deleteSchedule: () => any;
  handleUpdateSchedule: (schedule: Schedule) => any;
}

const ScheduleSummary: FunctionComponent<ScheduleSummaryProps> = ({
  item,
  deleteSchedule,
  handleUpdateSchedule
}) => {
  const [students, setStudents] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [editScheduleModal, setEditScheduleModal] = useState(false);

  const classes = scheduleSummaryStyles();

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
    <Box bgcolor="#4285F4" borderRadius="7px">
      <Grid container alignItems="center">
        <Grid item xs={12} md={6}>
          <Box padding="18px 0 18px 18px" display="flex" alignItems="center">
            <img src={StudentWithMonitor} alt="Student with Monitor" />

            <Box marginLeft="15px">
              <Box display="flex" marginBottom="8px">
                <Box display="flex" alignItems="center">
                  <Box component="h3" className={classes.className}>
                    {item.schedule.batch && item.schedule.batch.classname}
                  </Box>
                  <Box component="h3" className={classes.subjectName}>
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
                    <ScheduleIcon className={classes.clockIcon} />
                  </Box>

                  <Typography className={classes.scheduleDuration}>
                    {item.schedule.fromhour} - {item.schedule.tohour}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography className={classes.studentsList}>
                  {students}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end" padding="18px">
            <Box marginRight="15px" className={classes.editBtn}>
              <Button
                disableElevation
                variant="outlined"
                color="default"
                size="large"
                onClick={deleteSchedule}
              >
                <Box component="span" marginRight="5px">
                  Delete Schedule
                </Box>

                <DeleteIcon fontSize="small" />
              </Button>
            </Box>

            <Box className={classes.editBtn}>
              <Button
                disableElevation
                variant="outlined"
                color="default"
                size="large"
                onClick={() => {
                  setEditScheduleModal(true);
                }}
              >
                <Box component="span" marginRight="5px">
                  Edit Schedule
                </Box>

                <EditIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <EditOrgScheduleModal
        openModal={editScheduleModal}
        handleClose={() => setEditScheduleModal(false)}
        selectedSchedule={item}
        handleUpdateSchedule={handleUpdateSchedule}
      />
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

interface Props extends WithStyles<typeof scheduleStyles> {
  profile: Organization;
}

const OrgSchedules: FunctionComponent<Props> = ({ profile, classes }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [tutorIndex, setTutorIndex] = useState(-1);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [
    selectedSchedule,
    setSelectedSchedule
  ] = useState<AppointmentSchedule | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [showScheduleSummary, setShowScheduleSummary] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  const fetchSchedule = async () => {
    try {
      const schedulesList = await fetchSchedulesList();
      setSchedules(schedulesList);
      const tutorsList = await fetchOrgTutorsList();
      setTutors(tutorsList);

      let filteredSchedules = schedulesList.filter(
        (schedule: Schedule) =>
          schedule.tutorId?.mobileNo === tutors[tutorIndex].mobileNo
      );
      setFilteredSchedules(filteredSchedules);

      // set selected schedule with updated data
      filteredSchedules.forEach((schedule) => {
        if (schedule._id === selectedSchedule?.schedule._id) {
          let currentSchedule = selectedSchedule?.schedule;
          currentSchedule = {
            ...currentSchedule,
            dayname: schedule.dayname,
            fromhour: schedule.fromhour,
            tohour: schedule.tohour
          };
          setSelectedSchedule({
            ...selectedSchedule,
            schedule: currentSchedule as Schedule
          } as AppointmentSchedule);
        }
      });
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line
  }, [profile.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const selectTutor = (index: number) => {
    setTutorIndex(index);
    if (index > -1) {
      let filteredSchedules = schedules.filter(
        (schedule) => schedule.tutorId?.mobileNo === tutors[index].mobileNo
      );
      setFilteredSchedules(filteredSchedules);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  const deleteSchedule = async (item: AppointmentSchedule) => {
    const schedulesList = [...filteredSchedules];
    const scheduleIndex = schedulesList.findIndex(
      (schedule) =>
        schedule.batch === item.schedule.batch &&
        schedule.dayname === item.schedule.dayname &&
        schedule.fromhour === item.schedule.fromhour &&
        schedule.mobileNo === item.schedule.mobileNo &&
        schedule.tohour === item.schedule.tohour
    );
    const clonedSchedule = schedulesList[scheduleIndex];

    try {
      schedulesList.splice(scheduleIndex, 1);

      setSchedules(schedulesList);
      setSelectedSchedule(null);
      setOpenConfirmationModal(false);
      setShowScheduleSummary(false);
      await deleteOrgSchedule({
        dayname: item.schedule.dayname,
        fromhour: item.schedule.fromhour
      });
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        schedulesList.push(clonedSchedule);
        setSchedules(schedulesList);
      }
    }
  };

  const currentDate = new Date();

  const schedulerData = generateSchedulerSchema(filteredSchedules);

  const resources = [
    {
      fieldName: 'subject',
      title: 'Subjects',
      instances: generateInstancesSchema(filteredSchedules)
    }
  ];

  const handleUpdateSchedule = async (schedule: Schedule) => {
    try {
      await updateOrgSchedule({
        scheduleId: schedule._id,
        dayname: schedule.dayname,
        fromhour: schedule.fromhour,
        tohour: schedule.tohour
      });
      fetchSchedule();
      setShowScheduleSummary(false);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

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
                            Class Schedule
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <Box marginRight="10px">
                        <Select
                          value={tutorIndex}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) => selectTutor(e.target.value as number)}
                          displayEmpty
                        >
                          <MenuItem value="-1">Select tutor</MenuItem>
                          {tutors.map((tutor, index) => (
                            <MenuItem key={index} value={index}>
                              {tutor.tutorName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <Box marginRight="10px" className={classes.addBtn}>
                        <Button
                          disableElevation
                          variant="contained"
                          color="primary"
                          size="large"
                          component={RouterLink}
                          to={`/profile/org/schedules/create`}
                        >
                          <Box display="flex" alignItems="center">
                            <AddIcon />
                          </Box>{' '}
                          Add Schedule
                        </Button>
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
                      <Appointments.Appointment
                        {...props}
                        onClick={(schedule) => {
                          setShowScheduleSummary(true);
                          setSelectedSchedule(schedule.data);
                        }}
                      />
                    )}
                  />
                  <Resources data={resources} mainResourceName="subject" />
                </Scheduler>
              </Box>
            </Box>
            {showScheduleSummary
              ? selectedSchedule && (
                  <ScheduleSummary
                    item={selectedSchedule}
                    deleteSchedule={() => setOpenConfirmationModal(true)}
                    handleUpdateSchedule={handleUpdateSchedule}
                  />
                )
              : ''}
          </Paper>
        </Box>
      </Container>
      {selectedSchedule && (
        <ConfirmationModal
          header="Delete Schedule"
          helperText="Are you sure you want to delete?"
          openModal={openConfirmationModal}
          onClose={() => setOpenConfirmationModal(false)}
          handleDelete={() => deleteSchedule(selectedSchedule)}
        />
      )}
    </div>
  );
};

export default withStyles(scheduleStyles)(OrgSchedules);

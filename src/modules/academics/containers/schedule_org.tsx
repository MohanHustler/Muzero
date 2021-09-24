import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  FormHelperText,
  Typography
} from '@material-ui/core';
import {
  Add as AddIcon,
  QueryBuilder as QueryBuilderIcon,
  RemoveCircleOutline as RemoveCircleIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { fetchSchedulesList } from '../../common/api/academics';
import { fetchOrgTutorsList } from '../../common/api/organization';
import { fetchOrgBatchesList } from '../../common/api/batch';
import {
  createOrgSchedule,
  deleteOrgSchedule
} from '../../common/api/schedule';
import { RootState } from '../../../store';
import { Schedule } from '../contracts/schedule';
import { Weekday } from '../../common/enums/weekday';
import { User, Tutor } from '../../common/contracts/user';
import Calender from '../../../assets/svgs/calender.svg';
import CalenderCircle from '../../../assets/svgs/calender-circle.svg';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { scheduleStyles } from '../../common/styles';
import ConfirmationModal from '../../common/components/confirmation_modal';
import { Batch } from '../contracts/batch';

interface Props extends WithStyles<typeof scheduleStyles> {
  authUser: User;
}

interface FormData {
  pageError: string;
  tutor: string;
  batchError: string;
  serverError: string;
}

const CreateScheduleOrg: FunctionComponent<Props> = ({ authUser, classes }) => {
  const { errors, setError, clearError } = useForm<FormData>({
    mode: 'onBlur'
  });
  const [batchIndex, setBatchIndex] = useState(0);
  const [day, setDay] = useState(Weekday.MONDAY);
  const [sessionStartTime, setSessionStartTime] = useState('06:00');
  const [sessionEndTime, setSessionEndTime] = useState('07:00');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [tutorIndex, setTutorIndex] = useState(-1);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [draftSchedules, setDraftSchedules] = useState<Schedule[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(-1);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    // Redirect the user to error location if he is not accessing his own
    // profile.
    if (!authUser.mobileNo) {
      setRedirectTo(`/profile/personal-information`);
      return;
    }

    (async () => {
      try {
        const batchesListResponse = fetchOrgBatchesList();
        const schedulesListResponse = fetchSchedulesList();

        const [batchesList, schedulesList] = await Promise.all([
          batchesListResponse,
          schedulesListResponse
        ]);

        const tutorsList = await fetchOrgTutorsList();
        setTutors(tutorsList);

        setBatches(batchesList);
        setFilteredBatches(batchesList);
        setSchedules(schedulesList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [authUser.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const addDraftSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    if (tutorIndex < 0) {
      setError('tutor', 'Invalid Data', 'Select Tutor');
      return;
    } else {
      clearError('tutor');
    }

    if (filteredBatches.length === 0) {
      setError('batchError', 'Invalid Data', 'Select Batch');
      return;
    } else {
      clearError('batchError');
    }

    if (sessionEndTime <= sessionStartTime) {
      setError(
        'pageError',
        'Invalid Data',
        'End time cannot be less than or equal to start time'
      );
      return;
    } else {
      clearError('pageError');
    }

    if (
      draftSchedules.filter(
        (schedule) =>
          schedule.batch?.batchfriendlyname ===
            filteredBatches[batchIndex].batchfriendlyname &&
          schedule.fromhour === sessionStartTime &&
          schedule.tohour === sessionEndTime &&
          schedule.dayname === day
      ).length > 0
    ) {
      setError('pageError', 'Invalid Data', 'Schedule already added');
      return;
    } else {
      clearError('pageError');
    }

    setDraftSchedules([
      ...draftSchedules,
      {
        mobileNo: tutors[tutorIndex].mobileNo,
        dayname: day,
        fromhour: sessionStartTime,
        tohour: sessionEndTime,
        batch: filteredBatches[batchIndex],
        tutorId: tutors[tutorIndex]
      }
    ]);
  };

  const selectTutor = (index: number) => {
    setTutorIndex(index);
    if (index > -1) {
      let filteredBatches = batches.filter(
        (batch) => batch.tutorId?.mobileNo === tutors[index].mobileNo
      );
      setFilteredBatches(filteredBatches);
    } else {
      setFilteredBatches(batches);
    }
  };

  const removeDraftSchedule = (scheduleIndex: number) => {
    const draftSchedulesCloned = [...draftSchedules];

    draftSchedulesCloned.splice(scheduleIndex, 1);

    setDraftSchedules(draftSchedulesCloned);
  };

  const removeSchedule = async (scheduleIndex: number) => {
    try {
      const clonedSchedules = [...schedules];

      const schedule = clonedSchedules[scheduleIndex];

      clonedSchedules.splice(scheduleIndex, 1);

      setSchedules(clonedSchedules);
      setOpenConfirmationModal(false);
      await deleteOrgSchedule({
        dayname: schedule.dayname,
        fromhour: schedule.fromhour,
        tutorId: schedule.tutorId?._id
      });
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const saveDraftSchedules = async () => {
    clearError('serverError');
    let clonedBatches: Batch[] = [];

    draftSchedules.forEach((draftSchedule) => {
      const structuredDraftScheduleIndex = clonedBatches.findIndex(
        (structuredDraftSchedule) =>
          draftSchedule.batch &&
          structuredDraftSchedule.boardname === draftSchedule.batch.boardname &&
          structuredDraftSchedule.classname === draftSchedule.batch.classname &&
          structuredDraftSchedule.subjectname ===
            draftSchedule.batch.subjectname &&
          structuredDraftSchedule.batchfriendlyname ===
            draftSchedule.batch.batchfriendlyname
      );

      const schedule = {
        fromhour: draftSchedule.fromhour,
        tohour: draftSchedule.tohour,
        dayname: draftSchedule.dayname
      };

      if (
        structuredDraftScheduleIndex > -1 &&
        clonedBatches[structuredDraftScheduleIndex] &&
        clonedBatches[structuredDraftScheduleIndex].schedules
      ) {
        clonedBatches[structuredDraftScheduleIndex].schedules = [
          ...(clonedBatches[structuredDraftScheduleIndex]
            .schedules as Schedule[]),
          schedule
        ];
      } else {
        const clonedBatch = filteredBatches[batchIndex];

        clonedBatch.schedules = [schedule];

        clonedBatches = [...clonedBatches, clonedBatch];
      }
    });

    clonedBatches.forEach(async (clonedBatch) => {
      try {
        await createOrgSchedule({
          batchfriendlyname: clonedBatch.batchfriendlyname,
          schedules: clonedBatch.schedules as Schedule[]
        });
        setSchedules([...schedules, ...draftSchedules]);
        setDraftSchedules([]);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        } else {
          setError('serverError', 'Invalid Data', error.response.data.message);
        }
      }
    });
  };

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box bgcolor="white" marginY="20px">
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box
                padding="20px 30px"
                display="flex"
                alignItems="center"
                borderBottom="1px solid rgba(224, 224, 224, 0.5)"
                borderRight="1px solid #C4C4C4"
              >
                <img src={Calender} alt="Calender" />

                <Box marginLeft="20px">
                  <Typography component="span" color="secondary">
                    <Box component="h3" className={classes.heading}>
                      Add Schedule
                    </Box>
                  </Typography>
                </Box>
              </Box>

              <Box padding="20px 30px" borderRight="1px solid #C4C4C4">
                <form onSubmit={addDraftSchedule}>
                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Day</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
                          value={day}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) => setDay(e.target.value as Weekday)}
                        >
                          <MenuItem value="Monday">Monday</MenuItem>
                          <MenuItem value="Tuesday">Tuesday</MenuItem>
                          <MenuItem value="Wednesday">Wednesday</MenuItem>
                          <MenuItem value="Thursday">Thursday</MenuItem>
                          <MenuItem value="Friday">Friday</MenuItem>
                          <MenuItem value="Saturday">Saturday</MenuItem>
                          <MenuItem value="Sunday">Sunday</MenuItem>
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Tutor</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
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
                        </CustomSelect>
                      </FormControl>
                      {errors.tutor && (
                        <FormHelperText error>
                          {errors.tutor.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Batch Name</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
                          value={batchIndex}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) => setBatchIndex(e.target.value as number)}
                        >
                          {filteredBatches.map((option, index) => (
                            <MenuItem key={index} value={index}>
                              {option.batchfriendlyname} - {option.classname} -{' '}
                              {option.subjectname}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </FormControl>
                      {errors.batchError && (
                        <FormHelperText error>
                          {errors.batchError.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Session Start Time</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomInput
                          type="time"
                          value={sessionStartTime}
                          onChange={(e) => setSessionStartTime(e.target.value)}
                          inputProps={{
                            step: 1800 // 30 min
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Session End Time</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomInput
                          type="time"
                          value={sessionEndTime}
                          onChange={(e) => setSessionEndTime(e.target.value)}
                          inputProps={{
                            step: 1800 // 30 min
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth margin="normal">
                    <Box display="flex" justifyContent="flex-end">
                      <Box className={classes.addBtn}>
                        <Button
                          disableElevation
                          color="secondary"
                          size="small"
                          variant="contained"
                          type="submit"
                        >
                          <AddIcon /> Add
                        </Button>
                      </Box>
                    </Box>
                  </FormControl>
                  <Box display="flex" justifyContent="flex-end">
                    {errors.pageError && (
                      <FormHelperText error>
                        {errors.pageError.message}
                      </FormHelperText>
                    )}
                  </Box>
                </form>

                {draftSchedules && draftSchedules.length > 0 && (
                  <Box>
                    <Box
                      borderBottom="1px dashed #EAE9E4"
                      borderTop="1px dashed #EAE9E4"
                      marginY="20px"
                      paddingY="18px"
                    >
                      <Box marginBottom="10px">
                        <Grid container>
                          <Grid item xs={2}>
                            <Box className={classes.tableHeading}>DAY</Box>
                          </Grid>

                          <Grid item xs={2}>
                            <Box className={classes.tableHeading}>TUTOR</Box>
                          </Grid>

                          <Grid item xs={3}>
                            <Box className={classes.tableHeading}>
                              BATCH NAME
                            </Box>
                          </Grid>

                          <Grid item xs={5}>
                            <Box className={classes.tableHeading}>
                              SESSION TIMINGS
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {draftSchedules.map((draftSchedule, index) => (
                        <Box marginTop="5px" key={index}>
                          <Grid container alignItems="center">
                            <Grid item xs={2}>
                              <Box className={classes.tableData}>
                                {draftSchedule.dayname}
                              </Box>
                            </Grid>

                            <Grid item xs={2}>
                              <Box className={classes.tableData}>
                                {draftSchedule.tutorId?.tutorName}
                              </Box>
                            </Grid>

                            <Grid item xs={3}>
                              <Box className={classes.tableData}>
                                {draftSchedule.batch &&
                                  draftSchedule.batch.batchfriendlyname}
                              </Box>
                            </Grid>

                            <Grid item xs={3}>
                              <Box className={classes.tableData}>
                                {draftSchedule.fromhour} -{' '}
                                {draftSchedule.tohour}
                              </Box>
                            </Grid>

                            <Grid item xs={2}>
                              <Box display="flex">
                                <IconButton
                                  size="small"
                                  onClick={() => removeDraftSchedule(index)}
                                >
                                  <RemoveCircleIcon
                                    className={classes.removeIcon}
                                  />
                                </IconButton>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <Box display="flex" justifyContent="flex-end" marginTop="20px">
                  <Box className={classes.cancelBtn}>
                    <Button
                      disableElevation
                      size="large"
                      variant="contained"
                      onClick={() => {}}
                    >
                      Cancel
                    </Button>
                  </Box>

                  <Box className={classes.saveBtn}>
                    <Button
                      disableElevation
                      color="primary"
                      size="large"
                      variant="contained"
                      onClick={saveDraftSchedules}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  {errors.serverError && (
                    <FormHelperText error>
                      {errors.serverError.message}
                    </FormHelperText>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                padding="25px 30px"
                display="flex"
                alignItems="center"
                borderBottom="1px solid rgba(224, 224, 224, 0.5)"
              >
                <img src={CalenderCircle} alt="Calender" />

                <Box component="h3" className={classes.dayName}>
                  {day}
                </Box>
              </Box>

              <Box
                padding="20px 30px"
                maxHeight="500px"
                style={{ overflowY: 'auto' }}
              >
                {schedules
                  .filter(
                    (schedule) =>
                      (tutorIndex === -1 &&
                        schedule.dayname.toLowerCase() === day.toLowerCase()) ||
                      (tutorIndex > -1 &&
                        schedule.dayname.toLowerCase() === day.toLowerCase() &&
                        schedule.tutorId?.mobileNo ===
                          tutors[tutorIndex].mobileNo)
                  )
                  .map((schedule, index) => (
                    <Box
                      key={index}
                      display="flex"
                      bgcolor="#C1E3F2"
                      borderRadius="2px"
                      color="#333333"
                      marginTop="10px"
                      padding="10px 12px"
                      border="1px solid rgba(0, 0, 0, 0.08)"
                    >
                      <Box>
                        <Typography className={classes.scheduleName}>
                          {schedule.batch?.classname} -{' '}
                          {schedule.batch?.subjectname} -{' '}
                          {schedule.tutorId?.tutorName}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          className={classes.scheduleDetails}
                        >
                          {schedule.batch?.batchfriendlyname}

                          <Box
                            display="flex"
                            alignItems="center"
                            marginLeft="10px"
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              component="span"
                              marginRight="5px"
                            >
                              <QueryBuilderIcon fontSize="small" />
                            </Box>{' '}
                            {schedule.fromhour} - {schedule.tohour}
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        flexGrow="1"
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCurrentScheduleIndex(index);
                            setOpenConfirmationModal(true);
                          }}
                        >
                          <RemoveCircleIcon
                            className={classes.removeScheduleIcon}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <ConfirmationModal
        header="Delete Schedule"
        helperText="Are you sure you want to delete?"
        openModal={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        handleDelete={() => removeSchedule(currentScheduleIndex)}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(
  withStyles(scheduleStyles)(CreateScheduleOrg)
);

import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../common/components/form_elements/button';
import { Weekday } from '../../common/enums/weekday';
import Modal from '../../common/components/modal';
import { exceptionTracker } from '../../common/helpers';
import { AppointmentSchedule, Schedule } from '../contracts/schedule';

interface Props {
  openModal: boolean;
  handleClose: () => any;
  selectedSchedule: AppointmentSchedule;
  handleUpdateSchedule: (schedule: Schedule) => any;
}

interface FormData {
  day: string;
  startTime: string;
  endTime: string;
}

const EditTutorScheduleModal: FunctionComponent<Props> = ({
  openModal,
  handleClose,
  selectedSchedule,
  handleUpdateSchedule
}) => {
  const [day, setDay] = useState(Weekday.MONDAY);
  const [sessionStartTime, setSessionStartTime] = useState('06:00');
  const [sessionEndTime, setSessionEndTime] = useState('07:00');
  const { errors, setError, clearError } = useForm<FormData>();
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setDay(selectedSchedule.schedule.dayname as Weekday);
        setSessionStartTime(selectedSchedule.schedule.fromhour);
        setSessionEndTime(selectedSchedule.schedule.tohour);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [selectedSchedule]);

  const handleSubmitSchedule = () => {
    if (!day.length) {
      setError('day', 'Invalid Data', 'Day should not be empty');
      return;
    } else {
      clearError('day');
    }

    if (sessionStartTime.length < 1) {
      setError('startTime', 'Invalid Data', 'Invalid start time');
      return;
    } else {
      clearError('startTime');
    }
    if (sessionEndTime.length < 1) {
      setError('endTime', 'Invalid Data', 'Invalid end time');
      return;
    } else {
      clearError('endTime');
    }

    if (sessionStartTime >= sessionEndTime) {
      setError(
        'endTime',
        'Invalid Data',
        'End time should be greater than start time'
      );
      return;
    } else {
      clearError('endTime');
    }

    handleUpdateSchedule({
      _id: selectedSchedule.schedule._id,
      dayname: day,
      fromhour: sessionStartTime,
      tohour: sessionEndTime
    });
    handleClose();
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <Modal
      open={openModal}
      handleClose={handleClose}
      header={
        <Box display="flex" alignItems="center">
          <Box marginLeft="15px">
            <Typography component="span" color="secondary">
              <Box component="h3" color="white" fontWeight="400" margin="0">
                Edit Schedule
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <form>
        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <Box fontWeight="bold" marginTop="5px">
                Day
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <Select
                value={day}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  setDay(e.target.value as Weekday)
                }
              >
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </Select>
            </FormControl>
            {errors.day && (
              <FormHelperText error>{errors.day.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <Box fontWeight="bold" marginTop="5px">
                Batch Name
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <TextField
                type="text"
                value={`${selectedSchedule.schedule.batch?.batchfriendlyname} - ${selectedSchedule.schedule.batch?.classname} - ${selectedSchedule.schedule.batch?.subjectname}`}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <Box fontWeight="bold" marginTop="5px">
                Session Start Time
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <TextField
                type="time"
                value={sessionStartTime}
                onChange={(e) => setSessionStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 1800 // 30 min
                }}
              />
            </FormControl>
            {errors.startTime && (
              <FormHelperText error>{errors.startTime.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <Box fontWeight="bold" marginTop="5px">
                Session End Time
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <TextField
                type="time"
                value={sessionEndTime}
                onChange={(e) => setSessionEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 1800 // 30 min
                }}
              />
            </FormControl>
            {errors.endTime && (
              <FormHelperText error>{errors.endTime.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" marginTop="10px">
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            onClick={handleSubmitSchedule}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default EditTutorScheduleModal;

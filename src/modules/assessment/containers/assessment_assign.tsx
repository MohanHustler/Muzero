import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '../../common/contracts/user';
import { connect } from 'react-redux';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { RootState } from '../../../store';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import AssessmentIcon from '../../../assets/images/assessment-checklist.png';
import {
  addAssessment,
  getAssessmentsForTutor,
  getBatches,
  assignAssessment,
  getStudentsData
} from '../helper/api';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { assessmentStyles } from '../../common/styles';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Assessment } from '../contracts/assessment_interface';
import { Batch } from '../contracts/batch_interface';
import StudentTransferList from '../components/studentTransferList';
import { Student } from '../contracts/student_interface';
import { StudentInfo } from '../contracts/studentInfo_interface';
import { AccountBoxSharp } from '@material-ui/icons';

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

interface Props
  extends RouteComponentProps<{ mode: string; username: string }>,
    WithStyles<typeof assessmentStyles> {
  authUser: User;
}

const Assessment_assign: FunctionComponent<Props> = ({
  location,
  history,
  authUser,
  classes
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [
    selectedAssessment,
    setSelectedAssessment
  ] = useState<Assessment | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectTo, setRedirectTo] = useState('');
  const [studentsLeft, setStudentLeft] = useState<Student[]>([]);
  const [studentsRight, setStudentsRight] = useState<Student[]>([]);
  const [studentData, setStudentData] = useState<StudentInfo[]>([]);
  const [solutionDelay, setSolutionDelay] = useState<number>(0);

  useEffect(() => {
    getassessments(false);
    getStudentData();
  }, []);

  useEffect(() => {
    if (selectedAssessment !== null) {
      getBatchList({
        boardname: selectedAssessment.boardname,
        classname: selectedAssessment.classname,
        subjectname: selectedAssessment.subjectname
      });
    }
  }, [selectedAssessment]);

  useEffect(() => {
    if (selectedAssessment !== null) {
      var studentsArr: Student[] = [];
      if (
        selectedBatch?.students === undefined ||
        selectedBatch?.students === null
      ) {
        enqueueSnackbar('No students in this batch', { variant: 'warning' });
      } else {
        studentsArr = selectedBatch?.students;
      }
      setStudentLeft(studentsArr);
      setStudentsRight([]);
    }
  }, [selectedBatch]);

  const getStudentData = async () => {
    try {
      const response = await getStudentsData();
      setStudentData(response);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        // setRedirectTo('/login')
      }
    }
  };

  const getassessments = async (privateBool: boolean) => {
    try {
      const response = await getAssessmentsForTutor(privateBool);
      setAssessments(response);
      if (location.search.indexOf('assessmentId=') !== -1) {
        const assessmentId = location.search.split('=')[1];
        setSelectedAssessment(
          response.filter((el) => el._id === assessmentId)[0]
        );
      }
      setLoading(false);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const clearForm = () => {
    setSelectedBatch(null);
    setSelectedAssessment(null);
    setStartDate(null);
    setEndDate(null);
    enqueueSnackbar('All fields cleared', { variant: 'info' });
  };

  const getBatchList = async (queryData: Object) => {
    const batchList = await getBatches(queryData);
    if (batchList.length === 0) {
      enqueueSnackbar(
        'No available batches for current assessment. Please add new batch',
        { variant: 'info' }
      );
    } else {
      setBatches(batchList);
    }
  };

  const getAddedMarks = () => {
    var addedMarks = 0;
    selectedAssessment?.sections.forEach((section) => {
      section.questions.forEach((question) => {
        addedMarks = addedMarks + question.marks;
      });
    });
    return addedMarks;
  };

  const checkValidation = () => {
    if (startDate?.toString() === 'Invalid Date' || startDate === null) {
      enqueueSnackbar('Please assign a valid Start Date', {
        variant: 'warning'
      });
      return false;
    }
    if ((startDate as Date) < new Date()) {
      enqueueSnackbar('Start Date cannot be in past', { variant: 'warning' });
      return false;
    }
    if (endDate?.toString() === 'Invalid Date' || endDate === null) {
      enqueueSnackbar('Please assign a valid End Date', {
        variant: 'warning'
      });
      return false;
    }
    if ((endDate as Date) < new Date()) {
      enqueueSnackbar('End Date cannot be in past', { variant: 'warning' });
      return false;
    }
    if ((endDate as Date) < (startDate as Date)) {
      enqueueSnackbar('End Date cannot be before Start Date', {
        variant: 'warning'
      });
      return false;
    }
    if (selectedAssessment === null) {
      enqueueSnackbar('Please select a valid assessment', {
        variant: 'warning'
      });
      return false;
    }
    if (getAddedMarks() !== selectedAssessment.totalMarks) {
      enqueueSnackbar(
        'Total Marks should be equal to added marks. Please add more questions.',
        { variant: 'warning' }
      );
      return false;
    }
    if (
      !selectedAssessment.sections.some(
        (section) => section.questions.length > 0
      )
    ) {
      enqueueSnackbar('At least one question needs to be added to assessment', {
        variant: 'warning'
      });
      return false;
    }

    if (studentsRight.length === 0) {
      enqueueSnackbar('At least one student needs to be selected', {
        variant: 'warning'
      });
      return false;
    }
    return true;
  };

  const assignAssessmentData = async () => {
    const assessmentData = {
      startDate: startDate,
      endDate: endDate,
      assessment: selectedAssessment?._id,
      solutionTime: addMinutes(endDate as Date, solutionDelay)
    };
    if (checkValidation()) {
      try {
        const response = await assignAssessment(
          assessmentData,
          studentsRight.map((el) => el._id)
        );
        if (response.status === 200) {
          enqueueSnackbar('Successfully Assigned Assessments', {
            variant: 'success'
          });
          history.push('/profile/assessment');
        } else {
          enqueueSnackbar('Failure in assigning the assessment', {
            variant: 'warning'
          });
        }
      } catch (err) {
        exceptionTracker(err.response?.data.message);
        if (err.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    }
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div>
      <Navbar />
      <Grid container alignItems="center" justify="center">
        <Grid item lg={7} md={8} sm={11} xs={12}>
          <Paper elevation={4}>
            <Box
              bgcolor="white"
              marginY="20px"
              boxShadow="0px 10px 20px rgb(31 32 65 / 5%)"
              borderRadius="4px"
            >
              <Grid container alignItems="center" justify="center">
                <Grid item xs={12} md={6}>
                  <Box padding="35px 30px" display="flex" alignItems="center">
                    <Box margin="auto" display="flex" alignItems="center">
                      <img src={AssessmentIcon} alt="Calender" />

                      <Box marginLeft="15px">
                        <Typography component="span" color="secondary">
                          <Box component="h2" className={classes.heading}>
                            Assign Assessment
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Divider />

              <Grid container alignItems="center" justify="center">
                <Grid item xs={12} md={9}>
                  <Box padding="5px 40px ">
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Assessment</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Select Assessment
                          </InputLabel>
                          <CustomSelect
                            required
                            value={
                              selectedAssessment === null
                                ? ''
                                : JSON.stringify(selectedAssessment)
                            }
                            onChange={(
                              e: React.ChangeEvent<{ value: unknown }>
                            ) => {
                              const val = e.target.value as string;
                              console.log(JSON.parse(val));
                              if (val === '') {
                                setSelectedAssessment(null);
                              } else {
                                setSelectedAssessment(JSON.parse(val));
                              }
                            }}
                            displayEmpty
                          >
                            <MenuItem value="">Select Assessment</MenuItem>
                            {assessments.map((options, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={JSON.stringify(options)}
                                >
                                  {options.assessmentname}
                                  {' - '}
                                  {options.boardname}
                                  {', '}
                                  {options.classname}
                                  {', '}
                                  {options.subjectname}
                                </MenuItem>
                              );
                            })}
                          </CustomSelect>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Batch</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Select Batch
                          </InputLabel>
                          <CustomSelect
                            required
                            value={
                              selectedBatch === null
                                ? ''
                                : JSON.stringify(selectedBatch)
                            }
                            onChange={(
                              e: React.ChangeEvent<{ value: unknown }>
                            ) => {
                              const val = e.target.value as string;
                              if (val === '') {
                                setSelectedBatch(null);
                              } else {
                                setSelectedBatch(JSON.parse(val));
                              }
                            }}
                            displayEmpty
                          >
                            <MenuItem value="">Select Batch</MenuItem>
                            {batches.map((options, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={JSON.stringify(options)}
                                >
                                  {options.batchfriendlyname}
                                </MenuItem>
                              );
                            })}
                          </CustomSelect>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {studentsLeft.length > 0 || studentsRight.length > 0 ? (
                      <React.Fragment>
                        <StudentTransferList
                          left={
                            studentData.filter(
                              (val) => val._id === selectedAssessment?._id
                            )[0] === undefined
                              ? studentsLeft
                              : studentsLeft.filter(
                                  (value) =>
                                    !studentData
                                      .filter(
                                        (val) =>
                                          val._id === selectedAssessment?._id
                                      )[0]
                                      .studentArr.includes(value._id)
                                )
                          }
                          setLeft={setStudentLeft}
                          right={studentsRight}
                          setRight={setStudentsRight}
                        />
                        <Typography variant="body1" style={{ color: 'gray' }}>
                          {studentData.filter(
                            (val) => val._id === selectedAssessment?._id
                          )[0] === undefined
                            ? ''
                            : '*Following students from this batch already have been assigned' +
                              '(' +
                              studentData
                                .filter(
                                  (val) => val._id === selectedAssessment?._id
                                )[0]
                                .studentArr.length.toString() +
                              '/' +
                              studentsLeft.length.toString() +
                              ') : ' +
                              studentsLeft
                                .filter((value) =>
                                  studentData
                                    .filter(
                                      (val) =>
                                        val._id === selectedAssessment?._id
                                    )[0]
                                    .studentArr.includes(value._id)
                                )
                                .map((el) => el.studentName)
                                .join(',')}
                        </Typography>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {selectedBatch !== null && (
                          <Typography variant="body1" style={{ color: 'gray' }}>
                            {studentsLeft.filter(
                              (value) =>
                                !studentData
                                  .filter(
                                    (val) => val._id === selectedAssessment?._id
                                  )[0]
                                  .studentArr.includes(value._id)
                            ).length === 0 &&
                              '*All the students from this batch are already have been assigned'}
                          </Typography>
                        )}
                      </React.Fragment>
                    )}

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          style={{ marginTop: '28px' }}
                        >
                          <CustomFormLabel>Start Date</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <Box maxWidth="70%">
                          <FormControl fullWidth margin="normal">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDateTimePicker
                                disablePast
                                variant="dialog"
                                fullWidth
                                margin="normal"
                                id="date-picker-inline1"
                                label="Start Date"
                                format="dd/MM/yyyy HH:mm"
                                mask="__/__/____ __:__"
                                name="startDate"
                                inputVariant="standard"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e as Date)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}
                              />
                            </MuiPickersUtilsProvider>

                            <FormHelperText>
                              Assignment Start time
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          style={{ marginTop: '28px' }}
                        >
                          <CustomFormLabel>End Date</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <Box maxWidth="70%">
                          <FormControl fullWidth margin="normal">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDateTimePicker
                                disablePast
                                variant="dialog"
                                fullWidth
                                margin="normal"
                                format="dd/MM/yyyy HH:mm"
                                mask="__/__/____ __:__"
                                id="date-picker-inline2"
                                label="End Date"
                                name="endDate"
                                inputVariant="standard"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e as Date)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}
                              />
                            </MuiPickersUtilsProvider>

                            <FormHelperText>Assignment End time</FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Release Solutions</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Delay
                          </InputLabel>
                          <CustomSelect
                            required
                            value={solutionDelay}
                            onChange={(
                              e: React.ChangeEvent<{ value: unknown }>
                            ) => {
                              const val = e.target.value as number;
                              setSolutionDelay(val);
                            }}
                            displayEmpty
                          >
                            <MenuItem value={0}>Immediately</MenuItem>
                            <MenuItem value={720}>After 12 hrs</MenuItem>
                            <MenuItem value={1440}>After 24 hrs</MenuItem>
                            <MenuItem value={2880}>After 48 hrs</MenuItem>
                            <MenuItem value={4320}>After 72 hrs</MenuItem>
                          </CustomSelect>
                          <FormHelperText>
                            Reference from End Time
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Grid container>
                <Box margin="auto" display="flex" marginY="25px">
                  <Box marginRight="15px" className={classes.cancelBtn}>
                    <FormControl margin="none">
                      <Button
                        color="default"
                        size="large"
                        variant="contained"
                        onClick={clearForm}
                      >
                        Clear
                      </Button>
                    </FormControl>
                  </Box>
                  <Box className={classes.createBtn}>
                    <FormControl margin="none">
                      <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        onClick={() => assignAssessmentData()}
                      >
                        Assign
                      </Button>
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(
  withStyles(assessmentStyles)(Assessment_assign)
);

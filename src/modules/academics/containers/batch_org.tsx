import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  IconButton,
  Typography
} from '@material-ui/core';
import { RemoveCircle as RemoveCircleIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {
  fetchOrgCoursesList,
  getOrgStudentsList,
  fetchOrgTutorsList
} from '../../common/api/organization';
import {
  createOrgBatch,
  deleteOrgBatch,
  fetchOrgBatchesList,
  updateOrgBatch
} from '../../common/api/batch';
import { RootState } from '../../../store';
import { Batch } from '../contracts/batch';
import { User, Student, Tutor } from '../../common/contracts/user';
import { Course } from '../contracts/course';
import BatchIcon from '../../../assets/images/batch.png';
import ListIcon from '../../../assets/images/bullet-list.png';
import AddIcon from '../../../assets/images/move-right.png';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import ConfirmationModal from '../../common/components/confirmation_modal';
import { exceptionTracker } from '../../common/helpers';
import { batchStyles } from '../../common/styles';
import OrgBatchListItem from '../components/org_batch_list_item';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Redirect } from 'react-router-dom';
import { StackActionType } from '../../common/enums/stack_action_type';

interface Props extends WithStyles<typeof batchStyles> {
  authUser: User;
}

interface FormData {
  pageError: string;
  tutor: string;
  batchName: string;
  startDate: string;
  endDate: string;
}

const ValidationSchema = yup.object().shape({
  batchName: yup.string().required('Batch number is a required field').min(5),
  startDate: yup.string().required('Start Date is a required field'),
  endDate: yup.string().required('End Date is a required field')
});

const CreateBatchOrg: FunctionComponent<Props> = ({ authUser, classes }) => {
  const { handleSubmit, register, errors, setError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });

  const [batches, setBatches] = useState<Batch[]>([]);
  const [courseIndex, setCourseIndex] = useState(-1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutorIndex, setTutorIndex] = useState(-1);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [batchName, setBatchName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [draftStudentsList, setDraftStudentsList] = useState<Student[]>([]);
  const [checkedStudentsList, setCheckedStudentsList] = useState<Student[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [operation, setOperation] = useState(StackActionType.CREATE);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(-1);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  //const [selected, setSelected] = React.useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const coursesList = await fetchOrgCoursesList();
        setCourses(coursesList);

        const tutorsList = await fetchOrgTutorsList();
        setTutors(tutorsList);

        const batchesList = await fetchOrgBatchesList();
        const studentsList = await getOrgStudentsList();

        // update batches by student mobile number
        batchesList.forEach((batch) => {
          batch.students.forEach((studentId) => {
            studentsList.forEach((student, index) => {
              if (studentId === student._id) {
                batch.students.splice(index, 1, student.mobileNo);
              }
            });
          });
        });

        setBatches(batchesList);
        setFilteredBatches(batchesList);
        setStudentsList(studentsList);
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

  const getIndexOfStudentInChecklist = (student: Student) =>
    checkedStudentsList.findIndex(
      (cStudent) => cStudent.mobileNo === student.mobileNo
    );

  // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.checked) {
  //       setCheckedStudentsList(studentsList);
  //     }
  //     else{
  //       setCheckedStudentsList(studentsList);
  //     }
  // };

  const changeStudentCheckedState = (student: Student) => {
    let filteredCheckedStudents = [...checkedStudentsList];

    const studentIndex = getIndexOfStudentInChecklist(student);

    if (studentIndex >= 0) {
      filteredCheckedStudents = filteredCheckedStudents.filter(
        (student, cIndex) => cIndex !== studentIndex
      );
    } else {
      filteredCheckedStudents.push(student);
    }

    setCheckedStudentsList(filteredCheckedStudents);
  };

  const saveDraftStudents = () => {
    setDraftStudentsList(checkedStudentsList);
    setCheckedStudentsList([]);
  };

  const removeDraftStudent = (index: number) => {
    let clonedStudents = [...draftStudentsList];

    clonedStudents.splice(index, 1);

    setDraftStudentsList(clonedStudents);
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

  const removeBatchItem = async (index: number) => {
    try {
      const selectedBatch = filteredBatches[index];
      await deleteOrgBatch(selectedBatch);
      const clonedFilteredBatches = [...filteredBatches];
      clonedFilteredBatches.splice(index, 1);
      setFilteredBatches(clonedFilteredBatches);
      const clonedBatches = batches.filter(
        (batch) => batch.batchfriendlyname !== selectedBatch.batchfriendlyname
      );
      setOpenConfirmationModal(false);
      setBatches(clonedBatches);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const saveBatch = async () => {
    //e.preventDefault();
    if (tutorIndex < 0) {
      setError('tutor', 'Invalid Data', 'Select Tutor');
      return;
    }
    if (draftStudentsList.length < 1) return;

    if (
      moment(startDate).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
    ) {
      setError(
        'pageError',
        'Invalid Data',
        'Start date should be current or future date'
      );
      return;
    }
    if (moment(endDate).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
      setError(
        'pageError',
        'Invalid Data',
        'End date should be current or future date'
      );
      return;
    }

    if (endDate < startDate) {
      setError(
        'pageError',
        'Invalid Data',
        'End date cannot be less than start date'
      );
      return;
    }
    const studentsNumbers = draftStudentsList.map(
      (student) => student.mobileNo
    );

    const course = courses[courseIndex];
    const boardname = course.board;
    const classname = course.className;
    const subjectname = course.subject;

    const batch: Batch = {
      students: studentsNumbers,
      boardname: boardname,
      classname: classname,
      subjectname: subjectname,
      batchfriendlyname: batchName,
      batchenddate: endDate,
      batchstartdate: startDate,
      batchicon: '',
      tutor: tutors[tutorIndex].mobileNo,
      tutorId: tutors[tutorIndex]
    };

    try {
      await createOrgBatch(batch);
      setBatches([...batches, batch]);
      setFilteredBatches([...filteredBatches, batch]);
      clearBatchDetails();
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setError('pageError', 'Invalid Data', error.response.data.message);
      }
    }
  };

  const editBatch = (batch: Batch, batchIndex: number) => {
    setCurrentBatchIndex(batchIndex);
    setOperation(StackActionType.UPDATE);

    const currentCourseIndex =
      courses &&
      courses.findIndex(
        (course) =>
          course.board === batch.boardname &&
          course.className === batch.classname &&
          course.subject === batch.subjectname
      );
    setCourseIndex(currentCourseIndex);
    setBatchName(batch.batchfriendlyname);
    setStartDate(batch.batchstartdate);
    setEndDate(batch.batchenddate);
    setBatchId(batch._id as string);

    // filter selected students from student list and
    // update in checked students
    const selectedStudents = batch.students
      .map((mobileNo) => studentsList.filter((el) => el.mobileNo === mobileNo))
      .flat();

    // get current tutor index
    const selectedTutor = batch.tutorId?.tutorName;
    const selectedTutorIndex = tutors.findIndex(
      (tutor) => tutor.tutorName === selectedTutor
    );
    setTutorIndex(selectedTutorIndex);
    setCheckedStudentsList(selectedStudents);
    setDraftStudentsList(selectedStudents);
  };

  const updateBatch = async () => {
    if (draftStudentsList.length < 1) return;
    const studentsNumbers = draftStudentsList.map(
      (student) => student.mobileNo
    );

    const course = courses[courseIndex];
    const boardname = course.board;
    const classname = course.className;
    const subjectname = course.subject;

    const batchesList = [...batches];
    const filteredBatchList = [...filteredBatches];
    const previousBatch = batchesList[currentBatchIndex];
    const previousFilteredBatch = filteredBatchList[currentBatchIndex];

    try {
      const updatedBatch = {
        students: studentsNumbers,
        boardname: boardname,
        classname: classname,
        subjectname: subjectname,
        batchfriendlyname: batchName,
        batchenddate: moment(endDate).format('YYYY-MM-DD'),
        batchstartdate: moment(startDate).format('YYYY-MM-DD'),
        batchicon: '',
        tutor: tutors[tutorIndex].mobileNo,
        tutorId: tutors[tutorIndex],
        batchId: batchId,
        _id: batchId
      };

      batchesList[currentBatchIndex] = updatedBatch;
      filteredBatchList[currentBatchIndex] = updatedBatch;

      setBatches(batchesList);
      setFilteredBatches(filteredBatchList);

      await updateOrgBatch(updatedBatch);
      setOperation(StackActionType.CREATE);
      clearBatchDetails();
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        batchesList[currentBatchIndex] = previousBatch;
        filteredBatchList[currentBatchIndex] = previousFilteredBatch;
        setBatches(batchesList);
        setFilteredBatches(filteredBatchList);
      }
    }
  };

  const clearBatchDetails = () => {
    setCourseIndex(-1);
    setTutorIndex(-1);
    setBatchName('');
    setStartDate('');
    setEndDate('');
    setCheckedStudentsList([]);
    setDraftStudentsList([]);
  };
  let showClearBtn = false;
  if (
    courseIndex !== -1 ||
    tutorIndex !== -1 ||
    batchName ||
    startDate ||
    endDate ||
    checkedStudentsList.length ||
    draftStudentsList.length
  ) {
    showClearBtn = true;
  }

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box
          bgcolor="white"
          marginY="20px"
          boxShadow="0px 10px 20px rgba(31, 32, 65, 0.05)"
          borderRadius="4px"
        >
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box
                padding="20px 30px"
                display="flex"
                alignItems="center"
                borderRight="1px solid #C4C4C4"
              >
                <img src={BatchIcon} alt="Create Batch" />

                <Box marginLeft="15px">
                  <Typography component="span" color="primary">
                    <Box component="h3" className={classes.heading}>
                      {operation === StackActionType.CREATE
                        ? 'Create Batch'
                        : 'Edit Batch'}
                    </Box>
                  </Typography>
                </Box>
              </Box>

              <Box padding="0px 40px 10px 40px" borderRight="1px solid #C4C4C4">
                <form>
                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Course</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
                          value={courseIndex}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) => setCourseIndex(e.target.value as number)}
                        >
                          <MenuItem value="-1">Select course</MenuItem>
                          {courses.map((course, index) => (
                            <MenuItem key={index} value={index}>
                              {course.board} - {course.className} -{' '}
                              {course.subject}
                            </MenuItem>
                          ))}
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
                        <CustomInput
                          name="batchName"
                          placeholder="Enter Batch Name"
                          value={batchName}
                          inputProps={{ maxLength: 50 }}
                          inputRef={register}
                          onChange={(e) => setBatchName(e.target.value)}
                        />
                      </FormControl>
                      {errors.batchName && (
                        <FormHelperText error>
                          {errors.batchName.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Batch Start</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomInput
                          name="startDate"
                          type="date"
                          value={moment(startDate).format('YYYY-MM-DD')}
                          onChange={(e) => setStartDate(e.target.value)}
                          inputRef={register}
                          inputProps={
                            operation === StackActionType.CREATE
                              ? {
                                  min: moment().format('YYYY-MM-DD'),
                                  max: moment('9999-12-31').format('YYYY-MM-DD')
                                }
                              : {
                                  readOnly: true
                                }
                          }
                        />
                      </FormControl>
                      {errors.startDate && (
                        <FormHelperText error>
                          {errors.startDate.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Batch End</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomInput
                          name="endDate"
                          type="date"
                          value={moment(endDate).format('YYYY-MM-DD')}
                          onChange={(e) => setEndDate(e.target.value)}
                          inputRef={register}
                          inputProps={
                            operation === StackActionType.CREATE
                              ? {
                                  min: moment().format('YYYY-MM-DD'),
                                  max: moment('9999-12-31').format('YYYY-MM-DD')
                                }
                              : {
                                  readOnly: true
                                }
                          }
                        />
                      </FormControl>
                      {errors.endDate && (
                        <FormHelperText error>
                          {errors.endDate.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Students</CustomFormLabel>
                      </FormControl>
                      {/* <Box padding="10px">
                        <FormControlLabel
                          label="Select All"
                          control={
                            <Checkbox
                               
                              color="secondary"
                              // checked={
                              //   getIndexOfStudentInChecklist() >= 0
                              // }
                              
                              onChange={(e) => handleSelectAllClick(e)}
                            />
                          }
                        />
                      </Box> */}
                      <Box
                        padding="10px 20px"
                        bgcolor="#F9F9F9"
                        borderRadius="3px"
                      >
                        {studentsList.map((item, index) => (
                          <Box key={index}>
                            <FormControlLabel
                              className={classes.checkLabel}
                              key={index}
                              label={item.studentName}
                              control={
                                <Checkbox
                                  color="secondary"
                                  checked={
                                    getIndexOfStudentInChecklist(item) >= 0
                                  }
                                  onChange={() =>
                                    changeStudentCheckedState(item)
                                  }
                                />
                              }
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginTop="50px"
                        className={classes.addIcon}
                      >
                        <IconButton onClick={saveDraftStudents}>
                          <img src={AddIcon} alt="Add Students" />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Students</CustomFormLabel>
                      </FormControl>

                      <Box className={classes.studentChip}>
                        {draftStudentsList.map((item, index) => (
                          <Chip
                            key={index}
                            style={{ margin: '0 10px 10px 0' }}
                            deleteIcon={<RemoveCircleIcon />}
                            label={item.studentName}
                            onDelete={() => removeDraftStudent(index)}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    marginTop="20px"
                  >
                    {showClearBtn && (
                      <Box
                        marginRight="20px"
                        display="inline-block"
                        className={classes.clearBtn}
                      >
                        <Button
                          disableElevation
                          size="large"
                          variant="outlined"
                          onClick={() => {
                            clearBatchDetails();
                            setOperation(StackActionType.CREATE);
                          }}
                        >
                          Clear
                        </Button>
                      </Box>
                    )}

                    {operation === StackActionType.CREATE ? (
                      <Box className={classes.addBtn}>
                        <Button
                          disableElevation
                          color="primary"
                          size="large"
                          variant="contained"
                          onClick={handleSubmit(saveBatch)}
                        >
                          Save
                        </Button>
                      </Box>
                    ) : (
                      <Box className={classes.addBtn}>
                        <Button
                          disableElevation
                          color="primary"
                          size="large"
                          variant="contained"
                          onClick={updateBatch}
                        >
                          Update
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    marginTop="20px"
                  >
                    {errors.pageError && (
                      <FormHelperText error>
                        {errors.pageError.message}
                      </FormHelperText>
                    )}
                  </Box>
                </form>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                padding="33px 30px"
                display="flex"
                alignItems="center"
                borderBottom="1px solid #C4C4C4"
              >
                <img src={ListIcon} alt="Batch List" />

                <Box
                  component="h3"
                  fontWeight="normal"
                  fontSize="14px"
                  color="rgba(0, 0, 0, 0.5)"
                  margin="0 0 0 10px"
                >
                  List of all Batches
                </Box>
              </Box>

              <Box
                padding="20px 30px"
                maxHeight="450px"
                style={{ overflowY: 'auto' }}
              >
                {batches.map((item, index) => (
                  <OrgBatchListItem
                    key={index}
                    item={item}
                    editItem={() => editBatch(item, index)}
                    removeItem={() => {
                      setCurrentBatchIndex(index);
                      setOpenConfirmationModal(true);
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <ConfirmationModal
        header="Delete Batch"
        helperText="Are you sure you want to delete?"
        openModal={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        handleDelete={() => removeBatchItem(currentBatchIndex)}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(
  withStyles(batchStyles)(CreateBatchOrg)
);

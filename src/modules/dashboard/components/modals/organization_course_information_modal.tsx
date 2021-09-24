import React, { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import {
  fetchBoardsList,
  fetchClassesList,
  fetchSubjectsList
} from '../../../common/api/academics';
import { RootState } from '../../../../store';
import { setSubjects } from '../../../academics/store/actions';
import { Subject } from '../../../academics/contracts/subject';
import { Organization } from '../../../common/contracts/user';
import { Course } from '../../../academics/contracts/course';
import SubjectWhite from '../../../../assets/images/course-book-white.png';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import CustomSelect from '../../../common/components/form_elements/custom_select';
import CustomCheckbox from '../../../common/components/form_elements/custom_checkbox';
import Modal from '../../../common/components/modal';
import { NAME_PATTERN } from '../../../common/validations/patterns';
import { exceptionTracker } from '../../../common/helpers';
import { profileModalStyles } from '../../../common/styles';
import CourseTable from '../course_table';
import { BoardClassSubjectsMap } from '../../../academics/contracts/board_class_subjects_map';
import { Standard } from '../../../academics/contracts/standard';
import { Board } from '../../../academics/contracts/board';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface Props extends WithStyles<typeof profileModalStyles> {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Organization) => any;
  subjects: Subject[];
  user: Organization;
}

interface FormData {
  board: string;
  customBoard: string;
  standard: string;
  customStandard: string;
  customSubject: string;
}

const OrganizationCourseModal: FunctionComponent<Props> = ({
  classes,
  openModal,
  onClose,
  saveUser,
  subjects,
  user
}) => {
  const [courses, setCourses] = useState<Course[]>(user.courseDetails);
  const [board, setBoard] = useState('');
  const [customBoard, setCustomBoard] = useState('');
  const [standard, setStandard] = useState(''); // Standard describes Class of the Tutor.
  const [customStandard, setCustomStandard] = useState('');
  const [subjectsList, setSubjectsList] = useState<
    { name: string; checked: boolean }[]
  >([]);
  const [customSubject, setCustomSubject] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [classList, setClassList] = useState<Standard[]>([]);
  const [customCourse, setCustomCourse] = useState(false);

  const [redirectTo, setRedirectTo] = useState('');
  const { errors, setError, clearError } = useForm<FormData>();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const [boardsList, classesList] = await Promise.all([
          fetchBoardsList(),
          fetchClassesList({ boardname: board })
        ]);

        setBoards(boardsList);
        setClassList(classesList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [board]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const setBoardAndFetchClasses = async (board: string) => {
    try {
      setBoard(board);
      if (board.length > 1) {
        const classListResponse = await fetchClassesList({ boardname: board });
        setClassList(classListResponse);
      } else {
        setClassList([]);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const setClassAndFetchSubjects = async (standard: string) => {
    try {
      setStandard(standard);
      if (board.length > 1 && standard.length > 1) {
        const response = await fetchSubjectsList({
          boardname: board,
          classname: standard
        });
        dispatch(setSubjects(response));
        const structuredSubjectsList = response.map((subject) => ({
          name: subject.subjectName,
          checked: false
        }));
        setSubjectsList(structuredSubjectsList);
      } else {
        setSubjectsList([]);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const handleChangeInSubjectCheckbox = (index: number) => {
    const subjects = subjectsList.map((subject, sIndex) => {
      if (index !== sIndex) return subject;

      return { ...subject, checked: !subject.checked };
    });

    setSubjectsList(subjects);
  };

  const addSubjectsToClass = () => {
    if (!customCourse) {
      if (board.length < 1) {
        setError('board', 'Invalid Data', 'Please select board name');
        return;
      } else {
        clearError('board');
      }
    } else {
      if (customBoard.length < 1) {
        setError(
          'customBoard',
          'Invalid Data',
          'Custom board name should not be empty'
        );
        return;
      } else {
        clearError('customBoard');
      }
      if (!NAME_PATTERN.test(customBoard)) {
        setError('customBoard', 'Invalid Data', 'Invalid custom board name');
        return;
      } else {
        clearError('customBoard');
      }
    }

    if (!customCourse) {
      if (standard.length < 1) {
        setError('standard', 'Invalid Data', 'Please select a class');
        return;
      } else {
        clearError('standard');
      }
    } else {
      if (customStandard.length < 1) {
        setError(
          'customStandard',
          'Invalid Data',
          'Custom class name should not be empty'
        );
        return;
      } else {
        clearError('customStandard');
      }
      if (customStandard.length < 3) {
        setError(
          'customStandard',
          'Invalid Data',
          'Custom class should be minimum 3 characters long'
        );
        return;
      } else {
        clearError('customStandard');
      }
    }

    const map: Course[] = [];

    if (!customCourse) {
      subjectsList
        .filter((subject) => subject.checked)
        .filter((subject) => {
          const subjectExists = courses.find(
            (course) =>
              course.board.toLowerCase() === board.toLowerCase() &&
              course.className.toString().toLowerCase() ===
                standard.toString().toLowerCase() &&
              course.subject.toLowerCase() === subject.name.toLowerCase()
          );

          return subjectExists === undefined;
        })
        .forEach((subject) => {
          map.push({ board, className: standard, subject: subject.name });
        });
    } else {
      if (!customSubject.length) {
        setError(
          'customSubject',
          'Invalid Data',
          'Custom subject should not be empty'
        );
        return;
      } else {
        clearError('customSubject');
      }
      if (customSubject.length < 3) {
        setError(
          'customSubject',
          'Invalid Data',
          'Custom subject should be minimum 3 characters long'
        );
        return;
      } else {
        clearError('customSubject');
      }
      const subjectExists = courses.find(
        (course) =>
          course.board.toLowerCase() === customBoard.toLowerCase() &&
          course.className.toString().toLowerCase() ===
            customStandard.toString().toLowerCase() &&
          course.subject.toLowerCase() === customSubject.toLowerCase()
      );

      if (!subjectExists) {
        map.push({
          board: customBoard,
          className: customStandard,
          subject: customSubject
        });
      }
    }

    setCourses([...courses, ...map]);
    setBoard('');
    setCustomBoard('');
    setStandard('');
    setCustomStandard('');
    setSubjectsList([]);
    setCustomSubject('');
  };

  const removeTutorSubjects = (map: BoardClassSubjectsMap) => {
    const mapSubjects = map.subjects.map((subject) => subject.toLowerCase());

    const tutorSubjectsMap = courses.filter(
      (course) =>
        course.board !== map.boardname ||
        course.className.toString().toLowerCase() !==
          map.classname.toString().toLowerCase() ||
        mapSubjects.indexOf(course.subject.toLowerCase()) === -1
    );

    setCourses(tutorSubjectsMap);
  };

  const submitCourseInformation = () => {
    if (courses.length < 1) return;
    saveUser({ ...user, courseDetails: courses });
    onClose();
    setCustomCourse(false);
  };

  const boardClassSubjectsMap: BoardClassSubjectsMap[] = [];

  for (let i = 0; i < courses.length; ++i) {
    const subject = courses[i];

    let boardClassSubjectIndex = boardClassSubjectsMap.findIndex(
      (boardClassSubject) =>
        boardClassSubject.boardname === subject.board &&
        boardClassSubject.classname === subject.className
    );

    if (boardClassSubjectIndex === -1) {
      boardClassSubjectsMap.push({
        boardname: subject.board,
        classname: subject.className,
        subjects: []
      });

      boardClassSubjectIndex = boardClassSubjectsMap.length - 1;
    }

    boardClassSubjectsMap[boardClassSubjectIndex].subjects.push(
      subject.subject
    );
  }

  const SubjectsCheckboxes = () => (
    <FormControl fullWidth margin="normal">
      <Box display="flex" justifyContent="space-between">
        {subjectsList.map((subject, index) => (
          <FormControlLabel
            key={index}
            label={subject.name}
            control={
              <CustomCheckbox
                name={subject.name}
                checked={subject.checked}
                onChange={() => handleChangeInSubjectCheckbox(index)}
              />
            }
          />
        ))}
      </Box>
    </FormControl>
  );

  const handleCourseModalClose = () => {
    setCustomCourse(false);
    onClose();
    setBoard('');
    setCustomBoard('');
    setStandard('');
    setCustomStandard('');
    setSubjectsList([]);
    setCustomSubject('');
    setCourses(user.courseDetails);
  };

  return (
    <Modal
      open={openModal}
      handleClose={handleCourseModalClose}
      header={
        <Box display="flex" alignItems="center">
          <img src={SubjectWhite} alt="Course Details" />

          <Box marginLeft="15px">
            <Typography component="span" color="primary">
              <Box component="h3" className={classes.modalHeading}>
                Course Details
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <Box component="h2" className={classes.helperText}>
        Please enter your course details
      </Box>
      <Box className={classes.customCourse}>
        <FormControlLabel
          control={
            <Switch
              checked={customCourse}
              onChange={(e) => setCustomCourse(e.target.checked)}
              color="secondary"
            />
          }
          label=""
        />
        <Box className={classes.customCourseHelper}>
          If your course is not in our list, Kindly Switch to Cutome Cources
        </Box>
      </Box>
      <Box component="h5" className={classes.instructionText}>
        field marked with <Box className={classes.requiredField}>*</Box> are
        mandatory
      </Box>
      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>
              Board<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <Fragment>
            {!customCourse ? (
              <FormControl fullWidth margin="normal">
                <CustomSelect
                  value={board}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                    setBoardAndFetchClasses(e.target.value as string)
                  }
                  displayEmpty
                >
                  <MenuItem value="">Select a board</MenuItem>
                  {boards.length > 0 &&
                    boards.map((item) => (
                      <MenuItem value={item.boardName} key={item.boardID}>
                        {item.boardName} ({item.boardDescriptions})
                      </MenuItem>
                    ))}
                </CustomSelect>
                {errors.board && (
                  <FormHelperText error>{errors.board.message}</FormHelperText>
                )}
              </FormControl>
            ) : (
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="Enter board name"
                  value={customBoard}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) => setCustomBoard(e.target.value as string)}
                />
                {errors.customBoard && (
                  <FormHelperText error>
                    {errors.customBoard.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </Fragment>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>
              Classes<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <Fragment>
            {!customCourse ? (
              <FormControl fullWidth margin="normal">
                <CustomSelect
                  displayEmpty
                  value={standard}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                    setClassAndFetchSubjects(e.target.value as string)
                  }
                >
                  <MenuItem value="">Select a class</MenuItem>
                  {classList.length > 0 &&
                    classList.map((standard) => (
                      <MenuItem
                        value={standard.className}
                        key={standard.classID}
                      >
                        {standard.className}
                      </MenuItem>
                    ))}
                </CustomSelect>
                {errors.standard && (
                  <FormHelperText error>
                    {errors.standard.message}
                  </FormHelperText>
                )}
              </FormControl>
            ) : (
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="Enter class name"
                  value={customStandard}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) => setCustomStandard(e.target.value as string)}
                />
                {errors.customStandard && (
                  <FormHelperText error>
                    {errors.customStandard.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </Fragment>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>
              Subjects<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          {!customCourse ? (
            <SubjectsCheckboxes />
          ) : (
            <FormControl fullWidth margin="normal">
              <CustomInput
                placeholder="Enter subject name"
                value={customSubject}
                inputProps={{ maxLength: 50 }}
                onChange={(e) => setCustomSubject(e.target.value as string)}
              />
              {errors.customSubject && (
                <FormHelperText error>
                  {errors.customSubject.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
      </Grid>

      <FormControl fullWidth margin="normal">
        <Box
          display="flex"
          justifyContent="flex-end"
          className={classes.addBtn}
        >
          <Button
            disableElevation
            color="primary"
            size="small"
            variant="contained"
            onClick={addSubjectsToClass}
          >
            <AddIcon /> Add
          </Button>
        </Box>
      </FormControl>

      <Grid container>
        <Grid item xs={12}>
          <CourseTable
            boardClassSubjectsMap={boardClassSubjectsMap}
            handleRemoveItem={removeTutorSubjects}
          />
        </Grid>
      </Grid>

      <Box className={classes.submitBtn}>
        <Button
          variant="contained"
          color="primary"
          onClick={submitCourseInformation}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => ({
  subjects: state.academicsReducer.subjects
});

export default connect(mapStateToProps)(
  withStyles(profileModalStyles)(OrganizationCourseModal)
);

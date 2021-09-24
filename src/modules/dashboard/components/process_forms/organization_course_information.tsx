import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch
} from '@material-ui/core';
import {
  Add as AddIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { BoardClassSubjectsMap } from '../../../academics/contracts/board_class_subjects_map';
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
import CourseTable from '../course_table';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomSelect from '../../../common/components/form_elements/custom_select';
import CustomCheckbox from '../../../common/components/form_elements/custom_checkbox';
import { exceptionTracker } from '../../../common/helpers';
import { processPageStyles } from '../../../common/styles';
import { Standard } from '../../../academics/contracts/standard';
import { Board } from '../../../academics/contracts/board';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface Props extends WithStyles<typeof processPageStyles> {
  user: Organization;
  subjects: Subject[];
  submitButtonText: string;
  saveUser: (data: Organization) => any;
}

interface FormData {
  board: string;
  standard: string;
  subjects: string;
}

const OrganizationSubjectInformation: FunctionComponent<Props> = ({
  classes,
  user,
  saveUser,
  subjects,
  submitButtonText
}) => {
  const [courses, setCourses] = useState<Course[]>(user.courseDetails || []);
  const [board, setBoard] = useState('');
  const [standard, setStandard] = useState('');
  const [subjectsList, setSubjectsList] = useState<
    { name: string; checked: boolean }[]
  >([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [classList, setClassList] = useState<Standard[]>([]);
  const [customCourse, setCustomCourse] = useState(true);
  const [redirectTo, setRedirectTo] = useState('');
  const { errors, setError, clearError } = useForm<FormData>();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const [boardsList] = await Promise.all([fetchBoardsList()]);
        setBoards(boardsList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, []);

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
    if (board.length < 1) {
      setError('board', 'Invalid Data', 'Please select board name');
      return;
    } else {
      clearError('board');
    }

    if (standard.length < 1) {
      setError('standard', 'Invalid Data', 'Please select a class');
      return;
    } else {
      clearError('standard');
    }

    const map: Course[] = [];

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

    if (!map.length) {
      setError('subjects', 'Invalid Data', 'Subject should not be empty');
      return;
    } else {
      clearError('subjects');
    }

    setCourses([...courses, ...map]);
    setSubjectsList([]);
  };

  const removeCourses = (map: BoardClassSubjectsMap) => {
    const mapSubjects = map.subjects.map((subject) => subject.toLowerCase());

    const coursesMap = courses.filter(
      (subjectItem) =>
        subjectItem.board !== map.boardname ||
        subjectItem.className.toString().toLowerCase() !==
          map.classname.toString().toLowerCase() ||
        mapSubjects.indexOf(subjectItem.subject.toLowerCase()) === -1
    );

    setCourses(coursesMap);
  };

  const submitCourseInformation = () => {
    if (courses.length < 1) return;
    saveUser({ ...user, courseDetails: courses });
  };

  const boardClassSubjectsMap: BoardClassSubjectsMap[] = [];

  for (let i = 0; i < courses.length; ++i) {
    const subject = courses[i];

    let boardClassSubjectIndex = boardClassSubjectsMap.findIndex(
      (boardClassSubject) =>
        boardClassSubject.boardname.toLowerCase() ===
          subject.board.toLowerCase() &&
        boardClassSubject.classname.toString().toLowerCase() ===
          subject.className.toString().toLowerCase()
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
      {errors.subjects && (
        <FormHelperText error>{errors.subjects.message}</FormHelperText>
      )}
    </FormControl>
  );

  return (
    <div>
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
                  <MenuItem value={standard.className} key={standard.classID}>
                    {standard.className}
                  </MenuItem>
                ))}
            </CustomSelect>
            {errors.standard && (
              <FormHelperText error>{errors.standard.message}</FormHelperText>
            )}
          </FormControl>
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
          <SubjectsCheckboxes />
        </Grid>
      </Grid>

      <FormControl fullWidth margin="normal">
        <Box display="flex" justifyContent="flex-end">
          <Button
            disableElevation
            color="primary"
            size="small"
            variant="contained"
            onClick={addSubjectsToClass}
          >
            <Box component="span" display="flex" marginRight="5px">
              <AddIcon />
            </Box>
            Add
          </Button>
        </Box>
      </FormControl>

      {courses && courses.length > 0 && (
        <Grid container>
          <Grid item xs={12}>
            <CourseTable
              boardClassSubjectsMap={boardClassSubjectsMap}
              handleRemoveItem={removeCourses}
            />
          </Grid>
        </Grid>
      )}

      <Box display="flex" justifyContent="flex-end" marginY="20px">
        <Box className={classes.previousBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setRedirectTo('/profile/org/process/1')}
          >
            <KeyboardArrowLeftIcon /> Previous
          </Button>
        </Box>
        <Box className={classes.nextBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={submitCourseInformation}
          >
            {submitButtonText} <KeyboardArrowRightIcon />
          </Button>
        </Box>
      </Box>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  subjects: state.academicsReducer.subjects
});

export default connect(mapStateToProps)(
  withStyles(processPageStyles)(OrganizationSubjectInformation)
);

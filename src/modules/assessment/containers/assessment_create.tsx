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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AssessmentIcon from '../../../assets/images/assessment-checklist.png';
import { RootState } from '../../../store';
import { getCoursesOfTutor } from '../../common/api/tutor';
import { fetchOrgCoursesList } from '../../common/api/organization';
import 'date-fns';
import {
  addAssessment,
  getAssessmentsForTutor,
  getAssessment,
  patchAssessment
} from '../helper/api';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { assessmentStyles } from '../../common/styles';
import { Course } from '../../academics/contracts/course';
import { Redirect } from 'react-router-dom';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { useSnackbar } from 'notistack';
import { Assessment } from '../contracts/assessment_interface';
import { Section } from '../contracts/section_interface';
import { isOrganization } from '../../common/helpers';

interface Props
  extends RouteComponentProps<{ mode: string; username: string }>,
    WithStyles<typeof assessmentStyles> {
  authUser: User;
}

const Assessment_create: FunctionComponent<Props> = ({
  match,
  location,
  history,
  authUser,
  classes
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const mode = match.params.mode;
  const blankCourse = {
    board: '',
    className: '',
    subject: ''
  } as Course;
  const [disableAll, setDisableAll] = useState<boolean>(mode === 'edit');
  const [assessmentTitles, setAssessmentTitles] = useState<string[]>([]);
  const [course, setCourse] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseData, setSelectedCourseData] = useState<Course>(
    blankCourse
  );
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number>(10);
  const [sections, setSections] = React.useState<Section[]>([
    {
      title: 'Section A',
      questions: [],
      totalMarks: 0,
      duration: 0
    }
  ] as Section[]);
  const [sectionsCount, setSectionsCount] = useState<number | null>(
    sections.length
  );
  const [marks, setMarks] = useState<number>(10);
  const [instructions, setInstructions] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [sourceAssessmentName, setSourceAssessmentName] = useState<
    string | null
  >(null);

  const letterArray: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const courseRef = React.useRef<HTMLElement | null>(null);
  const nameRef = React.useRef<HTMLElement | null>(null);
  const durationRef = React.useRef<HTMLElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const marksRef = React.useRef<HTMLElement | null>(null);
  const instructionRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      sectionsCount !== null &&
      (sectionsCount as number) > 0 &&
      (sectionsCount as number) < 7
    ) {
      modifySections(sectionsCount as number);
    } else {
      console.log(sectionsCount);
      return;
    }
  }, [sectionsCount]);

  useEffect(() => {
    getCourses();
    getAssessmentsTitles(false);
  }, []);

  useEffect(() => {
    if (mode === 'edit') {
      searchAssessment();
    }
  }, []);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const searchAssessment = async () => {
    try {
      const response = (await getAssessment(location.search)) as Assessment;

      const assessmentCourse: Course = {
        board: response.boardname,
        className: response.classname,
        subject: response.subjectname
      };
      setSelectedCourseData(assessmentCourse);
      setSelectedCourse(JSON.stringify(assessmentCourse));
      setMarks(response.totalMarks);
      setName(response.assessmentname);
      setInstructions(response.instructions);
      setDuration(response.duration);
      setSections(response.sections);
      setEditId(response._id);
      setSourceAssessmentName(response.assessmentname.toLowerCase());
      setSectionsCount(response.sections.length);
      setDisableAll(false);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        enqueueSnackbar("Assessment data couldn't be loaded.Try Again", {
          variant: 'error'
        });
      }
    }
  };

  const getAssessmentsTitles = async (privateBool: boolean) => {
    try {
      const response = await getAssessmentsForTutor(privateBool);
      setAssessmentTitles(
        response.map((el: Assessment) => {
          return el.assessmentname.toLowerCase();
        })
      );
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      console.log(err);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const getCourses = async () => {
    try {
      const response = isOrganization(authUser)
        ? await fetchOrgCoursesList()
        : await getCoursesOfTutor();

      setCourse(response);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const createAssessment = async (addQuestionBool: boolean) => {
    if (checkValidation()) {
      console.log('valid to go');
      var assessment = {
        boardname: selectedCourseData.board,
        classname: selectedCourseData.className,
        subjectname: selectedCourseData.subject,
        sections: sections,
        assessmentname: name,
        instructions: instructions,
        duration: duration,
        totalMarks: marks
      };
      if (mode === 'edit') {
        await patchAssessment(
          '?assessmentId=' + editId + '&update=false',
          assessment as Assessment
        );
        if (addQuestionBool) {
          console.log(editId);
          history.push(
            '/profile/assessment_questions?assessmentId=' +
              encodeURI(editId as string)
          );
        } else {
          history.push('/profile/assessment');
        }
      } else {
        const response = await addAssessment(assessment);
        if (addQuestionBool) {
          history.push(
            '/profile/assessment_questions?assessmentId=' +
              encodeURI(response._id as string)
          );
        } else {
          history.push('/profile/assessment');
        }
      }
    } else {
      console.log('not vaild to go');
    }
  };

  const SnackbarAction = (key: number, newSectionCount: number) => {
    console.log(newSectionCount);
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            setSections((prev) => {
              while (prev.length > newSectionCount) {
                prev.pop();
              }
              return prev;
            });
            closeSnackbar(key);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          Dismiss
        </Button>
      </React.Fragment>
    );
  };

  const modifySections = (newCount: number): void => {
    const prevSectionLength: number = sections.length;
    const newSectionLength: number = newCount;
    const sectionsWithQuestions: Section[] = [];
    console.log(newSectionLength);
    if (newSectionLength < prevSectionLength) {
      sections.forEach((section: Section, index) => {
        if (index >= newSectionLength) {
          if (section.questions.length > 0) {
            sectionsWithQuestions.push(section);
          }
        }
      });

      if (sectionsWithQuestions.length > 0) {
        var sectionString: string = '';
        sectionsWithQuestions.forEach((section: Section) => {
          sectionString += section.title + ' ';
        });
        enqueueSnackbar(
          'You are overwriting data for following sections:' +
            sectionString +
            '. Please Confirm.',
          {
            variant: 'info',
            persist: true,
            action: (key) => {
              return SnackbarAction(key as number, newSectionLength);
            }
          }
        );
      } else {
        setSections((prev) => {
          while (prev.length > newSectionLength) {
            prev.pop();
          }
          return prev;
        });
      }
    } else if (newSectionLength > prevSectionLength)
      setSections((prev) => {
        console.log(prev.length);
        while (prev.length < newSectionLength) {
          console.log(prev.length);
          prev.push({
            title: 'Section ' + letterArray[prev.length],
            questions: [],
            totalMarks: 0,
            duration: 0
          } as Section);
        }
        return prev;
      });
  };

  const checkValidation = () => {
    if (
      !(
        selectedCourseData.board.length > 0 &&
        selectedCourseData.className.length > 0 &&
        selectedCourseData.subject.length > 0
      )
    ) {
      enqueueSnackbar('Please select a valid course', { variant: 'error' });
      courseRef.current?.focus();
      return false;
    }
    if (!(name.length >= 5 && name.length <= 50)) {
      enqueueSnackbar('Assessment name should contain 5-50 characters', {
        variant: 'error'
      });
      console.log(nameRef.current);
      nameRef.current?.focus();
      return false;
    }
    if (
      assessmentTitles.includes(name.toLowerCase()) &&
      mode === 'edit' &&
      name.toLowerCase() !== sourceAssessmentName
    ) {
      enqueueSnackbar('An assessment with same name exists', {
        variant: 'error'
      });
      nameRef.current?.focus();
      return false;
    }
    if (!(duration >= 10 && duration <= 300)) {
      enqueueSnackbar('Duration should be between 10-300 mins', {
        variant: 'error'
      });
      durationRef.current?.focus();
      return false;
    }
    if (!(marks >= 10 && marks <= 500)) {
      enqueueSnackbar('Marks should be between 10-500', { variant: 'error' });
      marksRef.current?.focus();
      return false;
    }
    if (!(instructions.length >= 10 && instructions.length <= 1000)) {
      enqueueSnackbar('Instructions should be between 10-1000 characters', {
        variant: 'error'
      });
      instructionRef.current?.focus();
      return false;
    }
    if (!(sections.length > 0 && sections.length <= 6)) {
      enqueueSnackbar('No. of sections should be between 1-6', {
        variant: 'error'
      });
      sectionRef.current?.focus();
      return false;
    }
    return true;
  };
  const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDuration(0);
    setName('');
    setInstructions('');
    setMarks(0);
  };

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
                            {mode === 'edit'
                              ? 'Edit Assessment'
                              : 'Create Assessment'}
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
                          <CustomFormLabel>Course</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          disabled={disableAll}
                        >
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Course
                          </InputLabel>
                          <CustomSelect
                            required
                            value={selectedCourse}
                            inputRef={courseRef}
                            onChange={(
                              e: React.ChangeEvent<{ value: unknown }>
                            ) => {
                              setSelectedCourse(e.target.value as string);
                              if (e.target.value != '') {
                                setSelectedCourseData(
                                  JSON.parse(e.target.value as string) as Course
                                );
                              } else {
                                setSelectedCourseData(blankCourse);
                              }
                            }}
                            displayEmpty
                          >
                            <MenuItem value="">Select Course</MenuItem>
                            {course.map((options, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={JSON.stringify(options)}
                                >
                                  {options.board}
                                  {', '}
                                  {options.className}
                                  {', '}
                                  {options.subject}
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
                          <CustomFormLabel>Name</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Enter Name
                          </InputLabel>
                          <CustomInput
                            placeholder="Assessment Name"
                            value={name}
                            disabled={disableAll}
                            inputRef={nameRef}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <FormHelperText>
                            5-50 characters allowed and should be unique!
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Duration</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <Box maxWidth="50%">
                          <FormControl fullWidth margin="normal">
                            <InputLabel
                              className={classes.subLabel}
                              shrink={true}
                            >
                              Enter Duration(Mins)
                            </InputLabel>
                            <CustomInput
                              placeholder="Enter Duration"
                              required
                              inputRef={durationRef}
                              type="number"
                              disabled={disableAll}
                              value={duration as number}
                              endAdornment={
                                <Tooltip title="Add 10 mins">
                                  <IconButton
                                    onClick={() => {
                                      setDuration(Number(duration) + 10);
                                    }}
                                  >
                                    <AddAlarmIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                              onChange={(
                                e: React.ChangeEvent<{ value: unknown }>
                              ) => setDuration(e.target.value as number)}
                            />
                            <FormHelperText>10-300 mins allowed</FormHelperText>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Marks</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel
                            className={classes.subLabel}
                            shrink={true}
                          >
                            Enter Marks
                          </InputLabel>
                          <CustomInput
                            placeholder="Enter Marks"
                            required
                            disabled={disableAll}
                            inputRef={marksRef}
                            endAdornment={
                              <React.Fragment>
                                <Tooltip title="Add 10 Marks">
                                  <IconButton
                                    onClick={() => {
                                      setMarks(Number(marks) + 10);
                                    }}
                                  >
                                    <NoteAddIcon />
                                  </IconButton>
                                </Tooltip>
                              </React.Fragment>
                            }
                            type="number"
                            value={marks as number}
                            onChange={(
                              e: React.ChangeEvent<{ value: unknown }>
                            ) => setMarks(e.target.value as number)}
                          />
                          <FormHelperText>10-500 marks allowed</FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                          <CustomFormLabel>Instructions</CustomFormLabel>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <FormControl fullWidth margin="normal">
                          <CustomInput
                            placeholder="Enter  Instructions"
                            required
                            multiline
                            disabled={disableAll}
                            rows={4}
                            inputRef={instructionRef}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                          />
                          <FormHelperText>
                            10-1000 characters allowed
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

                  <Box marginRight="15px" className={classes.createBtn}>
                    <FormControl margin="none">
                      <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        onClick={() => createAssessment(false)}
                      >
                        {mode === 'edit' ? 'Update' : 'Create'}
                      </Button>
                    </FormControl>
                  </Box>

                  <Box className={classes.createBtn}>
                    <FormControl margin="none">
                      <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        onClick={() => createAssessment(true)}
                      >
                        {mode === 'edit' ? 'Edit Questions' : 'Add Questions'}
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
  withStyles(assessmentStyles)(Assessment_create)
);

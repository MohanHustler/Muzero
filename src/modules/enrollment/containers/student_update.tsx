import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  FormHelperText,
  MenuItem,
  Typography,
  TextField
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AutocompleteOption } from '../../common/contracts/autocomplete_option';
import { RootState } from '../../../store';
import { updateStudentsOfTutor } from '../../common/api/tutor';
import { Tutor, Student } from '../../common/contracts/user';
import StudentWithMonitor from '../../../assets/images/student-with-monitor.png';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { Redirect } from 'react-router-dom';
import { Standard } from '../../academics/contracts/standard';
import {
  fetchBoardsList,
  fetchClassesList,
  fetchCitySchoolsList,
  fetchCitiesByPinCode
} from '../../common/api/academics';
import { Board } from '../../academics/contracts/board';
import { CurrentStudent } from '../contracts/student';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  EMAIL_PATTERN,
  NAME_PATTERN,
  PHONE_PATTERN,
  PIN_PATTERN
} from '../../common/validations/patterns';
import { addStudentsOfOrganization } from '../../common/api/organization';
import { isTutor } from '../../common/helpers';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      margin: '0',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#212121'
    },
    addBtn: {
      '& button': {
        padding: '12px 24px',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '5px'
      }
    }
  })
);

interface Props
  extends RouteComponentProps<{ mode: string; username: string }> {
  authUser: Tutor;
  currentStudent: CurrentStudent;
}

interface FormData {
  pageError: string;
  serverError: string;
  studentName: string;
  boardName: string;
  className: string;
  mobileNo: string;
  parentMobileNo: string;
  emailId: string;
  schoolName: string;
  cityName: string;
  stateName: string;
  pinCode: string;
}

const ValidationSchema = yup.object().shape({
  studentName: yup
    .string()
    .required('Student number is a required field')
    .min(5)
});

const StudentUpdate: FunctionComponent<Props> = ({
  match,
  authUser,
  currentStudent
}) => {
  const disableAll = match.params.mode === 'view' ? true : false;
  const { errors, setError, clearError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState('');
  const [name, setName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [board, setBoard] = useState('');
  const [standard, setStandard] = useState(''); // Standard describes Class of the Tutor.
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [parentMobileNo, setParentMobileNo] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [school, setSchool] = useState<AutocompleteOption | null>({
    title: currentStudent.schoolname,
    value: currentStudent.schoolname
  });
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Standard[]>([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);

  const styles = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const [boardsList] = await Promise.all([fetchBoardsList()]);

        setBoards(boardsList);

        const getCityArr = await fetchCitiesByPinCode({
          pinCode: currentStudent.pincode
        });

        const schoolsListResponse = await fetchCitySchoolsList({
          cityName: getCityArr[0].cityName
        });

        const structuredSchoolsList = schoolsListResponse.map((school) => ({
          title: `${school.schoolName} (${school.schoolAddress})`,
          value: school.schoolName
        }));

        setSchoolsList([
          ...structuredSchoolsList,
          { title: 'Other', value: 'Other' }
        ]);

        setName(currentStudent.name);
        setEnrollmentId(currentStudent.enrollmentId);
        setPhone(currentStudent.mobileNo);
        setEmail(currentStudent.email);
        setPinCode(currentStudent.pincode);
        setCityName(currentStudent.city);
        setStateName(currentStudent.state);
        setBoardAndFetchClasses(currentStudent.board);
        setStandard(currentStudent.classname);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
    // eslint-disable-next-line
  }, []);

  if (redirectTo && redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const setBoardAndFetchClasses = async (board: string) => {
    try {
      setBoard(board);
      if (board.length > 0) {
        const classListResponse = await fetchClassesList({ boardname: board });
        setClasses(classListResponse);
      } else {
        setClasses([]);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  //PIN Code based city and state selection
  const onPinCodeChange = async (pin: string) => {
    setPinCode(pin);
    if (PIN_PATTERN.test(pin)) {
      try {
        const getCityArr = await fetchCitiesByPinCode({ pinCode: pin });
        setCityName(getCityArr[0].cityName);
        setStateName(getCityArr[0].stateName);

        const schoolsListResponse = await fetchCitySchoolsList({
          cityName: getCityArr[0].cityName
        });

        const structuredSchoolsList = schoolsListResponse.map((school) => ({
          title: `${school.schoolName} (${school.schoolAddress})`,
          value: school.schoolName
        }));

        setSchool(null);
        setSchoolsList([
          ...structuredSchoolsList,
          { title: 'Other', value: 'Other' }
        ]);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        } else {
          enqueueSnackbar('Service not available in this area', {
            variant: 'error'
          });
          setPinCode('');
          setCityName('');
          setStateName('');
          setSchoolsList([]);
        }
      }
    } else {
      setCityName('');
      setStateName('');
      setSchoolsList([]);
    }
  };

  const saveStudents = async () => {
    if (!name.length) {
      setError(
        'studentName',
        'Invalid Data',
        'Student name cannot not be empty'
      );
      return;
    } else {
      clearError('studentName');
    }
    if (name.length < 5) {
      setError(
        'studentName',
        'Invalid Data',
        'Student Name cannot be less than 5 character'
      );
      return;
    } else {
      clearError('studentName');
    }

    if (!NAME_PATTERN.test(name)) {
      setError('studentName', 'Invalid Data', 'Invalid student name');
      return;
    } else {
      clearError('studentName');
    }

    if (!phone.length) {
      setError('mobileNo', 'Invalid Data', 'Mobile number cannot be empty');
      return;
    } else {
      clearError('mobileNo');
    }
    if (!phone.match(PHONE_PATTERN)) {
      setError('mobileNo', 'Invalid Data', 'Invalid Mobile number');
      return;
    } else {
      clearError('mobileNo');
    }

    if (!email.length) {
      setError('emailId', 'Invalid Data', 'Email cannot be empty');
      return;
    } else {
      clearError('emailId');
    }
    if (!EMAIL_PATTERN.test(email.toLowerCase())) {
      setError('emailId', 'Invalid Data', 'Invalid Email');
      return;
    } else {
      clearError('emailId');
    }

    if (parentMobileNo.length > 0 && !parentMobileNo.match(PHONE_PATTERN)) {
      setError(
        'parentMobileNo',
        'Invalid Data',
        'Invalid parent mobile number'
      );
      return;
    } else {
      clearError('parentMobileNo');
    }

    if (parentMobileNo === phone) {
      setError(
        'parentMobileNo',
        'Invalid Data',
        'Parent Mobile number cannot be same as student mobile number'
      );
      return;
    } else {
      clearError('parentMobileNo');
    }

    if (!pinCode.length) {
      setError('pinCode', 'Invalid Data', 'Pin Code cannot be empty');
      return;
    } else {
      clearError('pinCode');
    }
    if (!PIN_PATTERN.test(pinCode)) {
      setError('pinCode', 'Invalid Data', 'Invalid pin code');
      return;
    } else {
      clearError('pinCode');
    }

    if (!cityName.length) {
      setError('cityName', 'Invalid Data', 'City cannot be empty');
      return;
    } else {
      clearError('cityName');
    }

    if (!stateName.length) {
      setError('stateName', 'Invalid Data', 'State cannot be empty');
      return;
    } else {
      clearError('stateName');
    }

    if (school == null) {
      setError('schoolName', 'Invalid Data', 'School cannot be empty');
      return;
    } else {
      clearError('schoolName');
    }

    if (!board.length) {
      setError('boardName', 'Invalid Data', 'Board cannot be empty');
      return;
    } else {
      clearError('boardName');
    }

    if (!standard.length) {
      setError('className', 'Invalid Data', 'Class cannot be empty');
      return;
    } else {
      clearError('className');
    }

    const student: Student = {
      boardName: board,
      className: standard,
      mobileNo: phone,
      emailId: email,
      parentMobileNo: parentMobileNo,
      schoolName: school?.value ? school.value : '',
      studentName: name,
      enrollmentId: enrollmentId !== '' ? enrollmentId : undefined,
      pinCode: pinCode ? pinCode : '',
      cityName: cityName ? cityName : '',
      stateName: stateName ? stateName : ''
    };

    clearError('serverError');
    try {
      if (isTutor(authUser)) {
        await updateStudentsOfTutor([student]);
      } else {
        await addStudentsOfOrganization([student]);
        setName('');
        setBoard('');
        setStandard('');
        setPhone('');
        setParentMobileNo('');
        setEmail('');
      }
      setRedirectTo(`/profile/students`);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setError('serverError', 'Invalid Data', error.response?.data.message);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Box
          bgcolor="white"
          marginY="20px"
          boxShadow="0px 10px 20px rgba(31, 32, 65, 0.05)"
          borderRadius="4px"
        >
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box
                padding="20px 30px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={StudentWithMonitor} alt="Enroll Students" />

                <Box marginLeft="15px">
                  <Typography component="span" color="secondary">
                    <Box component="h3" className={styles.heading}>
                      {disableAll ? 'View Students' : 'Edit Students'}
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Grid container justify="center">
            <Grid item xs={12} md={8}>
              <Box padding="20px">
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Student Name</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        placeholder="Enter Full Name"
                        inputProps={{ maxLength: 50 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.studentName && (
                      <FormHelperText error>
                        {errors.studentName.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Enrollment ID</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        placeholder="Enter enrollment id"
                        inputProps={{ maxLength: 50 }}
                        value={enrollmentId}
                        onChange={(e) => setEnrollmentId(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Student Mobile Number</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                        placeholder="Enter Student Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.mobileNo && (
                      <FormHelperText error>
                        {errors.mobileNo.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Parent Mobile Number</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                        placeholder="Enter Parent Mobile Number"
                        value={parentMobileNo}
                        onChange={(e) => setParentMobileNo(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.parentMobileNo && (
                      <FormHelperText error>
                        {errors.parentMobileNo.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Email Address</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.emailId && (
                      <FormHelperText error>
                        {errors.emailId.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>PIN Code</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomInput
                        placeholder="PIN Code"
                        value={pinCode}
                        inputProps={{ maxLength: 6 }}
                        onChange={(e) => onPinCodeChange(e.target.value)}
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.pinCode && (
                      <FormHelperText error>
                        {errors.pinCode.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>City</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <Box>{cityName}</Box>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>State</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <Box>{stateName}</Box>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Schools / Others</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
                        options={schoolsList}
                        getOptionLabel={(option: AutocompleteOption) =>
                          option.title
                        }
                        autoComplete
                        includeInputInList
                        value={school}
                        onChange={(e, node) => setSchool(node)}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Select School" />
                        )}
                      />
                    </FormControl>
                    {/* {school?.value === 'Other' && <TypeOther />} */}
                    {errors.schoolName && (
                      <FormHelperText error>
                        {errors.schoolName.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Board</CustomFormLabel>
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
                        readOnly={disableAll}
                      >
                        <MenuItem value="">Select a board</MenuItem>
                        {boards.length > 0 &&
                          boards.map((item) => (
                            <MenuItem value={item.boardName} key={item.boardID}>
                              {item.boardName} ({item.boardDescriptions})
                            </MenuItem>
                          ))}
                      </CustomSelect>
                    </FormControl>
                    {errors.boardName && (
                      <FormHelperText error>
                        {errors.boardName.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                      <CustomFormLabel>Class</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <CustomSelect
                        value={standard}
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                          setStandard(e.target.value as string)
                        }
                        displayEmpty
                        readOnly={disableAll}
                      >
                        <MenuItem value="">Select a class</MenuItem>
                        {classes.length > 0 &&
                          classes.map((standard) => (
                            <MenuItem
                              value={standard.className}
                              key={standard.classID}
                            >
                              {standard.className}
                            </MenuItem>
                          ))}
                      </CustomSelect>
                    </FormControl>
                    {errors.className && (
                      <FormHelperText error>
                        {errors.className.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Box>
              {!disableAll && (
                <Box display="flex" justifyContent="flex-end" marginY="30px">
                  <Box className={styles.addBtn}>
                    <Button
                      disableElevation
                      color="primary"
                      size="large"
                      variant="contained"
                      onClick={saveStudents}
                    >
                      Save
                    </Button>
                    {errors.serverError && (
                      <FormHelperText error>
                        {errors.serverError.message}
                      </FormHelperText>
                    )}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as Tutor,
  currentStudent: state.studentTutorReducer.student
});

export default connect(mapStateToProps)(StudentUpdate);

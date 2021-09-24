import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import {
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  FormHelperText,
  MenuItem,
  Typography,
  TextField,
  Button as MuButton
} from '@material-ui/core';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RemoveCircleOutline as RemoveCircleIcon
} from '@material-ui/icons';
import {
  makeStyles,
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import { AutocompleteOption } from '../../common/contracts/autocomplete_option';
import { RootState } from '../../../store';
import { updateStudentsOfTutor } from '../../common/api/tutor';
import { Tutor, Student } from '../../common/contracts/user';
import StudentWithMonitor from '../../../assets/images/student-with-monitor.png';
import DownloadIcon from '../../../assets/images/download-icon.png';
import UploadIcon from '../../../assets/images/upload-icon.png';
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
import { createStudentStyles } from '../../common/styles';
import * as XLSX from 'xlsx';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    studentsList: {
      margin: '0',
      fontWeight: 'normal',
      color: '#151522'
    },
    removeIcon: {
      color: 'rgba(0, 0, 0, 0.5)'
    }
  })
);

interface TutorStudentRowProps {
  item: Student;
  handleRemoveItem: () => any;
}

const TutorStudentRow: FunctionComponent<TutorStudentRowProps> = ({
  item,
  handleRemoveItem
}) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="20px 30px"
      borderBottom="1px solid rgba(224, 224, 224, 0.5)"
    >
      <Box marginRight="15px">
        <Typography component="span">
          <Box component="h4" className={classes.studentsList}>
            {item.studentName} ({item.mobileNo})
          </Box>
        </Typography>
      </Box>

      <IconButton size="small" onClick={handleRemoveItem}>
        <RemoveCircleIcon className={classes.removeIcon} />
      </IconButton>
    </Box>
  );
};

interface Props extends WithStyles<typeof createStudentStyles> {
  authUser: Tutor;
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

const StudentsEnrollment: FunctionComponent<Props> = ({
  authUser,
  classes
}) => {
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
  const [school, setSchool] = useState<AutocompleteOption | null>();
  const [students, setStudents] = useState<Student[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [classList, setClassList] = useState<Standard[]>([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);

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

  if (redirectTo && redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  // const TypeOther = () => (
  //   <FormControl fullWidth margin="normal">
  //     <Input placeholder="Others" />
  //   </FormControl>
  // );

  const setBoardAndFetchClasses = async (board: string) => {
    try {
      setBoard(board);
      if (board.length > 0) {
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

  const getCityStateName = async (pin: string) => {
    try {
      const getCityArr = await fetchCitiesByPinCode({ pinCode: pin });
      return getCityArr;
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        enqueueSnackbar('Service not available in this area', {
          variant: 'error'
        });
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

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError('serverError');

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
        'Student name cannot be less than 5 character'
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
      setError('mobileNo', 'Invalid Data', 'Mobile number cannot not be empty');
      return;
    } else {
      clearError('mobileNo');
    }

    if (!phone.match(PHONE_PATTERN)) {
      setError('mobileNo', 'Invalid Data', 'Invalid mobile number');
      return;
    } else {
      clearError('mobileNo');
    }

    if (!email.length) {
      setError('emailId', 'Invalid Data', 'Email cannot not be empty');
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

    if (parentMobileNo && !parentMobileNo.match(PHONE_PATTERN)) {
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

    const filteredStudents = students.filter(function (el) {
      return el.mobileNo === phone;
    });

    if (filteredStudents.length > 0) {
      setError('pageError', 'Invalid Data', 'Mobile Number already used');
      return;
    } else {
      clearError('pageError');
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

    setStudents([...students, student]);

    setName('');
    setEnrollmentId('');
    setPhone('');
    setParentMobileNo('');
    setEmail('');
    setPinCode('');
    setCityName('');
    setStateName('');
    setSchool(null);
    setBoard('');
    setStandard('');
  };

  const removeStudent = async (index: number) => {
    const studentsDraft = students.filter(
      (student, sIndex) => sIndex !== index
    );

    setStudents(studentsDraft);
  };

  const saveStudents = async () => {
    clearError('serverError');
    try {
      if (isTutor(authUser)) {
        await updateStudentsOfTutor(students);
      } else {
        await addStudentsOfOrganization(students);
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

  const isUniqueMobile = (mobile: string[]) => {
    let mobileNo,
      unique = true;
    mobile.sort().sort((a, b) => {
      if (a === b) {
        mobileNo = a;
        unique = false;
      }
      return 0;
    });
    return { mobileNo: mobileNo, isUnique: unique };
  };

  const validateStudents = (structuredStudents: Student[]) => {
    let uploadError = '';

    const studentMobile = isUniqueMobile(
      structuredStudents.map((student) => student.mobileNo)
    );
    const parentMobile = isUniqueMobile(
      structuredStudents.map((student) => student.parentMobileNo)
    );
    const uniqueMobile = isUniqueMobile(
      structuredStudents
        .map((student) => {
          return [student.mobileNo, student.parentMobileNo];
        })
        .flat()
    );
    if (!studentMobile.isUnique) {
      uploadError = `Student mobile number "${studentMobile.mobileNo}" must be unique`;
    } else if (!parentMobile.isUnique) {
      uploadError = `Parent mobile number "${parentMobile.mobileNo}" must be unique`;
    } else if (!uniqueMobile.isUnique) {
      uploadError = `Parent mobile number "${uniqueMobile.mobileNo}" cannot be same as student mobile number`;
    }

    structuredStudents &&
      structuredStudents.every((student) => {
        if (!uploadError) {
          if (!student.studentName) {
            uploadError = `Student name should not be empty`;
            return false;
          }
          if (student.studentName == null || student.studentName.length < 5) {
            uploadError = `Student name "${student.studentName}" cannot be less than 5 character`;
            return false;
          }
          if (!NAME_PATTERN.test(student.studentName)) {
            uploadError = `Invalid student name "${student.studentName}"`;
            return false;
          }

          if (!student.mobileNo) {
            uploadError = `Student mobile number should not be empty`;
            return false;
          }
          if (
            student.mobileNo == null ||
            !student.mobileNo.toString().match(PHONE_PATTERN)
          ) {
            uploadError = `Student Mobile number "${student.mobileNo}" must be 10 digit number`;
            return false;
          }
          if (
            student.parentMobileNo &&
            !student.parentMobileNo.toString().match(PHONE_PATTERN)
          ) {
            uploadError = `Parent mobile number "${student.parentMobileNo}" must be 10 digit number`;
            return false;
          }
          if (student.parentMobileNo === student.mobileNo) {
            uploadError = `Parent mobile number "${student.parentMobileNo}" cannot be same as student mobile number`;
            return false;
          }
          if (!student.emailId) {
            uploadError = 'Email cannot be empty';
            return false;
          }

          if (!EMAIL_PATTERN.test(student.emailId.toLowerCase())) {
            uploadError = 'Invalid Email';
            return false;
          }

          if (!student.pinCode) {
            uploadError = 'Pin Code cannot be empty';
            return false;
          }
          if (!PIN_PATTERN.test(student.pinCode)) {
            uploadError = 'Invalid pin code';
            return false;
          }

          if (!student.cityName) {
            uploadError = 'City cannot be empty';
            return false;
          }

          if (!student.stateName) {
            uploadError = 'State cannot be empty';
            return false;
          }

          if (!student.schoolName) {
            uploadError = 'School cannot be empty';
            return false;
          }

          if (!student.boardName) {
            uploadError = 'Board cannot be empty';
            return false;
          }

          if (!student.className) {
            uploadError = 'Class cannot be empty';
            return false;
          }

          const filteredStudents = students.filter(function (el) {
            return el.mobileNo === student.mobileNo;
          });

          if (filteredStudents.length > 0) {
            uploadError = `Mobile number "${student.mobileNo}" already used`;
            return false;
          }
        }
        return true;
      });

    if (!uploadError) {
      setStudents([...students, ...structuredStudents]);
    } else {
      enqueueSnackbar(uploadError, {
        variant: 'error'
      });
    }
  };

  const readExcel = (file: File | null) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target ? e.target.result : '';
          const wb = XLSX.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          /* Convert array to json*/
          const jsonData = XLSX.utils.sheet_to_json(ws);
          resolve(jsonData);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      }
    });
    promise.then(async (studentsArr: any) => {
      const structuredStudents: Student[] = await Promise.all(
        studentsArr &&
          studentsArr.map(async (student: any) => {
            let citiesArr = await getCityStateName(student.Pin_Code);

            return {
              boardName: student.Board,
              className: student.Class,
              mobileNo: student.Student_Mobile,
              parentMobileNo: student.Parent_Mobile,
              emailId: student.Email,
              schoolName: student.Schools,
              studentName: student.Student_Name,
              pinCode: student.Pin_Code,
              cityName:
                citiesArr && citiesArr[0].cityName ? citiesArr[0].cityName : '',
              stateName:
                citiesArr && citiesArr[0].stateName
                  ? citiesArr[0].stateName
                  : '',
              enrollmentId: student.Enrollment_Id
            };
          })
      );
      validateStudents(structuredStudents);
    });
  };

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
          <Box borderBottom="1px solid rgba(224, 224, 224, 0.5)">
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box padding="20px 30px" display="flex" alignItems="center">
                  <img src={StudentWithMonitor} alt="Enroll Students" />

                  <Box marginLeft="15px">
                    <Typography component="span" color="secondary">
                      <Box component="h3" className={classes.heading}>
                        Enroll Students
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  padding="20px 30px"
                >
                  <Box marginRight="10px">
                    <div>
                      <input
                        accept=".xls, .xlsx"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        type="file"
                        onChange={(e) => {
                          readExcel(e.target.files && e.target.files[0]);
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor="contained-button-file">
                        <MuButton
                          component="span"
                          className={classes.helperText}
                        >
                          Bulk Upload
                          <Box
                            display="flex"
                            alignItems="center"
                            marginLeft="15px"
                          >
                            <img src={UploadIcon} alt="Upload Students" />
                          </Box>
                        </MuButton>
                      </label>
                    </div>
                  </Box>

                  <Box>
                    <MuButton>
                      <Link
                        className={classes.helperText}
                        style={{ textDecoration: 'none' }}
                        to="/files/students.xlsx"
                        target="_blank"
                        download
                      >
                        Download Template
                      </Link>
                      <Box display="flex" alignItems="center" marginLeft="15px">
                        <img src={DownloadIcon} alt="Download Students" />
                      </Box>
                    </MuButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid container>
            <Grid item xs={12} md={8}>
              <Box padding="20px 0">
                <form onSubmit={addStudent}>
                  <Grid container className={classes.paddClass}>
                    <Grid item xs={12} md={4}></Grid>

                    <Grid item xs={12} md={8}>
                      <Box component="h5" className={classes.subHeading}>
                        Enroll Students
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                      {errors.studentName && (
                        <FormHelperText error>
                          {errors.studentName.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                      {errors.mobileNo && (
                        <FormHelperText error>
                          {errors.mobileNo.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                      {errors.parentMobileNo && (
                        <FormHelperText error>
                          {errors.parentMobileNo.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                      {errors.emailId && (
                        <FormHelperText error>
                          {errors.emailId.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                        />
                      </FormControl>
                      {errors.pinCode && (
                        <FormHelperText error>
                          {errors.pinCode.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container className={classes.paddClass}>
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
                  <Grid container className={classes.paddClass}>
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

                  <Grid container className={classes.paddClass}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Schools / Others</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <Autocomplete
                          key={school === null ? 'true' : 'false'}
                          options={schoolsList}
                          getOptionLabel={(option: AutocompleteOption) =>
                            option.title
                          }
                          autoComplete
                          includeInputInList
                          value={school}
                          onChange={(e, node) => setSchool(node)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select School"
                            />
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

                  <Grid container className={classes.paddClass}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Board</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
                          value={board}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) =>
                            setBoardAndFetchClasses(e.target.value as string)
                          }
                          displayEmpty
                        >
                          <MenuItem value="">Select a board</MenuItem>
                          {boards.length > 0 &&
                            boards.map((item) => (
                              <MenuItem
                                value={item.boardName}
                                key={item.boardID}
                              >
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

                  <Grid container className={classes.paddClass}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Class</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomSelect
                          value={standard}
                          onChange={(
                            e: React.ChangeEvent<{ value: unknown }>
                          ) => setStandard(e.target.value as string)}
                          displayEmpty
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
                      </FormControl>
                      {errors.className && (
                        <FormHelperText error>
                          {errors.className.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    borderTop="1px solid rgba(224, 224, 224, 0.5)"
                    marginTop="20px"
                    padding="20px 30px"
                  >
                    <FormControl margin="normal">
                      <Box className={classes.addBtn}>
                        <Button
                          disableElevation
                          color="primary"
                          size="large"
                          variant="contained"
                          type="submit"
                        >
                          <AddIcon /> Add
                        </Button>
                      </Box>
                    </FormControl>
                  </Box>
                  {errors.pageError && (
                    <FormHelperText error>
                      {errors.pageError.message}
                    </FormHelperText>
                  )}
                </form>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                flexDirection="column"
                padding="20px 0"
                height="100%"
                borderLeft="1px solid rgba(224, 224, 224, 0.5)"
              >
                <Box display="flex" alignItems="center" marginLeft="30px">
                  <CheckCircleIcon color="primary" fontSize="large" />

                  <Box marginLeft="15px">
                    <Typography component="span" color="secondary">
                      <Box component="h5" className={classes.subHeading}>
                        Enrolled Students
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                <Box flexGrow="1">
                  {students.map((item, index) => (
                    <TutorStudentRow
                      key={index}
                      item={item}
                      handleRemoveItem={() => removeStudent(index)}
                    />
                  ))}
                </Box>

                {students && students.length > 0 && (
                  <Box
                    borderTop="1px solid rgba(224, 224, 224, 0.5)"
                    padding="30px 0"
                  >
                    <Box display="flex" justifyContent="center">
                      <Box marginRight="20px" className={classes.clearBtn}>
                        <Button
                          disableElevation
                          size="large"
                          variant="outlined"
                          onClick={() => {
                            setStudents([]);
                            clearError('serverError');
                          }}
                        >
                          Clear
                        </Button>
                      </Box>

                      <Box>
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
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as Tutor
});

export default connect(mapStateToProps)(
  withStyles(createStudentStyles)(StudentsEnrollment)
);

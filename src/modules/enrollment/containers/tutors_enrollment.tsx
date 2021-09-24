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
import { addTutorsForOrganization } from '../../common/api/organization';
import { Tutor } from '../../common/contracts/user';
import StudentWithMonitor from '../../../assets/images/student-with-monitor.png';
import DownloadIcon from '../../../assets/images/download-icon.png';
import UploadIcon from '../../../assets/images/upload-icon.png';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import CustomSelect from '../../common/components/form_elements/custom_select';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { createStudentStyles } from '../../common/styles';
import { Redirect } from 'react-router-dom';
import {
  fetchQualificationsList,
  fetchCitySchoolsList,
  fetchCitiesByPinCode
} from '../../common/api/academics';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  NAME_PATTERN,
  PHONE_PATTERN,
  EMAIL_PATTERN,
  PIN_PATTERN
} from '../../common/validations/patterns';
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

interface TutorRowProps {
  item: Tutor;
  handleRemoveItem: () => any;
}

const TutorRow: FunctionComponent<TutorRowProps> = ({
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
            {item.tutorName} ({item.mobileNo})
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
  authUser: Partial<Tutor>;
}

interface FormData {
  pageError: string;
  serverError: string;
  tutorName: string;
  enrollmentId: string;
  mobileNo: string;
  emailId: string;
  qualifications: string;
  schoolName: string;
  cityName: string;
  stateName: string;
  pinCode: string;
}

const ValidationSchema = yup.object().shape({
  tutorName: yup.string().required('Tutor number is a required field').min(5)
});

const TutorsEnrollment: FunctionComponent<Props> = ({ authUser, classes }) => {
  const { errors, setError, clearError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState('');
  const [name, setName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [
    qualification,
    setQualification
  ] = useState<AutocompleteOption | null>();
  const [qualificationsList, setQualificationsList] = useState<
    AutocompleteOption[]
  >([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);
  const [school, setSchool] = useState<AutocompleteOption | null>();

  useEffect(() => {
    (async () => {
      try {
        const qualificationsListResponse = await fetchQualificationsList();

        const structuredQualificationsList = qualificationsListResponse.map(
          (qualification) => ({
            title: `${qualification.degree} (${qualification.subjectName})`,
            value: qualification.degree
          })
        );

        setQualificationsList([
          ...structuredQualificationsList,
          { title: 'Other', value: 'Other' }
        ]);
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

  const addTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.length) {
      setError('tutorName', 'Invalid Data', 'Tutor name cannot be empty');
      return;
    } else {
      clearError('tutorName');
    }
    if (name.length < 5) {
      setError(
        'tutorName',
        'Invalid Data',
        'Tutor Name cannot be less than 5 character'
      );
      return;
    } else {
      clearError('tutorName');
    }

    if (!NAME_PATTERN.test(name)) {
      setError('tutorName', 'Invalid Data', 'Invalid tutor name');
      return;
    } else {
      clearError('tutorName');
    }

    if (!phone.length) {
      setError('mobileNo', 'Invalid Data', 'Mobile number cannot be empty');
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
      setError('emailId', 'Invalid Data', 'Email id cannot be empty');
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

    if (qualification == null) {
      setError(
        'qualifications',
        'Invalid Data',
        'qualification cannot be empty'
      );
      return;
    } else {
      clearError('qualifications');
    }
    if (qualification.value.length < 3) {
      setError(
        'qualifications',
        'Invalid Data',
        'qualification must be minimum 3 characters long'
      );
      return;
    } else {
      clearError('qualifications');
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
      setError('cityName', 'Invalid Data', 'City name cannot be empty');
      return;
    } else {
      clearError('cityName');
    }

    if (!stateName.length) {
      setError('stateName', 'Invalid Data', 'State name cannot be empty');
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

    const filteredTutors = tutors.filter(function (el) {
      return el.mobileNo === phone;
    });

    if (filteredTutors.length > 0) {
      setError('pageError', 'Invalid Data', 'Mobile Number already used');
      return;
    } else {
      clearError('pageError');
    }

    const tutor: Tutor = {
      mobileNo: phone,
      emailId: email,
      qualifications: qualification?.value ? [qualification.value] : [],
      schoolName: school?.value ? school.value : '',
      tutorName: name,
      enrollmentId: enrollmentId !== '' ? enrollmentId : undefined,
      pinCode: pinCode,
      cityName: cityName,
      stateName: stateName,
      courseDetails: []
    };

    setTutors([...tutors, tutor]);

    setName('');
    setEnrollmentId('');
    setPhone('');
    setEmail('');
    setQualification(null);
    setPinCode('');
    setCityName('');
    setStateName('');
    setSchool(null);
  };

  const removeTutor = async (index: number) => {
    const tutorsDraft = tutors.filter((tutor, sIndex) => sIndex !== index);

    setTutors(tutorsDraft);
  };

  const saveTutors = async () => {
    clearError('serverError');
    try {
      await addTutorsForOrganization(tutors);
      setRedirectTo(`/profile/tutors`);
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

  const validateTutors = (structuredTutors: Tutor[]) => {
    let uploadError = '';

    const tutorMobile = isUniqueMobile(
      structuredTutors.map((tutor) => tutor.mobileNo)
    );
    if (!tutorMobile.isUnique) {
      uploadError = `Tutor mobile number "${tutorMobile.mobileNo}" must be unique`;
    }

    structuredTutors &&
      structuredTutors.every((tutor) => {
        if (!uploadError) {
          if (!tutor.tutorName) {
            uploadError = `Tutor name cannot be empty`;
            return false;
          }
          if (tutor.tutorName.length < 5) {
            uploadError = `Tutor name "${tutor.tutorName}" cannot be less than 5 character`;
            return false;
          }

          if (!NAME_PATTERN.test(tutor.tutorName)) {
            uploadError = `Invalid tutor name "${tutor.tutorName}"`;
            return false;
          }

          if (!tutor.mobileNo) {
            uploadError = `Mobile number cannot be empty`;
            return false;
          }
          if (!tutor.mobileNo.toString().match(PHONE_PATTERN)) {
            uploadError = `Invalid mobile number "${tutor.mobileNo}"`;
            return false;
          }

          if (!tutor.emailId) {
            uploadError = 'Email id cannot be empty';
            return false;
          }
          if (!EMAIL_PATTERN.test(tutor.emailId.toLowerCase())) {
            uploadError = 'Invalid Email';
            return false;
          }

          if (tutor.qualifications == null) {
            uploadError = 'Qualification cannot be empty';
            return false;
          }
          if (tutor.qualifications.length < 3) {
            uploadError = 'Qualification must be minimum 3 characters long';
            return false;
          }

          if (!tutor.pinCode) {
            uploadError = 'Pin Code cannot be empty';
            return false;
          }

          if (!PIN_PATTERN.test(tutor.pinCode.toString())) {
            uploadError = 'Invalid Pin Code';
            return false;
          }

          if (!tutor.cityName) {
            uploadError = 'City cannot be empty';
            return false;
          }

          if (!tutor.stateName) {
            uploadError = 'State cannot be empty';
            return false;
          }

          if (tutor.schoolName == null) {
            uploadError = 'School cannot be empty';
            return false;
          }

          if (
            !tutor.courseDetails.every((course, index) => {
              if (course.board && course.className && course.subject) {
                if (
                  course.board.length >= 4 &&
                  course.className.length >= 7 &&
                  course.subject.length > 3
                )
                  return true;
              }
              uploadError = `Invalid Course Detail for ${tutor.tutorName} `;
              return false;
            })
          ) {
            return false;
          }

          const filteredTutors = tutors.filter(function (el) {
            return el.mobileNo === tutor.mobileNo;
          });

          if (filteredTutors.length > 0) {
            uploadError = `Mobile number "${tutor.mobileNo}" already used`;
            return false;
          }
        }
        return true;
      });

    if (!uploadError) {
      setTutors([...tutors, ...structuredTutors]);
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
    promise.then((tutorArr: any) => {
      const structuredTutors: Tutor[] =
        tutorArr &&
        tutorArr.map((tutor: any) => {
          const getCourseDetails = () => {
            const courseDetailsArr =
              tutor.Course_Details && tutor.Course_Details.split(' | ');
            const courseDetails = courseDetailsArr.map((course: any) => {
              const arr = course.split(', ');
              return {
                board: arr[0],
                className: arr[1],
                subject: arr[2]
              };
            });
            return courseDetails;
          };
          return {
            mobileNo: tutor.Mobile_No,
            enrollmentId: tutor.Enrollment_Id,
            emailId: tutor.Email_Id,
            qualifications: tutor.Qualifications,
            schoolName: tutor.School_Name,
            tutorName: tutor.Tutor_Name,
            pinCode: tutor.Pin_Code,
            cityName: tutor.City,
            stateName: tutor.State,
            courseDetails: getCourseDetails()
          };
        });

      validateTutors(structuredTutors);
    });
  };

  const handleClearValues = () => {
    clearError('serverError');
    setTutors([]);
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
                  <img src={StudentWithMonitor} alt="Enroll Tutors" />

                  <Box marginLeft="15px">
                    <Typography component="span" color="secondary">
                      <Box component="h3" className={classes.heading}>
                        Enroll Tutors
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
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        to="/files/tutors.xlsx"
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
                <form onSubmit={addTutor}>
                  <Grid container className={classes.paddClass}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="normal">
                        <CustomFormLabel>Tutor Name</CustomFormLabel>
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
                      {errors.tutorName && (
                        <FormHelperText error>
                          {errors.tutorName.message}
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
                        <CustomFormLabel>Tutor Mobile Number</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <CustomInput
                          inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                          placeholder="Enter Tutor Mobile Number"
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
                        <CustomFormLabel>Qualifications</CustomFormLabel>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth margin="normal">
                        <Autocomplete
                          key={qualification === null ? 'true' : 'false'}
                          options={qualificationsList}
                          getOptionLabel={(option: AutocompleteOption) =>
                            option.title
                          }
                          autoComplete
                          includeInputInList
                          onChange={(e, node) => setQualification(node)}
                          value={qualification}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Qualification"
                            />
                          )}
                        />
                      </FormControl>
                      {/* {qualification?.value === 'Other' && <TypeOther />} */}
                      {errors.qualifications && (
                        <FormHelperText error>
                          {errors.qualifications.message}
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

                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    borderTop="1px solid rgba(224, 224, 224, 0.5)"
                    marginTop="20px"
                    padding="20px 30px"
                  >
                    <FormControl margin="normal" className={classes.addBtn}>
                      <Button
                        disableElevation
                        color="primary"
                        size="large"
                        variant="contained"
                        type="submit"
                      >
                        <AddIcon /> Add
                      </Button>
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
                        Enrolled Tutors
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                <Box flexGrow="1">
                  {tutors.map((item, index) => (
                    <TutorRow
                      key={index}
                      item={item}
                      handleRemoveItem={() => removeTutor(index)}
                    />
                  ))}
                </Box>

                {tutors && tutors.length > 0 && (
                  <Box
                    borderTop="1px solid rgba(224, 224, 224, 0.5)"
                    padding="30px 0"
                  >
                    <Box display="flex" justifyContent="center">
                      <Box marginRight="20px" className={classes.clearBtn}>
                        <Button
                          disableElevation
                          size="large"
                          variant="contained"
                          onClick={handleClearValues}
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
                          onClick={saveTutors}
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
  authUser: state.authReducer.authUser
});

export default connect(mapStateToProps)(
  withStyles(createStudentStyles)(TutorsEnrollment)
);

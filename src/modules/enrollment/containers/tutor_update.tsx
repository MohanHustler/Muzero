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
  Typography,
  TextField
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AutocompleteOption } from '../../common/contracts/autocomplete_option';
import { RootState } from '../../../store';
import { updateOrgTutor } from '../../common/api/organization';
import { Tutor } from '../../common/contracts/user';
import StudentWithMonitor from '../../../assets/images/student-with-monitor.png';
import Button from '../../common/components/form_elements/button';
import CustomFormLabel from '../../common/components/form_elements/custom_form_label';
import CustomInput from '../../common/components/form_elements/custom_input';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { CurrentTutor } from '../contracts/tutor';
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
  currentTutor: CurrentTutor;
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

const TutorUpdate: FunctionComponent<Props> = ({ currentTutor, match }) => {
  const disableAll = match.params.mode === 'view' ? true : false;
  const { errors, setError, clearError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState('');
  const [name, setName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState<string | number>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [qualification, setQualification] = useState<AutocompleteOption | null>(
    {
      title: currentTutor.qualifications,
      value: currentTutor.qualifications
    }
  );
  const [qualificationsList, setQualificationsList] = useState<
    AutocompleteOption[]
  >([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);
  const [school, setSchool] = useState<AutocompleteOption | null>({
    title: currentTutor.schoolname,
    value: currentTutor.schoolname
  });

  const styles = useStyles();

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

        const schoolsListResponse = await fetchCitySchoolsList({
          cityName: currentTutor.cityName
        });

        const structuredSchoolsList = schoolsListResponse.map((school) => ({
          title: `${school.schoolName} (${school.schoolAddress})`,
          value: school.schoolName
        }));

        setSchoolsList([
          ...structuredSchoolsList,
          { title: 'Other', value: 'Other' }
        ]);

        setName(currentTutor.name);
        setEnrollmentId(
          currentTutor.enrollmentId ? currentTutor.enrollmentId : '-'
        );
        setPhone(currentTutor.mobileNo);
        setEmail(currentTutor.email);
        setPinCode(currentTutor.pinCode);
        setCityName(currentTutor.cityName);
        setStateName(currentTutor.stateName);
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

  const saveTutors = async () => {
    if (!name.length) {
      setError('tutorName', 'Invalid Data', 'Tutor Name cannot be empty');
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

    const tutor: Tutor = {
      mobileNo: phone,
      emailId: email,
      qualifications: qualification?.value ? [qualification.value] : [],
      schoolName: school?.value ? school.value : '',
      tutorName: name,
      enrollmentId: enrollmentId !== '' ? enrollmentId : '',
      pinCode: pinCode ? pinCode : '',
      cityName: cityName ? cityName : '',
      stateName: stateName ? stateName : '',
      courseDetails: []
    };

    clearError('serverError');
    try {
      await updateOrgTutor(tutor);
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

  return (
    <div>
      <Navbar />

      <Container maxWidth="md">
        <Box bgcolor="white" marginY="20px">
          <Grid container>
            <Grid item xs={12} md={12}>
              <Box
                padding="20px 30px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={StudentWithMonitor} alt="Enroll Tutors" />

                <Box marginLeft="15px">
                  <Typography component="span" color="secondary">
                    <Box component="h3" className={styles.heading}>
                      {disableAll ? 'View Tutor' : 'Edit Tutor'}
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
                        readOnly={disableAll}
                      />
                    </FormControl>
                    {errors.tutorName && (
                      <FormHelperText error>
                        {errors.tutorName.message}
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
                      <CustomFormLabel>Qualifications</CustomFormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth margin="normal">
                      <Autocomplete
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
              </Box>
              {!disableAll && (
                <Box display="flex" justifyContent="flex-end" marginY="30px">
                  <Box className={styles.addBtn}>
                    <Button
                      disableElevation
                      color="secondary"
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
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser,
  currentTutor: state.studentTutorReducer.tutor
});

export default connect(mapStateToProps)(TutorUpdate);

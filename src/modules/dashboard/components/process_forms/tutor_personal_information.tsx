import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Grid,
  TextField,
  FormHelperText
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../../modules/auth/store/actions';
import { AutocompleteOption } from '../../../common/contracts/autocomplete_option';
import {
  fetchQualificationsList,
  fetchCitySchoolsList,
  fetchCitiesByPinCode
} from '../../../common/api/academics';
import { Tutor } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import { useForm } from 'react-hook-form';
import {
  NAME_PATTERN,
  EMAIL_PATTERN,
  PIN_PATTERN
} from '../../../common/validations/patterns';
import { exceptionTracker } from '../../../common/helpers';
import { processPageStyles } from '../../../common/styles';
import ProfileImage from '../../../dashboard/containers/profile_image';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from 'moment';

interface Props extends WithStyles<typeof processPageStyles> {
  user: Tutor;
  submitButtonText: string;
  saveUser: (data: Tutor) => any;
}

interface FormData {
  pageError: string;
  tutorName: string;
  emailId: string;
  dob: string;
  qualifications: string;
  schoolName: string;
  cityName: string;
  pinCode: string;
  stateName: string;
}

const TutorPersonalInformation: FunctionComponent<Props> = ({
  classes,
  user,
  saveUser,
  submitButtonText
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(user.tutorName || '');
  const [email, setEmail] = useState(user.emailId || '');
  const [dob, setDob] = useState(user.dob || '');
  const [qualification, setQualification] = useState<AutocompleteOption | null>(
    user.qualifications && user.qualifications.length > 0
      ? { title: user.qualifications[0], value: user.qualifications[0] }
      : null
  );
  const [school, setSchool] = useState<AutocompleteOption | null>(
    user.schoolName && user.schoolName.length > 0
      ? { title: user.schoolName, value: user.schoolName }
      : null
  );
  const [pinCode, setPinCode] = useState(user.pinCode || '');
  const [cityName, setCityName] = useState(user.cityName || '');
  const [stateName, setStateName] = useState(user.stateName || '');
  const [qualificationsList, setQualificationsList] = useState<
    AutocompleteOption[]
  >([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  const dispatch = useDispatch();

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

  if (redirectTo.length > 0) {
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
        }
      }
    } else {
      setCityName('');
      setStateName('');
    }
  };

  const submitPersonalInformation = (e: React.FormEvent) => {
    e.preventDefault();
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
        'Tutor Name should be minimum 5 characters long'
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

    if (dob.length < 1) {
      setError('dob', 'Invalid Data', 'Invalid Date');
      return;
    } else {
      clearError('dob');
    }
    if (moment(dob).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
      setError(
        'dob',
        'Invalid Data',
        'Date of birth cannot be current or future date'
      );
      return;
    } else {
      clearError('dob');
    }

    if (qualification === null || !qualification.value.length) {
      setError(
        'qualifications',
        'Invalid Data',
        'qualification cannot be empty'
      );
      return;
    } else {
      clearError('qualifications');
    }
    if (qualification && qualification.value.length < 3) {
      setError(
        'qualifications',
        'Invalid Data',
        'qualification should be minimum 3 characters long'
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
      setError('pinCode', 'Invalid Data', 'Invalid Pin Code');
      return;
    } else {
      clearError('pinCode');
    }

    if (school === null || !school.value.length) {
      setError('schoolName', 'Invalid Data', 'school name cannot be empty');
      return;
    } else {
      clearError('schoolName');
    }
    if (school && school.value.length < 5) {
      setError(
        'schoolName',
        'Invalid Data',
        'school name should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('schoolName');
    }

    saveUser({
      ...user,
      tutorName: name,
      emailId: email,
      dob: dob,
      qualifications: qualification?.value ? [qualification.value] : [],
      schoolName: school?.value ? school.value : '',
      pinCode: pinCode,
      cityName: cityName,
      stateName: stateName
    });
  };

  return (
    <div>
      <form onSubmit={submitPersonalInformation}>
        <Box>
          <ProfileImage
            profileUpdated={(profile) => dispatch(setAuthUser(profile))}
            profile={user}
            name={user.tutorName}
          />
        </Box>
        <Box component="h2" className={classes.helperText}>
          Please enter your details
        </Box>
        <Box component="h5" className={classes.instructionText}>
          field marked with <Box className={classes.requiredField}>*</Box> are
          mandatory
        </Box>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <CustomFormLabel>
                Tutor Name
                <Box className={classes.requiredField}>*</Box>
              </CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <CustomInput
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            {errors.tutorName && (
              <FormHelperText error>{errors.tutorName.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <CustomFormLabel>
                Email Address
                <Box className={classes.requiredField}>*</Box>
              </CustomFormLabel>
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
              <FormHelperText error>{errors.emailId.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <CustomFormLabel>Date Of Birth</CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <CustomInput
                type="date"
                value={moment(dob).format('YYYY-MM-DD')}
                onChange={(e) => setDob(e.target.value)}
                inputProps={{
                  max: moment().subtract(1, 'days').format('YYYY-MM-DD')
                }}
              />
            </FormControl>
            {errors.dob && (
              <FormHelperText error>{errors.dob.message}</FormHelperText>
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
                getOptionLabel={(option: AutocompleteOption) => option.title}
                autoComplete
                includeInputInList
                onChange={(e, node) => setQualification(node)}
                value={qualification}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Qualification" />
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
              <CustomFormLabel>Pin Code</CustomFormLabel>
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
              <FormHelperText error>{errors.pinCode.message}</FormHelperText>
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
                getOptionLabel={(option: AutocompleteOption) => option.title}
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
              <FormHelperText error>{errors.schoolName.message}</FormHelperText>
            )}
          </Grid>
        </Grid>

        {/* <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box fontWeight="bold" marginTop="5px">
              Location
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={locationsList}
              getOptionLabel={(option: AutocompleteOption) => option.title}
              autoComplete
              includeInputInList
              value={{ title: address, value: address }}
              onInputChange={(_, value) => { fetchAddresses(value); setAddress(value); }}
              // onChange={(e, node) => setAddress(node && node.value ? node.value : '')}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter Location" />
              )}
            />
          </FormControl>
        </Grid>
      </Grid> */}

        <Box
          display="flex"
          justifyContent="flex-end"
          marginY="20px"
          className={classes.nextBtn}
        >
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            {submitButtonText} <KeyboardArrowRightIcon />
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default withStyles(processPageStyles)(TutorPersonalInformation);

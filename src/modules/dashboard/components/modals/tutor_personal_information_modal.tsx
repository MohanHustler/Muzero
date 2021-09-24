import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { AutocompleteOption } from '../../../common/contracts/autocomplete_option';
import {
  fetchQualificationsList,
  fetchCitySchoolsList,
  fetchCitiesByPinCode
} from '../../../common/api/academics';

import { Tutor } from '../../../common/contracts/user';
import ContactWhite from '../../../../assets/images/contact-white.png';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import Modal from '../../../common/components/modal';
import { exceptionTracker } from '../../../common/helpers';
import { profileModalStyles } from '../../../common/styles';
import { useForm } from 'react-hook-form';
import {
  EMAIL_PATTERN,
  PIN_PATTERN
} from '../../../common/validations/patterns';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Props extends WithStyles<typeof profileModalStyles> {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Tutor) => any;
  user: Tutor;
}

interface FormData {
  emailId: string;
  dob: string;
  qualifications: string;
  schoolName: string;
  cityName: string;
  pinCode: string;
  stateName: string;
}

const TutorPersonalInformationModal: FunctionComponent<Props> = ({
  classes,
  openModal,
  onClose,
  saveUser,
  user
}) => {
  const [dob, setDob] = useState('');
  const { errors, setError, clearError } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [email, setEmail] = useState('');
  const [
    qualification,
    setQualification
  ] = useState<AutocompleteOption | null>();
  const [school, setSchool] = useState<AutocompleteOption | null>();
  const [pinCode, setPinCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [qualificationsList, setQualificationsList] = useState<
    AutocompleteOption[]
  >([]);
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    initializePersonalInfo();
    // eslint-disable-next-line
  }, [openModal]);

  const initializePersonalInfo = () => {
    setDob(user.dob ? user.dob : '');
    setEnrollmentId(user.enrollmentId as string);
    setEmail(user.emailId);
    setQualification({
      title: user.qualifications[0],
      value: user.qualifications[0]
    });
    setSchool({ title: user.schoolName, value: user.schoolName });
    setPinCode(user.pinCode);
    setCityName(user.cityName);
    setStateName(user.stateName);
  };

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

  const submitPersonalInformation = (e: React.FormEvent) => {
    e.preventDefault();
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

    if (qualification == null || qualification.value.length < 3) {
      setError(
        'qualifications',
        'Invalid Data',
        'qualification cannot be empty'
      );
      return;
    } else {
      clearError('qualifications');
    }

    if (school === null || (school && !school.value.length)) {
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

    saveUser({
      ...user,
      enrollmentId: enrollmentId !== '' ? enrollmentId : undefined,
      emailId: email,
      dob: dob,
      qualifications: qualification?.value ? [qualification.value] : [],
      schoolName: school?.value ? school.value : '',
      pinCode: pinCode,
      cityName: cityName,
      stateName: stateName
    });

    onClose();
  };

  return (
    <Modal
      open={openModal}
      handleClose={onClose}
      header={
        <Box display="flex" alignItems="center">
          <img src={ContactWhite} alt="Personal Info" />

          <Box marginLeft="15px">
            <Typography component="span" color="primary">
              <Box component="h3" className={classes.modalHeading}>
                Personal Information
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
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
              Tutor Name<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Box>{user.tutorName}</Box>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>
              Email Address<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="Your Email Address"
              value={email}
              inputProps={{ maxLength: 100 }}
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

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Phone Number</CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Box>{user.mobileNo}</Box>
          </FormControl>
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
              Locations
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

      <Box className={classes.submitBtn}>
        <Button
          variant="contained"
          color="primary"
          onClick={submitPersonalInformation}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default withStyles(profileModalStyles)(TutorPersonalInformationModal);

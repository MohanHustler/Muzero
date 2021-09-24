import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Typography
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Organization } from '../../../common/contracts/user';
import ContactWhite from '../../../../assets/images/contact-white.png';
import Button from '../../../common/components/form_elements/button';
import CustomInput from '../../../common/components/form_elements/custom_input';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import Modal from '../../../common/components/modal';
import { exceptionTracker } from '../../../common/helpers';
import { profileModalStyles } from '../../../common/styles';
import { useForm } from 'react-hook-form';
import {
  EMAIL_PATTERN,
  ORG_NAME_PATTERN,
  PIN_PATTERN
} from '../../../common/validations/patterns';
import { fetchCitiesByPinCode } from '../../../common/api/academics';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Props extends WithStyles<typeof profileModalStyles> {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Organization) => any;
  user: Organization;
}

interface FormData {
  emailId: string;
  organizationName: string;
  address: string;
  cityName: string;
  pinCode: string;
  stateName: string;
}

const OrganizationPersonalInformationModal: FunctionComponent<Props> = ({
  classes,
  openModal,
  onClose,
  saveUser,
  user
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    initializePersonalInfo();
    // eslint-disable-next-line
  }, [openModal]);

  const initializePersonalInfo = () => {
    setEmail(user.emailId);
    setOrganizationName(user.organizationName);
    setAddress(user.address);
    setPinCode(user.pinCode);
    setCityName(user.city);
    setStateName(user.stateName);
  };

  if (redirectTo.length > 0) {
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
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        } else {
          console.log(error);
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
    if (organizationName.length <= 4) {
      setError(
        'organizationName',
        'Invalid Data',
        'Institute name minimum 5 characters long'
      );
      return;
    } else {
      clearError('organizationName');
    }

    if (!ORG_NAME_PATTERN.test(organizationName)) {
      setError('organizationName', 'Invalid Data', 'Invalid institute name');
      return;
    } else {
      clearError('organizationName');
    }

    if (!EMAIL_PATTERN.test(email.toLowerCase())) {
      setError('emailId', 'Invalid Data', 'Invalid Email');
      return;
    } else {
      clearError('emailId');
    }

    if (address == null || address.length < 5) {
      setError('address', 'Invalid Data', 'Address cannot be empty');
      return;
    } else {
      clearError('address');
    }

    if (pinCode == null || !PIN_PATTERN.test(pinCode)) {
      setError('pinCode', 'Invalid Data', 'Invalid Data');
      return;
    } else {
      clearError('pinCode');
    }

    saveUser({
      ...user,
      organizationName: organizationName,
      emailId: email,
      address: address,
      city: cityName,
      pinCode: pinCode,
      stateName: stateName,
      courseDetails: user.courseDetails
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
            <CustomFormLabel>
              Institute Name<Box className={classes.requiredField}>*</Box>
            </CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="Your Name"
              value={organizationName}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </FormControl>
          {errors.organizationName && (
            <FormHelperText error>
              {errors.organizationName.message}
            </FormHelperText>
          )}
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
            <CustomFormLabel>Address</CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              inputProps={{ maxLength: 100 }}
              placeholder="Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          {errors.address && (
            <FormHelperText error>{errors.address.message}</FormHelperText>
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

export default withStyles(profileModalStyles)(
  OrganizationPersonalInformationModal
);

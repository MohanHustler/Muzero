import React, { FunctionComponent, useState } from 'react';
import { Box, FormControl, Grid, FormHelperText } from '@material-ui/core';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../../modules/auth/store/actions';
import { fetchCitiesByPinCode } from '../../../common/api/academics';
import { Organization } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import { useForm } from 'react-hook-form';
import {
  EMAIL_PATTERN,
  ORG_NAME_PATTERN,
  PIN_PATTERN
} from '../../../common/validations/patterns';
import { exceptionTracker } from '../../../common/helpers';
import { processPageStyles } from '../../../common/styles';
import ProfileImage from '../../../dashboard/containers/profile_image';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface Props extends WithStyles<typeof processPageStyles> {
  user: Organization;
  submitButtonText: string;
  saveUser: (data: Organization) => any;
}

interface FormData {
  pageError: string;
  organizationName: string;
  emailId: string;
  address: string;
  cityName: string;
  pinCode: string;
  stateName: string;
}

const OrganizationPersonalInformation: FunctionComponent<Props> = ({
  classes,
  user,
  saveUser,
  submitButtonText
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(user.organizationName || '');
  const [email, setEmail] = useState(user.emailId || '');
  const [address, setAddress] = useState(user.address || '');
  const [pinCode, setPinCode] = useState(user.pinCode || '');
  const [cityName, setCityName] = useState(user.city || '');
  const [stateName, setStateName] = useState(user.stateName || '');
  const [redirectTo, setRedirectTo] = useState('');

  const dispatch = useDispatch();

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
      setError('organizationName', 'Invalid Data', 'Name cannot be empty');
      return;
    } else {
      clearError('organizationName');
    }

    if (name.length < 5) {
      setError(
        'organizationName',
        'Invalid Data',
        'Institute name should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('organizationName');
    }

    if (!ORG_NAME_PATTERN.test(name)) {
      setError('organizationName', 'Invalid Data', 'Invalid name');
      return;
    } else {
      clearError('organizationName');
    }

    if (!email.length) {
      setError('emailId', 'Invalid Data', 'Email sholud not be empty');
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

    if (!address.length) {
      setError('address', 'Invalid Data', 'Address cannot be empty');
      return;
    } else {
      clearError('address');
    }

    if (address.length < 5) {
      setError(
        'address',
        'Invalid Data',
        'Address should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('address');
    }

    if (!pinCode.length) {
      setError('pinCode', 'Invalid Data', 'PinCode cannot be empty');
      return;
    } else {
      clearError('pinCode');
    }
    // TODO: Pincode length changes
    if (pinCode.length < 5) {
      setError(
        'pinCode',
        'Invalid Data',
        'PinCode should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('pinCode');
    }

    saveUser({
      ...user,
      organizationName: name,
      emailId: email,
      address: address,
      city: cityName,
      pinCode: pinCode,
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
            name={user.organizationName}
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
                Institute Name<Box className={classes.requiredField}>*</Box>
              </CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <CustomInput
                placeholder="Your Full Name"
                value={name}
                inputProps={{ maxLength: 50 }}
                onChange={(e) => setName(e.target.value)}
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
                Email ID<Box className={classes.requiredField}>*</Box>
              </CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <CustomInput
                placeholder="Your Email ID"
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
              <CustomFormLabel>Pin Code</CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <CustomInput
                inputProps={{
                  inputMode: 'numeric',
                  minLength: 6,
                  maxLength: 6
                }}
                placeholder="Pin Code"
                value={pinCode}
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

export default withStyles(processPageStyles)(OrganizationPersonalInformation);

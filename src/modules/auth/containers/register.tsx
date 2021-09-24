import React, { FunctionComponent, useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Link
} from '@material-ui/core';
import { MobileFriendly as MobileFriendlyIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { generateOTP, verifyOTP, checkOrgCode } from '../../common/api/auth';
import {
  OTP_PATTERN,
  PHONE_PATTERN,
  ORG_CODE_PATTERN
} from '../../common/validations/patterns';
import Button from '../../common/components/form_elements/button';
import { Role } from '../../common/enums/role';
import { exceptionTracker } from '../../common/helpers';
import { onBoardingStyles } from '../../common/styles';

interface Props extends WithStyles<typeof onBoardingStyles> {}

interface FormData {
  orgCode: string;
  mobileNumber: string;
  otp: string;
  accountType: string;
  serverError: string;
}

const ValidationSchema = yup.object().shape({
  orgCode: yup
    .string()
    .required('Code is a required field')
    .matches(
      ORG_CODE_PATTERN,
      'Code should contain only alphabets and should have minimum 5 characters'
    ),
  mobileNumber: yup
    .string()
    .required('mobile number is a required field')
    .matches(PHONE_PATTERN, 'mobile number is invalid'),
  otp: yup.string().required().matches(OTP_PATTERN, 'otp is invalid')
});

const Register: FunctionComponent<Props> = ({ classes }) => {
  const {
    errors,
    getValues,
    handleSubmit,
    register,
    setError,
    clearError,
    setValue
  } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const [role, setRole] = useState('');
  const [roles] = useState<string[]>([
    'STUDENT',
    'TUTOR',
    'PARENT',
    'INSTITUTE'
  ]);
  const [redirectTo, setRedirectTo] = useState('');
  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const handleVerifyOTP = async ({ orgCode, mobileNumber, otp }: FormData) => {
    if (!role) {
      return setError('accountType', 'required', 'Select Account-Type');
    } else {
      clearError('accountType');
    }
    try {
      let userType = Role.TUTOR;
      switch (role) {
        case 'STUDENT':
          userType = Role.STUDENT;
          break;
        case 'TUTOR':
          userType = Role.TUTOR;
          break;
        case 'INSTITUTE':
          userType = Role.ORGANIZATION;
          break;
        case 'PARENT':
          userType = Role.PARENT;
          break;
        default:
          userType = Role.TUTOR;
      }
      await verifyOTP(orgCode, mobileNumber, otp, userType);
      setRedirectTo(
        `/register/security?org=${orgCode}&phone=${mobileNumber}&otp=${otp}&role=${role}`
      );
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setError('serverError', 'Invalid Data', error.response?.data.message);
      }
    }
  };

  const checkCodeAvailability = async () => {
    const orgCode = getValues('orgCode');
    if (!orgCode) {
      return setError('orgCode', 'required', 'Code is a required field');
    }

    try {
      const response = await checkOrgCode(orgCode);
      setError('orgCode', 'Server Data', response.data.message);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setError('orgCode', 'Invalid Data', error.response?.data.message);
      }
    }
  };

  const handleGenerateOTP = async () => {
    const mobileNumber = getValues('mobileNumber');
    if (!mobileNumber) {
      return setError(
        'mobileNumber',
        'required',
        'mobile number is a required field'
      );
    } else {
      clearError('mobileNumber');
    }
    if (!role) {
      return setError('accountType', 'required', 'Select Account-Type');
    } else {
      clearError('accountType');
    }

    try {
      const response = await generateOTP('+91', mobileNumber);

      // TODO: Remove this in production.
      setValue('otp', response.data.otp, true);
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
    <div className={classes.root}>
      <Container>
        <Grid container alignItems="center" className={classes.formContainer}>
          <Grid item sm={6} md={4} className={classes.boxLayout}>
            <Box
              bgcolor="white"
              borderRadius="10px"
              padding="20px 40px"
              textAlign="center"
            >
              <Box className={classes.heading} component="h2">
                Register
              </Box>
              <form onSubmit={handleSubmit(handleVerifyOTP)}>
                <FormControl fullWidth margin="normal">
                  <Input
                    name="orgCode"
                    inputProps={{ maxLength: 10 }}
                    placeholder="Institute / Tutor Code"
                    inputRef={register}
                  />
                  {errors.orgCode && (
                    <FormHelperText error>
                      {errors.orgCode.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <Box textAlign="right" className={classes.navLink}>
                  <Link href="#" onClick={checkCodeAvailability}>
                    Check availability
                  </Link>
                </Box>

                <FormControl fullWidth margin="normal">
                  <Input
                    name="mobileNumber"
                    inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                    placeholder="Mobile Number"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton disabled size="small">
                          <MobileFriendlyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    inputRef={register}
                  />
                  {errors.mobileNumber && (
                    <FormHelperText error>
                      {errors.mobileNumber.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Input
                    name="otp"
                    placeholder="OTP"
                    inputProps={{ maxLength: 6 }}
                    inputRef={register}
                  />
                  {errors.otp && (
                    <FormHelperText error>{errors.otp.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Select
                    value={role}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      setRole(e.target.value as string)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Select account-type</MenuItem>
                    {roles.length > 0 &&
                      roles.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                  </Select>
                  {errors.accountType && (
                    <FormHelperText error>
                      {errors.accountType.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <Box textAlign="right" className={classes.navLink}>
                  <Link href="#" onClick={handleGenerateOTP}>
                    Click Here To Get OTP
                  </Link>
                </Box>

                <FormControl fullWidth margin="normal">
                  <Button
                    disableElevation
                    color="primary"
                    type="submit"
                    size="large"
                    variant="contained"
                  >
                    Sign Up
                  </Button>
                  {errors.serverError && (
                    <FormHelperText error>
                      {errors.serverError.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </form>
              <FormControl fullWidth margin="normal">
                <Box className={classes.helperText}>
                  By tappint Login, you agree with our{' '}
                  <Link
                    align="left"
                    target="_blank"
                    to="/terms-conditions"
                    color="secondary"
                    component={RouterLink}
                  >
                    Terms
                  </Link>
                  , Learn how we process your data in our{' '}
                  <Link
                    align="left"
                    target="_blank"
                    to="/privacy-policy"
                    color="secondary"
                    component={RouterLink}
                  >
                    {' '}
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link
                    align="left"
                    target="_blank"
                    to="/privacy-policy"
                    color="secondary"
                    component={RouterLink}
                  >
                    {' '}
                    Cookies Policy
                  </Link>
                </Box>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Box textAlign="center" className={classes.navLink}>
                  <Link to="/login" component={RouterLink}>
                    Already have an account?
                  </Link>
                </Box>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(onBoardingStyles)(Register);

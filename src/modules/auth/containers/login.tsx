import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
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
  Link
} from '@material-ui/core';
import { MobileFriendly as MobileFriendlyIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { loginUser, verifyCaptcha } from '../../common/api/auth';
import { getStudent, getTutor, getParent } from '../../common/api/tutor';
import { getOrganization } from '../../common/api/organization';
import { getAdmin } from '../../common/api/admin';
import {
  setAuthToken,
  setAuthUser,
  setAuthUserPermissions,
  setAuthUserRole
} from '../store/actions';
import {
  PHONE_PATTERN,
  PASSWORD_PATTERN
} from '../../common/validations/patterns';
import { Role } from '../../common/enums/role';
import Button from '../../common/components/form_elements/button';
import PasswordVisibilityButton from '../../common/components/password_visibility_button';
import Footer from '../../common/components/footer';
import ReCAPTCHA from 'react-google-recaptcha';
import SelectRoleModal from '../components/select_role_modal';
import { eventTracker, exceptionTracker } from '../../common/helpers';
import { onBoardingStyles } from '../../common/styles';

interface Props extends WithStyles<typeof onBoardingStyles> {}

interface FormData {
  orgCode: string;
  mobileNumber: string;
  password: string;
  serverError: string;
}

const ValidationSchema = yup.object().shape({
  orgCode: yup.string().required('Code is a required field'),
  mobileNumber: yup
    .string()
    .required('mobile number is a required field')
    .matches(PHONE_PATTERN, 'mobile number is invalid'),
  password: yup
    .string()
    .required()
    .matches(
      PASSWORD_PATTERN,
      'password must contain uppercase, lowercase, alphanumeric, & special characters'
    )
});

const Login: FunctionComponent<Props> = ({ classes }) => {
  const { handleSubmit, register, errors, setError, clearError } = useForm<
    FormData
  >({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCaptchaVisible, setCaptchaVisible] = useState(false);
  const [isLoginButtonDisabled, setLoginButtonDisabled] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [captcha, setCaptcha] = useState<ReCAPTCHA | null>();
  const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY
    ? process.env.REACT_APP_RECAPTCHA_KEY
    : '';
  const dispatch = useDispatch();
  const [openSelectRoleModal, setOpenSelectRoleModal] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [username, setUsername] = useState('');

  const selectRole = async (name: Role) => {
    setOpenSelectRoleModal(false);
    handleSelectRole(name);
  };

  const handleSelectRole = async (role: Role) => {
    try {
      dispatch(setAuthUserRole(role));

      if (role === Role.ADMIN) {
        try {
          const admin = await getAdmin();
          dispatch(setAuthUser(admin));
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
          setRedirectTo(`/login`);
        }
        return;
      } else if (role === Role.ORGANIZATION) {
        try {
          const organization = await getOrganization();
          dispatch(setAuthUser(organization));
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
          dispatch(setAuthUser({ mobileNo: username }));
          // Redirect the user to complete his profile, if he has recently
          // registered or not yet filled his profile up.
          setRedirectTo(`/profile/org/process/1`);
        }

        return;
      } else if (role === Role.TUTOR || role === Role.ORG_TUTOR) {
        try {
          const tutor = await getTutor();
          dispatch(setAuthUser(tutor));
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
          dispatch(setAuthUser({ mobileNo: username }));
          // Redirect the user to complete his profile, if he has recently
          // registered or not yet filled his profile up.
          setRedirectTo(`/profile/process/1`);
        }

        return;
      } else if (role === Role.STUDENT) {
        const student = await getStudent();
        dispatch(setAuthUser(student));
        setRedirectTo(`/profile/dashboard`);
      } else if (role === Role.PARENT) {
        const parent = await getParent();
        dispatch(setAuthUser(parent));
        setRedirectTo(`/profile/dashboard`);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      setError('serverError', 'Server response', error.response?.data.message);
      captcha?.reset();
      setCaptchaVisible(true);
      setLoginButtonDisabled(true);
    }
  };

  const onChange = async (value: string | null) => {
    clearError('serverError');
    if (value) {
      try {
        const response = await verifyCaptcha(value);
        if (response?.data.code === 0) {
          setLoginButtonDisabled(false);
        } else {
          setError('serverError', 'Server response', response?.data.message);
        }
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        setError(
          'serverError',
          'Server response',
          error.response?.data.message
        );
      }
    }
  };

  const handleLogin = async ({ orgCode, mobileNumber, password }: FormData) => {
    clearError('serverError');
    try {
      const response = await loginUser(orgCode + '|' + mobileNumber, password);
      const user = response.data;

      setUsername(user.username);
      dispatch(setAuthUserPermissions(user.permissions));
      dispatch(setAuthToken(user.accessToken));
      if (user.roles.length > 1) {
        setRoles(user.roles);
        setOpenSelectRoleModal(true);
        return;
      }
      const role = user.roles[0];
      dispatch(setAuthUserRole(role));

      if (role === Role.ADMIN) {
        try {
          const admin = await getAdmin();
          dispatch(setAuthUser(admin));
          eventTracker('Login', 'Admin Login', 'Login Success');
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
        }
        return;
      } else if (role === Role.ORGANIZATION) {
        try {
          const organization = await getOrganization();
          dispatch(setAuthUser(organization));
          eventTracker('Login', 'Organization Login', 'Login Success');
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
          dispatch(setAuthUser({ mobileNo: mobileNumber }));
          // Redirect the user to complete his profile, if he has recently
          // registered or not yet filled his profile up.
          setRedirectTo(`/profile/org/process/1`);
        }

        return;
      } else if (role === Role.TUTOR || role === Role.ORG_TUTOR) {
        try {
          const tutor = await getTutor();
          dispatch(setAuthUser(tutor));
          eventTracker(
            'Login',
            role === Role.TUTOR ? 'Tutor Login' : 'Org Tutor Login',
            'Login Success'
          );
          setRedirectTo(`/profile/dashboard`);
        } catch (error) {
          exceptionTracker(error.response?.data.message);
          dispatch(setAuthUser({ mobileNo: mobileNumber }));
          // Redirect the user to complete his profile, if he has recently
          // registered or not yet filled his profile up.
          setRedirectTo(`/profile/process/1`);
        }

        return;
      } else if (role === Role.STUDENT) {
        const student = await getStudent();
        dispatch(setAuthUser(student));
        eventTracker('Login', 'Student Login', 'Login Success');
        setRedirectTo(`/profile/dashboard`);
      } else if (role === Role.PARENT) {
        const parent = await getParent();
        dispatch(setAuthUser(parent));
        eventTracker('Login', 'Parent Login', 'Login Success');
        setRedirectTo(`/profile/dashboard`);
      }
    } catch (error) {
      setError('serverError', 'Server response', error.response?.data.message);
      exceptionTracker(error.response?.data.message);
      orgCode = '';
      mobileNumber = '';
      password = '';
      captcha?.reset();
      setCaptchaVisible(true);
      setLoginButtonDisabled(true);
    }
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div className={classes.root}>
      <Footer />
      <Container>
        <Grid container alignItems="center" className={classes.formContainer}>
          <Grid item sm={6} md={4} className={classes.boxLayout}>
            <Box
              bgcolor="white"
              borderRadius="15px"
              padding="20px 40px"
              textAlign="center"
            >
              <Box className={classes.heading} component="h2">
                Login
              </Box>
              <form onSubmit={handleSubmit(handleLogin)}>
                <FormControl fullWidth margin="normal">
                  <Input
                    name="orgCode"
                    inputProps={{ maxLength: 10 }}
                    placeholder="Institute / Tutor Code"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton disabled size="small">
                          <MobileFriendlyIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    inputRef={register}
                  />
                  {errors.orgCode && (
                    <FormHelperText error>
                      {errors.orgCode.message}
                    </FormHelperText>
                  )}
                </FormControl>

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
                    name="password"
                    placeholder="Password"
                    inputProps={{ maxLength: 50 }}
                    type={isPasswordVisible ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <PasswordVisibilityButton
                          isVisible={isPasswordVisible}
                          handleChange={(isVisible) =>
                            setIsPasswordVisible(isVisible)
                          }
                        />
                      </InputAdornment>
                    }
                    inputRef={register}
                  />
                  {errors.password && (
                    <FormHelperText error>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box
                  textAlign="right"
                  marginBottom="5px"
                  className={classes.navLink}
                >
                  <Link
                    color="primary"
                    to="/forgot-password"
                    component={RouterLink}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                {isCaptchaVisible && (
                  <FormControl fullWidth margin="normal">
                    <ReCAPTCHA
                      ref={(e) => setCaptcha(e)}
                      sitekey={recaptchaKey}
                      onChange={onChange}
                    />
                  </FormControl>
                )}
                <FormControl fullWidth margin="normal">
                  <Button
                    disableElevation
                    color="primary"
                    type="submit"
                    size="large"
                    variant="contained"
                    disabled={isLoginButtonDisabled}
                  >
                    Log in
                  </Button>
                </FormControl>
                {errors.serverError && (
                  <FormHelperText error>
                    {errors.serverError.message}
                  </FormHelperText>
                )}
              </form>

              <FormControl fullWidth margin="normal">
                <Box className={classes.helperText}>
                  By tappint Login, you agree with our{' '}
                  <Link
                    align="left"
                    target="_blank"
                    to="/terms-conditions"
                    color="primary"
                    component={RouterLink}
                  >
                    Terms
                  </Link>
                  , Learn how we process your data in our{' '}
                  <Link
                    align="left"
                    target="_blank"
                    to="/privacy-policy"
                    color="primary"
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
                    color="primary"
                    component={RouterLink}
                  >
                    {' '}
                    Cookies Policy
                  </Link>
                </Box>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Box textAlign="center" className={classes.navLink}>
                  <Link color="primary" to="/register" component={RouterLink}>
                    Create account?
                  </Link>
                </Box>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <SelectRoleModal
        openModal={openSelectRoleModal}
        handleClose={() => setOpenSelectRoleModal(false)}
        handleSelectRole={selectRole}
        roles={roles}
      />
      <Box
        position="absolute"
        bottom="20px"
        left="20px"
        color="#fff"
        fontSize="12px"
      >
        V 0.3
      </Box>
    </div>
  );
};

export default withStyles(onBoardingStyles)(Login);

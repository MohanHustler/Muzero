import React, { FunctionComponent, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme
} from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import {
  AllInclusive as AllInclusiveIcon,
  CheckCircle as CheckCircleIcon
} from '@material-ui/icons';
import { registerUser } from '../../common/api/auth';
import { PASSWORD_PATTERN } from '../../common/validations/patterns';
import { Role } from '../../common/enums/role';
import GirlWithNotebook from '../../../assets/images/girl-with-notebook.jpg';
import Logo from '../../../assets/svgs/logo.svg';
import Button from '../../common/components/form_elements/button';
import PasswordVisibilityButton from '../../common/components/password_visibility_button';
import { exceptionTracker } from '../../common/helpers';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background:
        'radial-gradient(47.89% 47.89% at 64.2% 52.11%, rgba(41, 75, 100, 0) 0%, rgba(41, 75, 100, 0.27) 67.71%), url(' +
        GirlWithNotebook +
        ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '20px 0'
    },

    gridBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },

    gridBox: {
      padding: '20px',
      [theme.breakpoints.up('sm')]: {
        padding: '40px'
      }
    },

    logoContainer: {
      textAlign: 'center',
      marginBottom: '10px',
      [theme.breakpoints.up('sm')]: {
        marginBottom: '40px'
      }
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

interface FormData {
  password: string;
  passwordConfirmation: string;
  serverError: string;
}

const ValidationSchema = yup.object().shape({
  password: yup
    .string()
    .required()
    .matches(
      PASSWORD_PATTERN,
      'password must contain uppercase, lowercase, alphanumeric, & special characters'
    ),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'passwords must match')
});

const SetPassword: FunctionComponent<Props> = ({ classes, location }) => {
  const { errors, handleSubmit, register, setError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [
    isPasswordConfirmationVisible,
    setIsPasswordConfirmationVisible
  ] = useState(false);

  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const params = new URLSearchParams(location.search);
  const orgCode = params.get('org');
  const mobileNumber = params.get('phone');
  const otp = params.get('otp');
  const role = params.get('role');

  if (!orgCode || !mobileNumber || !otp || !role) {
    setRedirectTo('/register');
  }

  const handleRegister = async ({ password }: FormData) => {
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

    try {
      await registerUser(
        orgCode as string,
        mobileNumber as string,
        otp as string,
        password,
        userType
      );
      setRedirectTo('/login');
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
        <div className={classes.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>

        <Grid container>
          <Grid item sm="auto" md={2} />

          <Grid item sm={6} md={4} className={classes.gridBackground}>
            <Box textAlign="center" className={classes.gridBox}>
              <Box textAlign="left" component="h2" marginTop="25px">
                Set Password
              </Box>

              <form onSubmit={handleSubmit(handleRegister)}>
                <FormControl fullWidth margin="normal">
                  <Input
                    name="password"
                    placeholder="Enter password"
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

                <FormControl fullWidth margin="normal">
                  <Input
                    name="passwordConfirmation"
                    placeholder="Enter password again"
                    inputProps={{ maxLength: 50 }}
                    type={isPasswordConfirmationVisible ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <PasswordVisibilityButton
                          isVisible={isPasswordConfirmationVisible}
                          handleChange={(isVisible) =>
                            setIsPasswordConfirmationVisible(isVisible)
                          }
                        />
                      </InputAdornment>
                    }
                    inputRef={register}
                  />
                  {errors.passwordConfirmation && (
                    <FormHelperText error>
                      {errors.passwordConfirmation.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Button
                    disableElevation
                    color="secondary"
                    type="submit"
                    size="large"
                    variant="contained"
                  >
                    Save Password
                  </Button>
                  {errors.serverError && (
                    <FormHelperText error>
                      {errors.serverError.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </form>
            </Box>
          </Grid>

          <Divider orientation="vertical" />

          <Grid item sm={6} md={4} className={classes.gridBackground}>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemIcon>
                  <AllInclusiveIcon color="primary" />
                </ListItemIcon>

                <ListItemText>
                  <Box component="h2">Password Guidelines</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>

                <ListItemText primary="Be at least 8 characters in length" />
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>

                <ListItemText primary="Contains both upper and lowercase alphabetic characters (e.g. A-Z,a-z)" />
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>

                <ListItemText primary="Have at least one numerical character (e.g. 0-9)" />
              </ListItem>

              <ListItem dense>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>

                <ListItemText primary="Have at least one special character (e.g. ~!@#$%^&*()_-+=)" />
              </ListItem>
            </Box>
          </Grid>

          <Grid item sm="auto" md={2} />
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(SetPassword));

import React, { FunctionComponent, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  Theme,
  Typography
} from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { PASSWORD_PATTERN } from '../../common/validations/patterns';
import { setPassword } from '../../common/api/auth';
import GirlWithCup from '../../../assets/images/girl-with-cup.jpg';
import Logo from '../../../assets/svgs/logo.svg';
import Button from '../../common/components/form_elements/button';
import PasswordVisibilityButton from '../../common/components/password_visibility_button';
import { exceptionTracker } from '../../common/helpers';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background:
        'radial-gradient(47.89% 47.89% at 64.2% 52.11%, rgba(41, 75, 100, 0) 0%, rgba(41, 75, 100, 0.27) 67.71%), url(' +
        GirlWithCup +
        ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '20px 0'
    },

    formContainer: {
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'flex-start'
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

const ResetPassword: FunctionComponent<Props> = ({ classes, location }) => {
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

  if (!orgCode || !mobileNumber || !otp) {
    setRedirectTo('/forgot-password');
  }

  const handleResetPassword = async ({ password }: FormData) => {
    try {
      await setPassword(
        orgCode as string,
        mobileNumber as string,
        otp as string,
        password
      );

      setRedirectTo('/login');
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      setError('password', 'invalid', error.response.data.message);
    }
  };

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>

        <Grid container alignItems="center" className={classes.formContainer}>
          <Grid item sm={6} md={4}>
            <Box
              bgcolor="white"
              borderRadius="10px"
              padding="20px 40px"
              textAlign="center"
            >
              <Box textAlign="center" component="h2">
                New Password
              </Box>

              <Typography>
                Please create a strong password
                <br />
                &amp; Remember it!
              </Typography>

              <form onSubmit={handleSubmit(handleResetPassword)}>
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
                </FormControl>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(ResetPassword));

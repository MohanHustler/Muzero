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
  Link,
  Theme,
  Typography
} from '@material-ui/core';
import { MobileFriendly as MobileFriendlyIcon } from '@material-ui/icons';
import {
  makeStyles,
  createStyles,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { generateOTP, verifyOTP } from '../../common/api/auth';
import { OTP_PATTERN, PHONE_PATTERN } from '../../common/validations/patterns';
import BannerImage from '../../../assets/images/yellow-tshirt-guy.jpg';
import Button from '../../common/components/form_elements/button';
import { exceptionTracker } from '../../common/helpers';
import { onBoardingStyles } from '../../common/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    forgotContainer: {
      background:
        'radial-gradient(47.89% 47.89% at 64.2% 52.11%, rgba(41, 75, 100, 0) 0%, rgba(41, 75, 100, 0.27) 67.71%), url(' +
        BannerImage +
        ')',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '20px 0'
    }
  })
);

interface Props extends WithStyles<typeof onBoardingStyles> {}

interface FormData {
  orgCode: string;
  mobileNumber: string;
  otp: string;
}

const ValidationSchema = yup.object().shape({
  orgCode: yup.string().required('Code is a required field'),
  mobileNumber: yup
    .string()
    .required('mobile number is a required field')
    .matches(PHONE_PATTERN, 'mobile number is invalid'),
  otp: yup.string().required().matches(OTP_PATTERN, 'otp is invalid')
});

const ForgotPassword: FunctionComponent<Props> = ({ classes }) => {
  const {
    errors,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue
  } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });
  const [redirectTo, setRedirectTo] = useState('');

  const styles = useStyles();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const handleVerifyOTP = async ({ orgCode, mobileNumber, otp }: FormData) => {
    try {
      await verifyOTP(orgCode, mobileNumber, otp, '');

      setRedirectTo(
        `/forgot-password/reset?org=${orgCode}&phone=${mobileNumber}&otp=${otp}`
      );
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      setError('otp', 'matches', 'otp is invalid');
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
    }

    try {
      const response = await generateOTP('+91', mobileNumber);

      // TODO: Remove this in production.
      setValue('otp', response.data.otp, true);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      setError('mobileNumber', 'matches', 'mobile number is invalid');
    }
  };

  return (
    <div className={styles.forgotContainer}>
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
                Forgot Password
              </Box>

              <Typography className={classes.instructions}>
                Just enter the phone you've used to
                <br />
                login with us!
              </Typography>

              <form onSubmit={handleSubmit(handleVerifyOTP)}>
                <FormControl fullWidth margin="normal">
                  <Input
                    name="orgCode"
                    inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                    placeholder="Institute / Tutor Code"
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
                    name="otp"
                    placeholder="OTP"
                    inputProps={{ maxLength: 6 }}
                    inputRef={register}
                  />
                  {errors.otp && (
                    <FormHelperText error>{errors.otp.message}</FormHelperText>
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
                    Submit
                  </Button>
                </FormControl>
              </form>

              <FormControl fullWidth margin="normal">
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  className={classes.navLink}
                >
                  <Link color="primary" to="/login" component={RouterLink}>
                    Back To Login
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

export default withStyles(onBoardingStyles)(ForgotPassword);

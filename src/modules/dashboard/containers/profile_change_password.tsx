import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { PASSWORD_PATTERN } from '../../common/validations/patterns';
import Button from '../../common/components/form_elements/button';
import PasswordVisibilityButton from '../../common/components/password_visibility_button';
import { setChangePassword } from '../../common/api/profile';
import { exceptionTracker } from '../../common/helpers';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

interface FormData {
  currPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  serverError: string;
}

const ValidationSchema = yup.object().shape({
  currPassword: yup
    .string()
    .required('password cannot be empty')
    .matches(
      PASSWORD_PATTERN,
      'password must contain uppercase, lowercase, alphanumeric, & special characters'
    ),
  newPassword: yup
    .string()
    .required('password cannot be empty')
    .notOneOf(
      [yup.ref('currPassword')],
      'new password can not be same as the old password'
    )
    .matches(
      PASSWORD_PATTERN,
      'password must contain uppercase, lowercase, alphanumeric, & special characters'
    ),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'passwords must match')
});

const ProfileChangePassword: FunctionComponent<Props> = () => {
  //Form Validation
  const { errors, handleSubmit, register, setError } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });

  //Password Visibility
  const [isCurrPasswordVisible, setIsCurrPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [
    isNewPasswordConfirmationVisible,
    setIsNewPasswordConfirmationVisible
  ] = useState(false);

  //Set the new password
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const handleChangePassword = async ({
    currPassword,
    newPassword
  }: FormData) => {
    //****Need to check the authenticity of old password before proceeding to changing the password*********/
    try {
      await setChangePassword(currPassword, newPassword).then(() =>
        setIsPasswordChanged(true)
      );
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      setError('serverError', 'invalid', error.response.data.message);
    }
  };

  //Update UI after saving password
  if (isPasswordChanged) {
    return (
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Password changed successfully !!
      </Alert>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleChangePassword)}>
        <FormControl fullWidth margin="normal">
          <Input
            name="currPassword"
            placeholder="Enter old password"
            inputProps={{ maxLength: 50 }}
            type={isCurrPasswordVisible ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <PasswordVisibilityButton
                  isVisible={isCurrPasswordVisible}
                  handleChange={(isVisible) =>
                    setIsCurrPasswordVisible(isVisible)
                  }
                />
              </InputAdornment>
            }
            inputRef={register}
          />
          {errors.currPassword && (
            <FormHelperText error>{errors.currPassword.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Input
            name="newPassword"
            placeholder="Enter new password"
            inputProps={{ maxLength: 50 }}
            type={isNewPasswordVisible ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <PasswordVisibilityButton
                  isVisible={isNewPasswordVisible}
                  handleChange={(isVisible) =>
                    setIsNewPasswordVisible(isVisible)
                  }
                />
              </InputAdornment>
            }
            inputRef={register}
          />
          {errors.newPassword && (
            <FormHelperText error>{errors.newPassword.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Input
            name="newPasswordConfirmation"
            placeholder="Enter new password again"
            inputProps={{ maxLength: 50 }}
            type={isNewPasswordConfirmationVisible ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <PasswordVisibilityButton
                  isVisible={isNewPasswordConfirmationVisible}
                  handleChange={(isVisible) =>
                    setIsNewPasswordConfirmationVisible(isVisible)
                  }
                />
              </InputAdornment>
            }
            inputRef={register}
          />
          {errors.newPasswordConfirmation && (
            <FormHelperText error>
              {errors.newPasswordConfirmation.message}
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
            <FormHelperText error>{errors.serverError.message}</FormHelperText>
          )}
        </FormControl>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withRouter(ProfileChangePassword));

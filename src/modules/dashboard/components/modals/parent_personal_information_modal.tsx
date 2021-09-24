import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  Typography,
} from '@material-ui/core';
import { Parent } from '../../../common/contracts/user';
import ContactWhite from '../../../../assets/svgs/contact-white.svg';
import Button from '../../../common/components/form_elements/button';
import Modal from '../../../common/components/modal';
import { useForm } from 'react-hook-form';
import { EMAIL_PATTERN } from '../../../common/validations/patterns';

interface Props {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Parent) => any;
  user: Parent;
}

interface FormData {
  emailId: string;
  parentName: string;
}

const ParentPersonalInformationModal: FunctionComponent<Props> = ({
  openModal,
  onClose,
  saveUser,
  user,
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const [email, setEmail] = useState(user && user.emailId ? user.emailId : '');
  const [parentName, setParentName] = useState(user && user.parentName ? user.parentName : '');

  const submitPersonalInformation = (e: React.FormEvent) => {
    e.preventDefault();

    if(!parentName){
      setError(
        'parentName',
        'Invalid Data',
        'Please enter Parent Name'
      );
      return;
    }
    else{
      clearError('parentName');
    }

    if(!EMAIL_PATTERN.test(email.toLowerCase())){
      setError(
        'emailId',
        'Invalid Data',
        'Invalid Email'
      );
      return;
    }
    else{
      clearError('emailId');
    }

    saveUser({
      ...user,
      emailId: email,
      parentName: parentName,
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
            <Typography component="span" color="secondary">
              <Box component="h3" color="white" fontWeight="400" margin="0">
                Personal Information
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >     

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box fontWeight="bold">
              Phone Number
            </Box>
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
            <Box fontWeight="bold">
              Parent Name
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
        <FormControl fullWidth margin="normal">
            <Input
              placeholder="Your Name"
              value={parentName}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setParentName(e.target.value)}
            />
          </FormControl>
          {errors.parentName && (
            <FormHelperText error>
              {errors.parentName.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box fontWeight="bold">
              Email Address
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Input
              placeholder="Your Email Address"
              value={email}
              inputProps={{ maxLength: 100 }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          {errors.emailId && (
            <FormHelperText error>
              {errors.emailId.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" marginTop="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={submitPersonalInformation}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default ParentPersonalInformationModal;

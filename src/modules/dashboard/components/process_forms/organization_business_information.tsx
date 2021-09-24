import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  //IconButton,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { PAN_PATTERN } from '../../../common/validations/patterns';
import {
  //Add as AddIcon,
  //RemoveCircle as RemoveCircleIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@material-ui/icons';
import moment from 'moment';
// import { DocumentType } from '../../../common/enums/document_type';
// import {
//   fetchUploadUrlForKycDocument,
//   uploadKycDocument,
// } from '../../../common/api/document';
import { Organization } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import CustomSelect from '../../../common/components/form_elements/custom_select';
// import Dropzone from '../../../common/components/dropzone/dropzone';
// import { KycDocument } from '../../../common/contracts/kyc_document';
import { Redirect } from 'react-router-dom';
import { BusinessType } from '../../../common/enums/business_types';
import { processPageStyles } from '../../../common/styles';
import { useForm } from 'react-hook-form';

interface FormData {
  pageError: string;
  businessType: string;
  dob: string;
  businessPAN: string;
  businessName: string;
  ownerPAN: string;
  ownerName: string;
}

interface Props extends WithStyles<typeof processPageStyles> {
  user: Organization;
  submitButtonText: string;
  saveUser: (data: Organization) => any;
}

enum Action {
  SKIP,
  SUBMIT
}

const OrganizationOtherInformation: FunctionComponent<Props> = ({
  classes,
  user,
  saveUser,
  submitButtonText
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  // const [documentType, setDocumentType] = useState(DocumentType.AADHAR);
  // const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  // const [dropzoneKey, setDropzoneKey] = useState(0);
  const [businessType, setBusinessType] = useState(user.businessType || '');
  const [dob, setDob] = useState(user.dob || '');
  const [businessPAN, setBusinessPAN] = useState(user.businessPAN || '');
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [ownerPAN, setOwnerPAN] = useState(user.ownerPAN || '');
  const [ownerName, setOwnerName] = useState(user.ownerName || '');

  // const [documents, setDocuments] = useState<KycDocument[]>(
  //   user.kycDetails || []
  // );
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  // const addDocument = async () => {
  //   if (droppedFiles.length < 1) return;

  //   const file = droppedFiles[0];

  //   const clonedDocuments = [...documents];
  //   const documentIndex = clonedDocuments.findIndex(
  //     (document) =>
  //       document.kycDocType.toLowerCase() === documentType.toLowerCase()
  //   );

  //   if (documentIndex > -1) {
  //     clonedDocuments.splice(documentIndex, 1);
  //   }

  //   setDocuments([
  //     ...clonedDocuments,
  //     {
  //       kycDocFormat: file.type,
  //       kycDocType: documentType,
  //       kycDocLocation: file.name,
  //     },
  //   ]);
  //   setDroppedFiles([]);
  //   setDropzoneKey(dropzoneKey + 1);

  //   const formData = new FormData();

  //   formData.append('document', file);

  //   try {
  //     const awsBucket = await fetchUploadUrlForKycDocument({
  //       fileName: file.name,
  //       contentType: file.type,
  //       contentLength: file.size,
  //     });

  //     await uploadKycDocument(awsBucket.url, formData);
  //   }
  //   catch(error){
  //     if (error.response?.status === 401) {
  //       setRedirectTo('/login');
  //     }
  //   }
  // };

  // const removeDocument = (index: number) => {
  //   const clonedDocuments = [...documents];

  //   clonedDocuments.splice(index, 1);

  //   setDocuments(clonedDocuments);
  // };

  const handleFormSubmit = async (action: Action) => {
    if (action === Action.SKIP) {
      // if(!PAN_PATTERN.test(ownerPAN)){
      //   setError(
      //     'emailId',
      //     'Invalid Data',
      //     'Invalid Email'
      //   );
      //   return;
      // }
      // else{
      //   clearError('emailId');
      // }
      saveUser(user);
      return;
    }

    //if(documents.length < 1) return;
    if (!businessType.length) {
      setError('businessType', 'Invalid Data', 'Business type cannot be empty');
      return;
    } else {
      clearError('businessType');
    }
    if (businessType.length < 3) {
      setError(
        'businessType',
        'Invalid Data',
        'Business type should be minimum 3 characters long'
      );
      return;
    } else {
      clearError('businessType');
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
        'Date of incorporation cannot be current or future date'
      );
      return;
    } else {
      clearError('dob');
    }

    if (!businessPAN.length) {
      setError('businessPAN', 'Invalid Data', 'Business PAN cannot be empty');
      return;
    } else {
      clearError('businessPAN');
    }
    if (!PAN_PATTERN.test(businessPAN)) {
      setError('businessPAN', 'Invalid Data', 'Invalid PAN data');
      return;
    } else {
      clearError('businessPAN');
    }

    if (!businessName.length) {
      setError('businessName', 'Invalid Data', 'Business name cannot be empty');
      return;
    } else {
      clearError('businessName');
    }
    if (businessName.length < 5) {
      setError(
        'businessName',
        'Invalid Data',
        'Business name should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('businessName');
    }

    if (!ownerPAN.length) {
      setError('ownerPAN', 'Invalid Data', 'Owner PAN cannot be empty');
      return;
    } else {
      clearError('ownerPAN');
    }
    if (!PAN_PATTERN.test(ownerPAN)) {
      setError('ownerPAN', 'Invalid Data', 'Invalid Owner PAN');
      return;
    } else {
      clearError('ownerPAN');
    }

    if (ownerPAN.toUpperCase() === businessPAN.toUpperCase()) {
      setError(
        'ownerPAN',
        'Invalid Data',
        'Business PAN and owner PAN could not be same'
      );
      return;
    } else {
      clearError('ownerPAN');
    }

    if (!ownerName.length) {
      setError('ownerName', 'Invalid Data', 'Owner Name cannot be empty');
      return;
    } else {
      clearError('ownerName');
    }
    if (ownerName.length < 5) {
      setError(
        'ownerName',
        'Invalid Data',
        'Owner name should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('ownerName');
    }

    saveUser({
      ...user,
      businessType: businessType,
      dob: dob,
      businessPAN: businessPAN,
      businessName: businessName,
      ownerPAN: ownerPAN,
      ownerName: ownerName
      //kycDetails: documents
    });
  };

  return (
    <div>
      <Box component="h2" className={classes.helperText}>
        Please enter correct details
      </Box>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Business Type</CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomSelect
              value={businessType}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setBusinessType(e.target.value as BusinessType)
              }
            >
              <MenuItem value={BusinessType.PVT_LTD}>Private Limited</MenuItem>
              <MenuItem value={BusinessType.PROPRIETORSHIP}>
                Proprietorship
              </MenuItem>
              <MenuItem value={BusinessType.PARTNERSHIP}>Partnership</MenuItem>
              <MenuItem value={BusinessType.PUBLIC_LTD}>
                Public Limited
              </MenuItem>
              <MenuItem value={BusinessType.LLP}>LLP</MenuItem>
              <MenuItem value={BusinessType.SOCIETY}>Society</MenuItem>
              <MenuItem value={BusinessType.TRUST}>Trust</MenuItem>
              <MenuItem value={BusinessType.NGO}>NGO</MenuItem>
              <MenuItem value={BusinessType.NOT_REG}>Not Registered</MenuItem>
            </CustomSelect>
          </FormControl>
          {errors.businessType && (
            <FormHelperText error>{errors.businessType.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Date Of Incorporation</CustomFormLabel>
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
            <CustomFormLabel>Business PAN</CustomFormLabel>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="PAN of the company"
              value={businessPAN}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => setBusinessPAN(e.target.value)}
            />
          </FormControl>
          {errors.businessPAN && (
            <FormHelperText error>{errors.businessPAN.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Business Name</CustomFormLabel>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="Business Name as per PAN"
              value={businessName}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </FormControl>
          {errors.businessName && (
            <FormHelperText error>{errors.businessName.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Owner PAN</CustomFormLabel>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="PAN of one of the directors"
              value={ownerPAN}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => setOwnerPAN(e.target.value)}
            />
          </FormControl>
          {errors.ownerPAN && (
            <FormHelperText error>{errors.ownerPAN.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Owner Name</CustomFormLabel>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomInput
              placeholder="Name as per PAN"
              value={ownerName}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </FormControl>
          {errors.ownerName && (
            <FormHelperText error>{errors.ownerName.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      {/* <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box fontWeight="bold" marginTop="5px">
              Document Type
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Select
              value={documentType}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setDocumentType(e.target.value as DocumentType)
              }
            >
              <MenuItem value={DocumentType.PAN}>PAN Card</MenuItem>
              <MenuItem value={DocumentType.AADHAR}>Aadhar Card</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box fontWeight="bold" marginTop="5px">
              Upload
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Dropzone
              key={dropzoneKey}
              acceptedFiles={['image/jpeg', 'image/png']}
              maxFileSize={104857600} // 100 MB
              files={droppedFiles}
              onChange={(files) => setDroppedFiles(files)}
              onRemoveItem={(file, index) => setDroppedFiles([])}
            />
          </FormControl>
        </Grid>
      </Grid>

      <FormControl fullWidth margin="normal">
        <Box display="flex" justifyContent="flex-end">
          <Button
            disableElevation
            color="secondary"
            size="small"
            variant="contained"
            onClick={addDocument}
          >
            <AddIcon /> Add
          </Button>
        </Box>
      </FormControl>

      <Grid container>
        <Grid item xs={12} md={4}></Grid>

        <Grid item xs={12} md={8}>
          <Box>
            {documents.map((document, index) => (
              <Box display="flex" justifyContent="space-between">
                <Box component="h4" style={{ textTransform: 'uppercase' }}>
                  {document.kycDocType}
                </Box>

                <IconButton size="small" onClick={() => removeDocument(index)}>
                  <RemoveCircleIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid> */}

      <Box display="flex" justifyContent="flex-end" marginY="20px">
        <Box className={classes.previousBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setRedirectTo('/profile/org/process/2')}
          >
            <KeyboardArrowLeftIcon /> Previous
          </Button>
        </Box>

        {/* <Box className={classes.skipBtn}>
          <Button
            disableElevation
            variant="outlined"
            color="default"
            size="large"
            onClick={() => handleFormSubmit(Action.SKIP)}
          >
            Skip for now
          </Button>
        </Box> */}

        <Box className={classes.finishBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleFormSubmit(Action.SUBMIT)}
          >
            {submitButtonText}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(processPageStyles)(OrganizationOtherInformation);

import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  MenuItem
} from '@material-ui/core';
import {
  Add as AddIcon,
  RemoveCircle as RemoveCircleIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { DocumentType } from '../../../common/enums/document_type';
import {
  fetchUploadUrlForKycDocument,
  uploadKycDocument
} from '../../../common/api/document';
import { Tutor } from '../../../common/contracts/user';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomSelect from '../../../common/components/form_elements/custom_select';
import Dropzone from '../../../common/components/dropzone/dropzone';
import { exceptionTracker } from '../../../common/helpers';
import { processPageStyles } from '../../../common/styles';
import { KycDocument } from '../../../common/contracts/kyc_document';
import { Redirect } from 'react-router-dom';

interface Props extends WithStyles<typeof processPageStyles> {
  user: Tutor;
  submitButtonText: string;
  saveUser: (data: Tutor) => any;
}

enum Action {
  SKIP,
  SUBMIT
}

const TutorOtherInformation: FunctionComponent<Props> = ({
  classes,
  user,
  saveUser,
  submitButtonText
}) => {
  const [documentType, setDocumentType] = useState(DocumentType.AADHAR);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [documents, setDocuments] = useState<KycDocument[]>(
    user.kycDetails || []
  );
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const addDocument = async () => {
    if (droppedFiles.length < 1) return;

    const file = droppedFiles[0];

    const clonedDocuments = [...documents];
    const documentIndex = clonedDocuments.findIndex(
      (document) =>
        document.kycDocType.toLowerCase() === documentType.toLowerCase()
    );

    if (documentIndex > -1) {
      clonedDocuments.splice(documentIndex, 1);
    }

    setDocuments([
      ...clonedDocuments,
      {
        kycDocFormat: file.type,
        kycDocType: documentType,
        kycDocLocation: file.name
      }
    ]);
    setDroppedFiles([]);
    setDropzoneKey(dropzoneKey + 1);

    const formData = new FormData();

    formData.append('document', file);

    try {
      const awsBucket = await fetchUploadUrlForKycDocument({
        fileName: file.name,
        contentType: file.type,
        contentLength: file.size
      });

      await uploadKycDocument(awsBucket.url, formData);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const removeDocument = (index: number) => {
    const clonedDocuments = [...documents];

    clonedDocuments.splice(index, 1);

    setDocuments(clonedDocuments);
  };

  const handleFormSubmit = async (action: Action) => {
    if (action === Action.SKIP) {
      saveUser(user);
      return;
    }

    if (documents.length < 1) return;

    saveUser({ ...user, kycDetails: documents });
  };

  return (
    <div>
      <Box component="h2" className={classes.helperText}>
        Please upload your documents
      </Box>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Document Type</CustomFormLabel>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <CustomSelect
              value={documentType}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setDocumentType(e.target.value as DocumentType)
              }
            >
              <MenuItem value={DocumentType.PAN}>PAN Card</MenuItem>
              <MenuItem value={DocumentType.AADHAR}>Aadhar Card</MenuItem>
            </CustomSelect>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <CustomFormLabel>Upload</CustomFormLabel>
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
            color="primary"
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
          <Box className={classes.docList}>
            {documents.map((document, index) => (
              <Box display="flex" justifyContent="space-between" key={index}>
                <Box component="h4" style={{ textTransform: 'uppercase' }}>
                  {document.kycDocType}
                </Box>

                <IconButton size="small" onClick={() => removeDocument(index)}>
                  <RemoveCircleIcon className={classes.removeIcon} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" marginY="20px">
        <Box className={classes.previousBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setRedirectTo('/profile/process/2')}
          >
            <KeyboardArrowLeftIcon /> Previous
          </Button>
        </Box>

        <Box className={classes.skipBtn}>
          <Button
            disableElevation
            variant="outlined"
            color="default"
            size="large"
            onClick={() => handleFormSubmit(Action.SKIP)}
          >
            Skip for now
          </Button>
        </Box>

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

export default withStyles(processPageStyles)(TutorOtherInformation);

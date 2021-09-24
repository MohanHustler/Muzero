import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Typography
} from '@material-ui/core';
import {
  Add as AddIcon,
  RemoveCircle as RemoveCircleIcon,
  Visibility as ViewIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { DocumentType } from '../../../common/enums/document_type';
import {
  fetchUploadUrlForKycDocument,
  uploadKycDocument
} from '../../../common/api/document';
import { KycDocument } from '../../../common/contracts/kyc_document';
import { Tutor } from '../../../common/contracts/user';
import Dropzone from '../../../common/components/dropzone/dropzone';
import IdCardWhite from '../../../../assets/images/id-card-white.png';
import Button from '../../../common/components/form_elements/button';
import CustomFormLabel from '../../../common/components/form_elements/custom_form_label';
import CustomInput from '../../../common/components/form_elements/custom_input';
import CustomSelect from '../../../common/components/form_elements/custom_select';
import Modal from '../../../common/components/modal';
import { exceptionTracker } from '../../../common/helpers';
import { profileModalStyles } from '../../../common/styles';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  AADHAAR_PATTERN,
  PAN_PATTERN,
  IFSC_PATTERN,
  ACCOUNT_NO_PATTERN
} from '../../../common/validations/patterns';

interface Props extends WithStyles<typeof profileModalStyles> {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Tutor) => any;
  user: Tutor;
}

interface FormData {
  document: string;
  documentNumber: string;
  bankAccount: string;
  bankIfsc: string;
}

const TutorOtherInformationModal: FunctionComponent<Props> = ({
  classes,
  openModal,
  onClose,
  saveUser,
  user
}) => {
  const [documentType, setDocumentType] = useState(DocumentType.AADHAR);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [documents, setDocuments] = useState<KycDocument[]>(
    user.kycDetails || []
  );
  const [documentNumber, setDocumentNumber] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [currentBankDetails, setCurrentBankDetails] = useState({
    accountNo: '',
    ifsc: ''
  });
  const [redirectTo, setRedirectTo] = useState('');
  const { errors, setError, clearError } = useForm<FormData>();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const addDocument = async () => {
    // if (droppedFiles.length < 1) return;

    if (!droppedFiles.length) {
      console.log('called');
      setError('document', 'Invalid document', 'Please upload document');
      return;
    } else {
      clearError('document');
    }

    if (documentType === DocumentType.AADHAR) {
      if (!aadhaar.length) {
        setError(
          'documentNumber',
          'Invalid aadhaar number',
          'Please enter aadhaar number'
        );
        return;
      } else {
        clearError('documentNumber');
      }
      // aadhar number with four digit space
      if (!AADHAAR_PATTERN.test(aadhaar)) {
        setError(
          'documentNumber',
          'Invalid aadhaar number',
          'Invalid aadhaar number'
        );
        return;
      } else {
        clearError('documentNumber');
      }
    }

    if (documentType === DocumentType.PAN) {
      if (!pan.length) {
        setError(
          'documentNumber',
          'Invalid pan number',
          'Please enter pan number'
        );
        return;
      } else {
        clearError('documentNumber');
      }
      if (!PAN_PATTERN.test(pan)) {
        setError('documentNumber', 'Invalid pan number', 'Invalid pan number');
        return;
      } else {
        clearError('documentNumber');
      }
    }
    if (documentType === DocumentType.BANK) {
      if (!bankAccount.length) {
        setError(
          'bankAccount',
          'Invalid account number',
          'Please enter bank account number'
        );
        return;
      } else {
        clearError('bankAccount');
      }
      if (!ACCOUNT_NO_PATTERN.test(bankAccount)) {
        setError(
          'bankAccount',
          'Invalid account number',
          'Invalid account number'
        );
        return;
      } else {
        clearError('bankAccount');
      }
      if (!bankIfsc.length) {
        setError('bankIfsc', 'Invalid IFSC code', 'Please enter IFSC code');
        return;
      } else {
        clearError('bankIfsc');
      }
      if (!IFSC_PATTERN.test(bankIfsc)) {
        setError('bankIfsc', 'Invalid IFSC code', 'Invalid IFSC code');
        return;
      } else {
        clearError('bankIfsc');
      }
    }
    /******** */
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
    setDocumentNumber('');
    if (bankAccount && bankIfsc) {
      setCurrentBankDetails({ accountNo: bankAccount, ifsc: bankIfsc });
    }
    setBankAccount('');
    setBankIfsc('');
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

  const setParticularDocumentNumber = (docNo: string) => {
    switch (documentType) {
      case DocumentType.AADHAR: {
        setAadhaar(docNo);
        break;
      }
      case DocumentType.PAN: {
        setPan(docNo);
        break;
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length < 1) return;

    onClose();

    saveUser({
      ...user,
      kycDetails: documents,
      aadhaar: aadhaar ? aadhaar : undefined,
      pan: pan ? pan : undefined,
      bankAccount: currentBankDetails.accountNo
        ? currentBankDetails.accountNo
        : undefined,
      bankIfsc: currentBankDetails.ifsc ? currentBankDetails.ifsc : undefined
    });
  };

  return (
    <Modal
      open={openModal}
      handleClose={onClose}
      header={
        <Box display="flex" alignItems="center">
          <img src={IdCardWhite} alt="Other Information" />

          <Box marginLeft="15px">
            <Typography component="span" color="primary">
              <Box component="h3" className={classes.modalHeading}>
                Other Details
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <div>
        <Grid container>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={9}>
            <Box component="h2" fontWeight="bold">
              Please enter correct details
            </Box>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              <CustomFormLabel>Document Type</CustomFormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={9}>
            <FormControl fullWidth margin="normal">
              <CustomSelect
                value={documentType}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setDocumentType(e.target.value as DocumentType);
                  setDocumentNumber('');
                }}
              >
                <MenuItem value={DocumentType.PAN}>PAN Card</MenuItem>
                <MenuItem value={DocumentType.AADHAR}>Aadhar Card</MenuItem>
                <MenuItem value={DocumentType.BANK}>Bank Details</MenuItem>
              </CustomSelect>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth margin="normal">
              {documentType === DocumentType.BANK ? (
                <CustomFormLabel>Upload cancelled cheque leaf</CustomFormLabel>
              ) : (
                <CustomFormLabel>Upload</CustomFormLabel>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={9}>
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
            {errors.document && (
              <FormHelperText error>{errors.document.message}</FormHelperText>
            )}
          </Grid>
        </Grid>
        {documentType !== DocumentType.BANK && (
          <div>
            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <CustomFormLabel>{documentType} number</CustomFormLabel>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <CustomInput
                    required
                    value={documentNumber}
                    placeholder={`Your ${documentType} number`}
                    onChange={(e) => {
                      setDocumentNumber(e.target.value);
                      setParticularDocumentNumber(e.target.value);
                    }}
                  />
                </FormControl>
                {errors.documentNumber && (
                  <FormHelperText error>
                    {errors.documentNumber.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </div>
        )}

        {documentType === DocumentType.BANK && (
          <div>
            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <CustomFormLabel>Bank account number</CustomFormLabel>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <CustomInput
                    required
                    value={bankAccount}
                    placeholder={`Your bank account number`}
                    onChange={(e) => {
                      setBankAccount(e.target.value);
                    }}
                  />
                </FormControl>
                {errors.bankAccount && (
                  <FormHelperText error>
                    {errors.bankAccount.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <CustomFormLabel>IFSC code</CustomFormLabel>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <CustomInput
                    required
                    value={bankIfsc}
                    placeholder={`Your bank IFSC code`}
                    onChange={(e) => {
                      setBankIfsc(e.target.value);
                    }}
                  />
                </FormControl>
                {errors.bankIfsc && (
                  <FormHelperText error>
                    {errors.bankIfsc.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </div>
        )}

        <FormControl fullWidth margin="normal">
          <Box
            display="flex"
            justifyContent="flex-end"
            className={classes.addBtn}
          >
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
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={9}>
            <Box className={classes.docList}>
              {documents.map((document, index) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  key={index}
                >
                  <Box component="h4" style={{ textTransform: 'uppercase' }}>
                    {document.kycDocType}
                  </Box>
                  <Box>
                    <IconButton size="small" className={classes.iconBtn}>
                      <ViewIcon className={classes.viewIcon} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeDocument(index)}
                    >
                      <RemoveCircleIcon className={classes.removeIcon} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box className={classes.submitBtn}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            size="large"
            onClick={handleFormSubmit}
          >
            Save Changes
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default withStyles(profileModalStyles)(TutorOtherInformationModal);

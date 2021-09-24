import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  Divider,
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
import moment from 'moment';
import { DocumentType } from '../../../common/enums/document_type';
import {
  fetchUploadUrlForKycDocument,
  uploadKycDocument
} from '../../../common/api/document';
import { KycDocument } from '../../../common/contracts/kyc_document';
import { Organization } from '../../../common/contracts/user';
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
import { BusinessType } from '../../../common/enums/business_types';
import {
  AADHAAR_PATTERN,
  IFSC_PATTERN,
  PAN_PATTERN,
  ACCOUNT_NO_PATTERN
} from '../../../common/validations/patterns';
import { isGstValid } from '../../../common/helpers';

interface FormData {
  pageError: string;
  businessType: string;
  dob: string;
  businessPAN: string;
  businessName: string;
  ownerPAN: string;
  ownerName: string;
  documentNumber: string;
  bankAccount: string;
  bankIfsc: string;
  gstin: string;
}

interface Props extends WithStyles<typeof profileModalStyles> {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Organization) => any;
  user: Organization;
}

const OrganizationBusinessInformationModal: FunctionComponent<Props> = ({
  classes,
  openModal,
  onClose,
  saveUser,
  user
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const [documentType, setDocumentType] = useState(DocumentType.AADHAR);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [documents, setDocuments] = useState<KycDocument[]>(
    user.kycDetails || []
  );
  const [businessType, setBusinessType] = useState(user.businessType || '');
  const [dob, setDob] = useState(user.dob || '');
  const [businessPAN, setBusinessPAN] = useState(user.businessPAN || '');
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [ownerPAN, setOwnerPAN] = useState(user.ownerPAN || '');
  const [ownerName, setOwnerName] = useState(user.ownerName || '');
  const [gstin, setGstin] = useState(user.gstin || '');
  const [aadhaar, setAadhaar] = useState('');
  const [currentAadhaarNo, setCurrentAadhaarNo] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [currentBankDetails, setCurrentBankDetails] = useState({
    accountNo: '',
    ifsc: ''
  });
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const addDocument = async () => {
    if (droppedFiles.length < 1) return;

    if (aadhaar !== '') {
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

    if (documentType === DocumentType.BANK) {
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
      if (!IFSC_PATTERN.test(bankIfsc)) {
        setError('bankIfsc', 'Invalid IFSC code', 'Invalid IFSC code');
        return;
      } else {
        clearError('bankIfsc');
      }
    }

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
    if (aadhaar) {
      setCurrentAadhaarNo(aadhaar);
    }
    if (bankAccount && bankIfsc) {
      setCurrentBankDetails({ accountNo: bankAccount, ifsc: bankIfsc });
    }

    setBankAccount('');
    setBankIfsc('');
    setAadhaar('');
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

  const handleFormSubmit = async () => {
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
      setError('businessPAN', 'Invalid Data', 'Invalid business PAN data');
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
      setError('ownerPAN', 'Invalid Data', 'Invalid owner PAN data');
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
      setError('ownerName', 'Invalid Data', 'Owner name cannot be empty');
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
    if (!gstin.length) {
      setError('gstin', 'Invalid Data', 'GSTIN cannot be empty');
      return;
    } else {
      clearError('gstin');
    }
    if (!isGstValid(gstin)) {
      setError('gstin', 'Invalid data', 'Invalid data');
      return;
    } else {
      clearError('gstin');
    }

    saveUser({
      ...user,
      businessType: businessType,
      dob: dob,
      businessPAN: businessPAN,
      businessName: businessName,
      ownerPAN: ownerPAN,
      ownerName: ownerName,
      kycDetails: documents,
      gstin: gstin,
      aadhaar: currentAadhaarNo ? currentAadhaarNo : undefined,
      bankAccount: currentBankDetails.accountNo
        ? currentBankDetails.accountNo
        : undefined,
      bankIfsc: currentBankDetails.ifsc ? currentBankDetails.ifsc : undefined
    });

    onClose();
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
                Other Information
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
        <Box marginBottom="20px">
          <Typography component="span" color="secondary">
            <Box component="h3" color="primary" fontWeight="400" margin="0">
              Mandatory
            </Box>
          </Typography>
          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Business Type</CustomFormLabel>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={9}>
              <FormControl fullWidth margin="normal">
                <CustomSelect
                  value={businessType}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                    setBusinessType(e.target.value as BusinessType)
                  }
                >
                  <MenuItem value={BusinessType.PVT_LTD}>
                    Private Limited
                  </MenuItem>
                  <MenuItem value={BusinessType.PROPRIETORSHIP}>
                    Proprietorship
                  </MenuItem>
                  <MenuItem value={BusinessType.PARTNERSHIP}>
                    Partnership
                  </MenuItem>
                  <MenuItem value={BusinessType.PUBLIC_LTD}>
                    Public Limited
                  </MenuItem>
                  <MenuItem value={BusinessType.LLP}>LLP</MenuItem>
                  <MenuItem value={BusinessType.SOCIETY}>Society</MenuItem>
                  <MenuItem value={BusinessType.TRUST}>Trust</MenuItem>
                  <MenuItem value={BusinessType.NGO}>NGO</MenuItem>
                  <MenuItem value={BusinessType.NOT_REG}>
                    Not Registered
                  </MenuItem>
                </CustomSelect>
              </FormControl>
              {errors.businessType && (
                <FormHelperText error>
                  {errors.businessType.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Date Of Incorporation</CustomFormLabel>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={9}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Business PAN</CustomFormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="PAN of the company"
                  value={businessPAN}
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => setBusinessPAN(e.target.value)}
                />
              </FormControl>
              {errors.businessPAN && (
                <FormHelperText error>
                  {errors.businessPAN.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Business Name</CustomFormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="Business Name as per PAN"
                  value={businessName}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </FormControl>
              {errors.businessName && (
                <FormHelperText error>
                  {errors.businessName.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>GSTIN</CustomFormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="GST number"
                  value={gstin}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </FormControl>
              {errors.gstin && (
                <FormHelperText error>{errors.gstin.message}</FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Owner PAN</CustomFormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal">
                <CustomFormLabel>Owner Name</CustomFormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <FormControl fullWidth margin="normal">
                <CustomInput
                  placeholder="Name as per PAN"
                  value={ownerName}
                  inputProps={{ maxLength: 50 }}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </FormControl>
              {errors.ownerName && (
                <FormHelperText error>
                  {errors.ownerName.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Typography component="span" color="secondary">
          <Box
            component="h3"
            color="primary"
            fontWeight="400"
            margin="0"
            marginTop="20px"
          >
            Optional
          </Box>
        </Typography>
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
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  setDocumentType(e.target.value as DocumentType)
                }
              >
                <MenuItem value={DocumentType.BUSINESS_PAN}>
                  Business PAN Card
                </MenuItem>
                <MenuItem value={DocumentType.OWNER_PAN}>
                  Owner PAN Card
                </MenuItem>
                <MenuItem value={DocumentType.GST}>GST Certificate</MenuItem>
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
          </Grid>
        </Grid>
        {documentType === DocumentType.AADHAR && (
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
                    value={aadhaar}
                    placeholder={`Your ${documentType} number`}
                    onChange={(e) => {
                      setAadhaar(e.target.value);
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

export default withStyles(profileModalStyles)(
  OrganizationBusinessInformationModal
);

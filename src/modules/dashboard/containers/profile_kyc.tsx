import React, { FunctionComponent, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { setAuthUser } from '../../auth/store/actions';
import { useSnackbar } from 'notistack';
import { RootState } from '../../../store';
import { Tutor, Organization } from '../../common/contracts/user';
import { isTutor, isOrganization } from '../../common/helpers';
import Dropzone from '../../common/components/dropzone/dropzone';
import Button from '../../common/components/form_elements/button';
import { Box, FormControl, Grid, Input } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { Alert, AlertTitle } from '@material-ui/lab';
import TutorLayout from '../components/tutor_layout';
import OrganizationLayout from '../components/organization_layout';
import { DocumentType } from '../../common/enums/document_type';
import { KycDocument } from '../../common/contracts/kyc_document';
import KycStepsModal from '../components/modals/kyc-steps-modal';
import { exceptionTracker } from '../../common/helpers';
import {
  fetchUploadUrlForKycDocument,
  uploadAadhaarZip,
  uploadKycDocument
} from '../../common/api/document';

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: Tutor | Organization;
}

const ProfileKyc: FunctionComponent<Props> = ({ authUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [aadhaarKycShareCode, setAadhaarKycShareCode] = useState('');
  const [aadhaarKycStatus, setAadhaarKycStatus] = useState(
    authUser.aadhaarKycStatus || ''
  );
  const [document, setDocument] = useState<KycDocument[]>([]);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [redirectTo, setRedirectTo] = useState('');

  const [mobile, setMobile] = useState('');
  const [lastDigit, setLastDigit] = useState('');
  const [openKycStepsModal, setOpenKycStepsModal] = useState(false);

  const dispatch = useDispatch();

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const createFormData = (user: Tutor | Organization, file: File) => {
    const formData = new FormData();
    const toExclude = [
      'kycDetails',
      'courseDetails',
      'package',
      'scheduleList',
      'batchList',
      'studentList',
      'tutorList'
    ];
    for (const [k, v] of Object.entries(user)) {
      if (!toExclude.includes(k)) formData.append(k, v);
    }
    formData.append('shareCode', aadhaarKycShareCode);
    formData.append('mobile', mobile);
    formData.append('lastDigit', lastDigit);
    formData.append('files', file);
    return formData;
  };

  const processZip = async () => {
    const file = droppedFiles[0];
    const user = Object.assign({}, authUser, {
      aadhaarKycZip: await toBase64(droppedFiles[0]),
      aadhaarKycShareCode: aadhaarKycShareCode
    });

    const profileUpdated = (profile: Tutor | Organization) =>
      dispatch(setAuthUser(profile));

    const formData = createFormData(user, file);

    try {
      await uploadAadhaarZip(formData).then(async (value) => {
        user.aadhaarKycStatus = value.message;
        profileUpdated(user);
        setAadhaarKycStatus(value.message);
      });
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) setRedirectTo('/login');
      setAadhaarKycStatus('Rejected');
    }
  };

  const storeZip = async () => {
    const file = droppedFiles[0];

    setDocument([
      {
        kycDocFormat: file.type,
        kycDocType: DocumentType.AADHAR_ZIP,
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
      console.log(error);
    }
  };

  const handleFormSubmit = async () => {
    if (droppedFiles.length < 1) {
      enqueueSnackbar('No zip file selected', {
        variant: 'error'
      });
      return;
    }
    // Store zip input in s3 bucket
    //storeZip();

    // Process Zip in backend and then save the user
    processZip();
  };

  const alertKycStatus = () => {
    return (
      <div>
        <Alert severity={aadhaarKycStatus === 'Verified' ? 'success' : 'error'}>
          <AlertTitle>{aadhaarKycStatus}</AlertTitle>
          Your KYC status is {aadhaarKycStatus} <br /> <br />
          {aadhaarKycStatus === 'Verified' ? '' : 'Enter correct details !!'}
        </Alert>

        {/* {aadhaarKycStatus === 'Rejected' && */}
        <Box display="flex" justifyContent="center" marginY="20px">
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => {
              setAadhaarKycStatus('');
            }}
          >
            Redo KYC process
          </Button>
        </Box>
        {/*}*/}
      </div>
    );
  };

  const toRenderKyc = () => {
    return (
      <div>
        {aadhaarKycStatus === '' && (
          <div>
            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <Box fontWeight="bold" marginTop="5px">
                    Upload Aadhaar Kyc Zip File
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <Dropzone
                    maxFileSize={102400} // 100 KB
                    acceptedFiles={[
                      'application/zip,application/zip-compressed,application/x-zip-compressed'
                    ]}
                    files={droppedFiles}
                    onChange={(files) => {
                      setDroppedFiles(files);
                    }}
                    onRemoveItem={() => setDroppedFiles([])}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <Box fontWeight="bold" marginTop="5px">
                    Share Code
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <Input
                    placeholder="Enter share code"
                    required
                    value={aadhaarKycShareCode}
                    onChange={(e) => setAadhaarKycShareCode(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <Box fontWeight="bold" marginTop="5px">
                    Mobile number
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <Input
                    placeholder="Enter mobile mumber(as given in aadhaar card)"
                    required
                    value={mobile}
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth margin="normal">
                  <Box fontWeight="bold" marginTop="5px">
                    Last digit of aadhaar number
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={9}>
                <FormControl fullWidth margin="normal">
                  <Input
                    placeholder="Enter last digit of aadhaar number"
                    required
                    value={lastDigit}
                    inputProps={{ maxLength: 1 }}
                    onChange={(e) => setLastDigit(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" marginY="20px">
              <Box
                display="flex"
                alignItems="center"
                fontSize="16px"
                marginRight="40px"
                onClick={() => setOpenKycStepsModal(true)}
              >
                Help
                <Box marginLeft="6px">
                  <HelpIcon />
                </Box>
              </Box>
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleFormSubmit}
              >
                Save Changes
              </Button>
            </Box>
          </div>
        )}
        {aadhaarKycStatus !== '' && alertKycStatus()}
      </div>
    );
  };

  if (isTutor(authUser)) {
    return (
      <Box>
        <TutorLayout profile={authUser}>{toRenderKyc()}</TutorLayout>
        <KycStepsModal
          openModal={openKycStepsModal}
          onClose={() => setOpenKycStepsModal(false)}
        />
      </Box>
    );
  }

  if (isOrganization(authUser)) {
    return (
      <Box>
        <OrganizationLayout profile={authUser}>
          {toRenderKyc()}
        </OrganizationLayout>
        <KycStepsModal
          openModal={openKycStepsModal}
          onClose={() => setOpenKycStepsModal(false)}
        />
      </Box>
    );
  }

  return <div></div>;
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as Tutor | Organization
});
export default connect(mapStateToProps)(withRouter(ProfileKyc));

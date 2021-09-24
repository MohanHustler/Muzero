import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepButton,
  Button
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '../../../common/components/modal';
import AadharImage from '../../../../assets/images/aadhar-number.png';
import CaptchaImage from '../../../../assets/images/security-code.png';
import ShareCodeImage from '../../../../assets/images/share-code.png';
import OtpImage from '../../../../assets/images/otp-totp.png';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',

    '& .MuiStepConnector-lineHorizontal': {
      padding: '0 20px'
    },

    '& .MuiStepper-root': {
      padding: '24px 0'
    }
  },
  button: {
    marginRight: theme.spacing(1)
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },

  modalHeading: {
    fontWeight: 500,
    fontSize: '22px',
    letterSpacing: '1px',
    color: '#ffffff',
    margin: '0px'
  },
  kycSteps: {
    '& p': {
      marginBottom: '15px',
      color: '#212121',
      fontSize: '15px'
    },
    '& img': {
      border: '1px dashed #DDDDDD',
      borderRadius: '5px',
      marginBottom: '15px'
    }
  }
}));

interface Props {
  openModal: boolean;
  onClose: () => any;
}

const KycStepsModal: FunctionComponent<Props> = ({ openModal, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const steps = getSteps();

  const classes = useStyles();

  function getSteps() {
    return ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Box className={classes.kycSteps}>
            <Typography>
              Click this link to visit{' '}
              <a
                href="https://resident.uidai.gov.in/offline-kyc"
                target="_blank"
              >
                https://resident.uidai.gov.in/offline-kyc
              </a>{' '}
            </Typography>
            <Typography>
              Download a ZIP file containing the Resident's Paperless Offline
              eKYC.
            </Typography>
            <Typography>To know more follow the steps</Typography>
          </Box>
        );
      case 1:
        return (
          <Box className={classes.kycSteps}>
            <img src={AadharImage} alt="Aadhar number" />
            <Typography>
              Enter your 12 digit Aadhaar number or 16 digit Virtual ID to
              begin.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box className={classes.kycSteps}>
            <img src={CaptchaImage} alt="Aadhar number" />
            <Typography>
              Enter Security Code (or) Captcha & Press Send OTP button
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box className={classes.kycSteps}>
            <img src={ShareCodeImage} alt="Aadhar number" />
            <Typography>
              Create a Share Code for your Paperless Offline eKYC
            </Typography>
            <Typography>
              Create a password of 4 Characters to secure your Paperless Offline
              eKYC.
            </Typography>
            <Typography>
              Remember this password to unlock your ZIP file
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Box className={classes.kycSteps}>
            <img src={OtpImage} alt="Aadhar number" />
            <Typography>
              Enter your OTP & Press Download button to get you Aadhar ZIP file
            </Typography>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  }

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Modal
      open={openModal}
      handleClose={onClose}
      header={
        <Box display="flex" alignItems="center">
          <Box marginLeft="15px">
            <Typography component="span" color="primary">
              <Box component="h3" className={classes.modalHeading}>
                Aadhar Kyc Steps
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <div className={classes.root}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={handleStep(index)}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          <Typography className={classes.instructions}>
            {getStepContent(activeStep)}
          </Typography>
          <Box marginTop="30px">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
              variant="outlined"
              color="primary"
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
            >
              Next
            </Button>
          </Box>
        </div>
      </div>
    </Modal>
  );
};

export default KycStepsModal;

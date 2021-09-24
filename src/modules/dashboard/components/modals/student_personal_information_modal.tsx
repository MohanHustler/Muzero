import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AutocompleteOption } from '../../../common/contracts/autocomplete_option';
import {
  fetchBoardsList,
  fetchClassesList,
  fetchCitySchoolsList,
  fetchCitiesByPinCode
} from '../../../common/api/academics';
import { Student } from '../../../common/contracts/user';
import ContactWhite from '../../../../assets/svgs/contact-white.svg';
import Button from '../../../common/components/form_elements/button';
import Modal from '../../../common/components/modal';
import { exceptionTracker } from '../../../common/helpers';
import { Standard } from '../../../academics/contracts/standard';
import { Board } from '../../../academics/contracts/board';
import { useForm } from 'react-hook-form';
import {
  EMAIL_PATTERN,
  PIN_PATTERN
} from '../../../common/validations/patterns';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#ffffff',
      margin: '0px'
    },
    label: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '19px',
      color: '#1C2559',
      marginTop: '5px'
    },
    formInput: {
      lineHeight: '26px',
      color: '#151522',

      '& input::placeholder': {
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '18px',
        color: 'rgba(0, 0, 0, 0.54)'
      }
    },
    submitBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '30px',

      '& button': {
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '21px',
        letterSpacing: '1px',
        padding: '14px 24px'
      }
    }
  })
);

interface Props {
  openModal: boolean;
  onClose: () => any;
  saveUser: (user: Student) => any;
  user: Student;
}

interface FormData {
  emailId: string;
  boardName: string;
  className: string;
  schoolName: string;
  cityName: string;
  pinCode: string;
  stateName: string;
}

const StudentPersonalInformationModal: FunctionComponent<Props> = ({
  openModal,
  onClose,
  saveUser,
  user
}) => {
  const { errors, setError, clearError } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [email, setEmail] = useState(user && user.emailId ? user.emailId : '');
  const [board, setBoard] = useState(user.boardName ? user.boardName : '');
  const [className, setClassName] = useState(
    user.className ? user.className : ''
  );
  const [school, setSchool] = useState<AutocompleteOption | null>(
    user.schoolName && user.schoolName.length > 0
      ? { title: user.schoolName, value: user.schoolName }
      : null
  );
  const [pinCode, setPinCode] = useState(user.pinCode || '');
  const [cityName, setCityName] = useState(user.cityName || '');
  const [stateName, setStateName] = useState(user.stateName || '');
  const [schoolsList, setSchoolsList] = useState<AutocompleteOption[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [classes, setClasses] = useState<Standard[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  const styles = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const [boardsList, classesList] = await Promise.all([
          fetchBoardsList(),
          fetchClassesList({ boardname: board })
        ]);
        setBoards(boardsList);
        setClasses(classesList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [board]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  // const TypeOther = () => (
  //   <FormControl fullWidth margin="normal">
  //     <Input placeholder="Others" />
  //   </FormControl>
  // );

  const setBoardAndFetchClasses = async (board: string) => {
    try {
      setBoard(board);
      if (board.length > 1) {
        const classListResponse = await fetchClassesList({ boardname: board });
        setClasses(classListResponse);
      } else {
        setClasses([]);
      }
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  //PIN Code based city and state selection
  const onPinCodeChange = async (pin: string) => {
    setPinCode(pin);
    if (PIN_PATTERN.test(pin)) {
      try {
        const getCityArr = await fetchCitiesByPinCode({ pinCode: pin });
        setCityName(getCityArr[0].cityName);
        setStateName(getCityArr[0].stateName);

        const schoolsListResponse = await fetchCitySchoolsList({
          cityName: getCityArr[0].cityName
        });

        const structuredSchoolsList = schoolsListResponse.map((school) => ({
          title: `${school.schoolName} (${school.schoolAddress})`,
          value: school.schoolName
        }));

        setSchool(null);
        setSchoolsList([
          ...structuredSchoolsList,
          { title: 'Other', value: 'Other' }
        ]);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        } else {
          enqueueSnackbar('Service not available in this area', {
            variant: 'error'
          });
          setPinCode('');
          setCityName('');
          setStateName('');
          setSchoolsList([]);
        }
      }
    } else {
      setCityName('');
      setStateName('');
      setSchoolsList([]);
    }
  };

  const submitPersonalInformation = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.length > 0) {
      if (!EMAIL_PATTERN.test(email.toLowerCase())) {
        setError('emailId', 'Invalid Data');
        return;
      }
    } else {
      clearError('emailId');
    }

    if (board.length < 1) {
      setError('boardName', 'Invalid Data', 'Board cannot be empty');
      return;
    } else {
      clearError('boardName');
    }

    if (className.length < 1) {
      setError('className', 'Invalid Data', 'Class cannot be empty');
      return;
    } else {
      clearError('className');
    }

    if (school === null || !school.value.length) {
      setError('schoolName', 'Invalid Data', 'school name cannot be empty');
      return;
    } else {
      clearError('schoolName');
    }
    if (school && school.value.length < 5) {
      setError(
        'schoolName',
        'Invalid Data',
        'school name should be minimum 5 characters long'
      );
      return;
    } else {
      clearError('schoolName');
    }

    if (!pinCode.length) {
      setError('pinCode', 'Invalid Data', 'Pin Code cannot be empty');
      return;
    } else {
      clearError('pinCode');
    }

    if (!PIN_PATTERN.test(pinCode)) {
      setError('pinCode', 'Invalid Data', 'Invalid pin code');
      return;
    } else {
      clearError('pinCode');
    }

    saveUser({
      ...user,
      enrollmentId: enrollmentId !== '' ? enrollmentId : undefined,
      emailId: email ? email : '',
      schoolName: school && school.value ? school.value : '',
      pinCode: pinCode ? pinCode : '',
      cityName: cityName,
      stateName: stateName,
      boardName: board,
      className: className
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
            <Typography component="span" color="primary">
              <Box component="h3" className={styles.modalHeading}>
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
            <Box className={styles.label}>Student Name</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Box>{user.studentName}</Box>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>Enrollment ID</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Input
              placeholder="Enter enrollment id"
              inputProps={{ maxLength: 50 }}
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              className={styles.formInput}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>Phone Number</Box>
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
            <Box className={styles.label}>Email Address</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Input
              placeholder="Your Email Address"
              value={email}
              inputProps={{ maxLength: 100 }}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
            />
          </FormControl>
          {errors.emailId && (
            <FormHelperText error>{errors.emailId.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>Board</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Select
              value={board}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setBoardAndFetchClasses(e.target.value as string)
              }
              displayEmpty
            >
              <MenuItem value="">Select a board</MenuItem>
              {boards.length > 0 &&
                boards.map((item) => (
                  <MenuItem value={item.boardName} key={item.boardID}>
                    {item.boardName} ({item.boardDescriptions})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {errors.boardName && (
            <FormHelperText error>{errors.boardName.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>Classes</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              value={className}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setClassName(e.target.value as string)
              }
            >
              <MenuItem value="">Select a class</MenuItem>
              {classes.length > 0 &&
                classes.map((standard) => (
                  <MenuItem value={standard.className} key={standard.classID}>
                    {standard.className}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {errors.className && (
            <FormHelperText error>{errors.className.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>PIN Code</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Input
              placeholder="PIN Code"
              value={pinCode}
              inputProps={{ maxLength: 6 }}
              onChange={(e) => onPinCodeChange(e.target.value)}
              className={styles.formInput}
            />
          </FormControl>
          {errors.pinCode && (
            <FormHelperText error>{errors.pinCode.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>City</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Box>{cityName}</Box>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>State</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Box>{stateName}</Box>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth margin="normal">
            <Box className={styles.label}>Schools / Others</Box>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={8}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={schoolsList}
              getOptionLabel={(option: AutocompleteOption) => option.title}
              autoComplete
              includeInputInList
              value={school}
              onChange={(e, node) => setSchool(node)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select School" />
              )}
            />
          </FormControl>
          {/* {school?.value === 'Other' && <TypeOther />} */}
          {errors.schoolName && (
            <FormHelperText error>{errors.schoolName.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      <Box className={styles.submitBtn}>
        <Button
          variant="contained"
          color="primary"
          onClick={submitPersonalInformation}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default StudentPersonalInformationModal;

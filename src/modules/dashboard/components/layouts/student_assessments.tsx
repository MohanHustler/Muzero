import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Box,
  Button as MuButton,
  Container,
  Grid,
  Typography
} from '@material-ui/core';

import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Student } from '../../../common/contracts/user';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect, useHistory } from 'react-router-dom';
import { getAttemptAssessments } from '../../../student_assessment/helper/api';
import { OngoingAssessment } from '../../../student_assessment/contracts/assessment_interface';
import {
  DataGrid,
  GridColDef,
  ValueGetterParams,
  ValueFormatterParams
} from '@material-ui/data-grid';
import { useSnackbar } from 'notistack';
// import {DateTimeFormatOptions} from 'typescript/lib/lib.es5.d'

interface RowData {
  id: string;
  status: string;
  assessmentname: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  solutionTime: Date;
  button: string;
}
const styles = createStyles({
  boyWavingHard: {
    maxHeight: '145px',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

interface Props extends WithStyles<typeof styles> {
  profile: Student;
}

const StudentAssessments: FunctionComponent<Props> = ({ classes, profile }) => {
  //const [subject, setSubject] = useState('');
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState('');
  const [attemptAssessments, setAttemptAssessments] = useState<
    OngoingAssessment[]
  >([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [rows, setRows] = useState<RowData[]>([]);
  const [submittedAssessment, setSubmittedAssessment] = useState<string[]>([]);

  interface DateTimeFormatOptions {
    localeMatcher?: 'lookup' | 'best fit';
    weekday?: 'long' | 'short' | 'narrow';
    era?: 'long' | 'short' | 'narrow';
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    timeZoneName?: 'long' | 'short';
    formatMatcher?: 'basic' | 'best fit';
    hour12?: boolean;
    timeZone?: string; // this is more complicated than the others, not sure what I expect here
  }

  const dateOptions: DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };

  useEffect(() => {
    if (attemptAssessments.length > 0) {
      setSubjects(
        attemptAssessments
          .map((el) => el.assessment.subjectname)
          .filter(onlyUnique)
      );
    }
  }, [attemptAssessments]);

  const getAllAttemptAssessments = async () => {
    try {
      const response = await getAttemptAssessments();
      setAttemptAssessments(response);
      setSubmittedAssessment(
        response.filter((val) => val.isSubmitted).map((val) => val._id)
      );
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };
  useEffect(() => {
    getAllAttemptAssessments();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr No.', type: 'string', width: 100 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'assessmentname', headerName: 'Assessment Name', width: 160 },
    {
      field: 'subject',
      headerName: 'Subject',
      type: 'string',
      width: 130
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      type: 'dateTime',
      width: 155,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          {(params.value as Date).toLocaleString('en-US', dateOptions)}
        </strong>
      )
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      type: 'dateTime',
      width: 155,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          {(params.value as Date).toLocaleString('en-US', dateOptions)}
        </strong>
      )
    },
    {
      field: 'solutionTime',
      headerName: 'Solution Time',
      type: 'dateTime',
      width: 155,
      renderCell: (params: ValueFormatterParams) => (
        <p>{(params.value as Date).toLocaleString('en-US', dateOptions)}</p>
      )
    },
    {
      field: 'button',
      headerName: 'Action',
      width: 150,
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          <MuButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              if (submittedAssessment.includes(params.value as string)) {
                handleSolutionStart(params.value as string);
              } else {
                handleAssessmentStart(params.value as string);
              }
            }}
          >
            {submittedAssessment.includes(params.value as string)
              ? 'View Solution'
              : 'Attempt'}
          </MuButton>
        </strong>
      )
    }
  ];

  useEffect(() => {
    setRows(
      attemptAssessments
        .filter((el) =>
          selectedSubject === 'All'
            ? true
            : el.assessment.subjectname === selectedSubject
        )
        .map((data, index) => {
          return {
            id: (index + 1).toString(),
            status: data.isSubmitted
              ? 'Submitted'
              : data.isStarted
              ? 'Ongoing'
              : 'Not Attempted',
            assessmentname: data.assessment.assessmentname,
            subject: data.assessment.subjectname,
            startTime: new Date(data.startDate),
            endTime: new Date(data.endDate),
            solutionTime: new Date(data.solutionTime),
            button: data._id
          };
        })
    );
  }, [attemptAssessments, selectedSubject]);

  const handleAssessmentStart = (id: string) => {
    if (
      new Date(attemptAssessments.filter((el) => el._id === id)[0].startDate) <
        new Date() &&
      new Date(attemptAssessments.filter((el) => el._id === id)[0].endDate) >
        new Date()
    ) {
      if (attemptAssessments.filter((el) => el._id === id)[0].isSubmitted) {
        enqueueSnackbar('Assessment already submitted', { variant: 'info' });
      } else {
        enqueueSnackbar('Starting Assessment', { variant: 'success' });
        history.push(
          '/students/' +
            profile.mobileNo +
            '/student_assessement_test?attemptassessmentId=' +
            id
        );
      }
    } else {
      enqueueSnackbar(
        "Couldn't initiate Assessment. Please attempt in Time window specified",
        { variant: 'warning' }
      );
    }
  };

  const handleSolutionStart = (id: string) => {
    if (
      new Date(
        attemptAssessments.filter((el) => el._id === id)[0].solutionTime
      ) < new Date()
    ) {
      enqueueSnackbar('Opening Solutions', { variant: 'success' });
      history.push(
        '/students/' +
          profile.mobileNo +
          '/student_assessement_test?attemptassessmentId=' +
          id
      );
    } else {
      enqueueSnackbar(
        'Solutions will be revealed at ' +
          new Date(
            attemptAssessments.filter((el) => el._id === id)[0].solutionTime
          ).toLocaleString(),
        { variant: 'warning' }
      );
    }
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div>
      <Navbar />

      <Box marginY="50px">
        <Container>
          <Grid container>
            <Grid item xs={12} md={8} lg={12}>
              <Box paddingX="15px">
                <Typography variant="h6">Assessments</Typography>

                <Box display="flex" marginTop="30px">
                  <Box marginRight="10px">
                    <MuButton
                      color="secondary"
                      size="small"
                      onClick={() => setSelectedSubject('All')}
                    >
                      All
                    </MuButton>
                  </Box>
                  {subjects.map((el, index) => {
                    return (
                      <Box marginRight="10px" key={index}>
                        <MuButton
                          color="secondary"
                          size="small"
                          key={index}
                          onClick={() => setSelectedSubject(el)}
                        >
                          {el}
                        </MuButton>
                      </Box>
                    );
                  })}
                </Box>
                <Box marginTop="10px" minHeight="500px">
                  {<DataGrid autoHeight rows={rows} columns={columns} />}
                </Box>

                <Box></Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default withStyles(styles)(StudentAssessments);

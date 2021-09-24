import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Input,
  FormHelperText,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Typography,
  Tooltip
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Publish as PublishIcon
} from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '../../common/components/form_elements/button';
import { patchAssessment } from '../helper/api';
import { QuestionBody } from '../contracts/qustions_interface';
import { TablePagination } from '@material-ui/core';
import Header from '../components/header';
import '../components/katexCustom.css';
import 'katex/dist/katex.min.css';
import { Assessment } from '../contracts/assessment_interface';
import { Section } from '../contracts/section_interface';
import { getAssessment } from '../helper/api';
import { useSnackbar } from 'notistack';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
var Latex = require('react-latex');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainWrapper: {
      marginTop: '20px'
    },
    center: {
      margin: 'auto'
    },
    darkgray: {
      backgroundColor: '#F4F4F4'
    },
    sideIcons3: {
      width: '48px',
      background:
        'linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)',
      borderRadius: '25px',
      color: 'white',
      border:
        '1px solid linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)',
      marginRight: '10px'
    }
  })
);

interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const Confirm_assessment: FunctionComponent<Props> = ({
  authUser,
  location,
  history
}) => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [redirectTo, setRedirectTo] = useState('');
  const [data, setData] = React.useState<Assessment | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);

  useEffect(() => {
    getAssessmentData();
  }, []);

  const getAssessmentData = async () => {
    try {
      const response = await getAssessment(location.search);
      setData(response);
      setCurrentSection(0);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const SnackbarAction = (key: number, i: number) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            setCurrentSection(0);
            setData((prev) => {
              return {
                ...prev,
                sections: prev?.sections.filter(
                  (section: Section, index) => index !== i
                )
              } as Assessment;
            });
            closeSnackbar(key);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          Dismiss
        </Button>
      </React.Fragment>
    );
  };

  const removeSection = (i: number): void => {
    if (
      data?.sections
        .find((val, ind) => ind === i)
        ?.questions.findIndex((val, ind) => ind === 0) !== -1
    ) {
      setData((prev) => {
        return {
          ...prev,
          sections: prev?.sections.filter(
            (section: Section, index) => index !== i
          )
        } as Assessment;
      });
    } else {
      enqueueSnackbar(
        'You are overwriting data for following sections:' +
          data?.sections.find((section, index) => index === i)?.title +
          '. Please Confirm.',
        {
          variant: 'info',
          persist: true,
          action: (key) => {
            return SnackbarAction(key as number, i);
          }
        }
      );
    }
  };

  const updateAssessment = async (id: string) => {
    patchAssessment('?assessmentId=' + id + '&update=true', data as Assessment);
    history.push('/profile/assessment');
  };

  return (
    <div>
      <Navbar />

      <Grid container justify="center">
        <Typography component="span" color="textPrimary">
          <Box
            component="h2"
            fontWeight="500"
            margin="20px auto 10px"
            color="rgb(6, 88, 224) "
          >
            Preview Assessment
          </Box>
        </Typography>
      </Grid>

      <Box margin="20px auto">
        <Grid container justify="center">
          <Grid item lg={10} md={10} sm={11} xs={12}>
            <Header
              data={data}
              setData={setData}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              removeSection={removeSection}
              type={true}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container justify="center">
        <Grid item xs={8} sm={8} md={9} lg={9}>
          <Box>
            <Paper elevation={3}>
              <Box>
                {data?.sections[
                  currentSection === null || currentSection === undefined
                    ? 0
                    : currentSection
                ].questions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((qans, i) => {
                    return (
                      <div key={i}>
                        <Container
                          disableGutters
                          className={i % 2 === 1 ? classes.darkgray : undefined}
                        >
                          <Box margin="0px 15px 15px 15px" padding="15px">
                            <Grid container>
                              <Grid item xs={9} sm={9} md={9} lg={9}>
                                <Box
                                  marginLeft="10px"
                                  marginTop="10px"
                                  marginBottom="10px"
                                >
                                  <Typography variant="h5">
                                    <Latex>{qans.questionDescription}</Latex>
                                  </Typography>
                                  {qans.imageLinks.filter(
                                    (el) => el.filename.substring(0, 1) === 'q'
                                  ).length > 0 &&
                                    qans.imageLinks
                                      .filter(
                                        (el) =>
                                          el.filename.substring(0, 1) === 'q'
                                      )
                                      .map((image) => {
                                        const data = image.encoding;
                                        return (
                                          <img
                                            src={`data:image/jpeg;base64,${data}`}
                                          />
                                        );
                                      })}
                                </Box>
                                <Box marginBottom="20px">
                                  <Grid container>
                                    {qans.type !== 'numeric' ? (
                                      <React.Fragment>
                                        {[
                                          qans.option1,
                                          qans.option2,
                                          qans.option3,
                                          qans.option4
                                        ]
                                          .filter((el) => el.length !== 0)
                                          .map((option, index) => {
                                            return (
                                              <React.Fragment key={index}>
                                                <Grid
                                                  item
                                                  xs={4}
                                                  sm={2}
                                                  md={1}
                                                  lg={1}
                                                >
                                                  <Checkbox
                                                    color="primary"
                                                    value={option}
                                                    name="option1"
                                                    checked={(qans.answer as string[]).includes(
                                                      ['A', 'B', 'C', 'D'][
                                                        index
                                                      ]
                                                    )}
                                                  />
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={7}
                                                  sm={4}
                                                  md={2}
                                                  lg={2}
                                                >
                                                  <Box
                                                    component="h3"
                                                    marginTop="10px"
                                                  >
                                                    <Latex>{option}</Latex>
                                                    {qans.imageLinks.filter(
                                                      (el) =>
                                                        el.filename.substring(
                                                          0,
                                                          1
                                                        ) ===
                                                        (index + 1).toString()
                                                    ).length > 0 &&
                                                      qans.imageLinks
                                                        .filter(
                                                          (el) =>
                                                            el.filename.substring(
                                                              0,
                                                              1
                                                            ) ===
                                                            (
                                                              index + 1
                                                            ).toString()
                                                        )
                                                        .map((image) => {
                                                          const data =
                                                            image.encoding;
                                                          return (
                                                            <img
                                                              src={`data:image/jpeg;base64,${data}`}
                                                            />
                                                          );
                                                        })}
                                                  </Box>
                                                </Grid>
                                              </React.Fragment>
                                            );
                                          })}
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <Grid item xs={4} sm={2} md={1} lg={1}>
                                          <Typography variant="body1">
                                            Answer
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={7} sm={4} md={2} lg={2}>
                                          <Typography variant="body1">
                                            {Number(qans.answer[0]).toFixed(2)}
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={11} sm={6} md={3} lg={3}>
                                          <Typography variant="body1">
                                            Allowed Ranges =
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={4} sm={2} md={1} lg={1}>
                                          <Typography variant="body1">
                                            Min :
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={7} sm={4} md={2} lg={2}>
                                          <Tooltip title="Change percentage error value to change values">
                                            <Typography variant="body1">
                                              {Number(
                                                Number(qans.answer[0]) *
                                                  (1 -
                                                    qans.percentageError / 100)
                                              ).toFixed(2)}
                                            </Typography>
                                          </Tooltip>
                                        </Grid>

                                        <Grid item xs={4} sm={2} md={1} lg={1}>
                                          <Typography variant="body1">
                                            Max:
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={7} sm={4} md={2} lg={2}>
                                          <Tooltip title="Change percentage error value to change values">
                                            <Typography variant="body1">
                                              {Number(
                                                Number(qans.answer) *
                                                  (1 +
                                                    qans.percentageError / 100)
                                              ).toFixed(2)}
                                            </Typography>
                                          </Tooltip>
                                        </Grid>
                                      </React.Fragment>
                                    )}
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                            <Grid container justify="flex-end">
                              <Grid
                                item
                                container
                                md={7}
                                sm={8}
                                lg={11}
                                justify="center"
                              >
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  <Box display="flex" alignItems="center">
                                    <FormControl
                                      margin="normal"
                                      style={{ width: '80%' }}
                                    >
                                      <InputLabel shrink={true}>
                                        Negative Marks
                                      </InputLabel>
                                      <Select
                                        value={qans.negativeMarking}
                                        type="number"
                                        onChange={(
                                          e: React.ChangeEvent<{
                                            value: unknown;
                                          }>
                                        ) => {
                                          const val = Number(e.target.value);
                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              sections: prev?.sections.map(
                                                (section, index) => {
                                                  if (
                                                    index !== currentSection
                                                  ) {
                                                    return section;
                                                  } else {
                                                    return {
                                                      ...section,
                                                      questions: section.questions.map(
                                                        (ques, ind) => {
                                                          if (ind !== i) {
                                                            return ques;
                                                          } else {
                                                            return {
                                                              ...ques,
                                                              negativeMarking: val
                                                            };
                                                          }
                                                        }
                                                      )
                                                    };
                                                  }
                                                }
                                              )
                                            } as Assessment;
                                          });
                                        }}
                                      >
                                        <MenuItem value="0">None</MenuItem>
                                        {[1, 2, 3, 4, 5, 6]
                                          .filter((el) => el <= qans.marks)
                                          .map((el, index) => (
                                            <MenuItem key={index} value={el}>
                                              {el}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                  </Box>
                                </Grid>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  <Box display="flex" alignItems="center">
                                    <Tooltip title="Applicable for Numeric questions only">
                                      <div>
                                        <FormControl
                                          margin="normal"
                                          style={{ width: '80%' }}
                                        >
                                          <InputLabel shrink={true}>
                                            Percentage Error
                                          </InputLabel>
                                          <Input
                                            value={qans.percentageError}
                                            type="number"
                                            endAdornment={'%'}
                                            disabled={qans.type !== 'numeric'}
                                            onChange={(
                                              e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
                                              >
                                            ) => {
                                              const val = Number(
                                                e.target.value
                                              );
                                              if (val <= 20) {
                                                setData((prev) => {
                                                  return {
                                                    ...prev,
                                                    sections: prev?.sections.map(
                                                      (section, index) => {
                                                        if (
                                                          index !==
                                                          currentSection
                                                        ) {
                                                          return section;
                                                        } else {
                                                          return {
                                                            ...section,
                                                            questions: section.questions.map(
                                                              (ques, ind) => {
                                                                if (ind !== i) {
                                                                  return ques;
                                                                } else {
                                                                  return {
                                                                    ...ques,
                                                                    percentageError: val
                                                                  };
                                                                }
                                                              }
                                                            )
                                                          };
                                                        }
                                                      }
                                                    )
                                                  } as Assessment;
                                                });
                                              } else {
                                                enqueueSnackbar(
                                                  'Percentage error above 20% not allowed',
                                                  { variant: 'info' }
                                                );
                                              }
                                            }}
                                          />
                                          <FormHelperText>
                                            0-20% error allowed
                                          </FormHelperText>
                                        </FormControl>
                                      </div>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  <FormControl
                                    margin="normal"
                                    style={{ width: '80%' }}
                                  >
                                    <InputLabel shrink={true}>
                                      Question Type
                                    </InputLabel>
                                    <Select
                                      margin="none"
                                      required
                                      disabled={qans.source === 'database'}
                                      value={qans.type}
                                      onChange={(
                                        e: React.ChangeEvent<{ value: unknown }>
                                      ) => {
                                        const val = e.target.value;
                                        setData((prev) => {
                                          return {
                                            ...prev,
                                            sections: prev?.sections.map(
                                              (section, index) => {
                                                if (index !== currentSection) {
                                                  return section;
                                                } else {
                                                  return {
                                                    ...section,
                                                    questions: section.questions.map(
                                                      (ques, ind) => {
                                                        if (ind !== i) {
                                                          return ques;
                                                        } else {
                                                          return {
                                                            ...ques,
                                                            type: val
                                                          };
                                                        }
                                                      }
                                                    )
                                                  };
                                                }
                                              }
                                            )
                                          } as Assessment;
                                        });
                                      }}
                                    >
                                      <MenuItem value="single">
                                        Single Choice
                                      </MenuItem>
                                      <MenuItem value="multiple">
                                        Multiple Choice
                                      </MenuItem>
                                      <MenuItem value="numeric">
                                        Numeric
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  <Box display="flex" alignItems="center">
                                    <FormControl fullWidth margin="normal">
                                      <InputLabel shrink={true}>
                                        Enter Marks
                                      </InputLabel>
                                      <Select
                                        margin="none"
                                        required
                                        value={qans.marks}
                                        onChange={(
                                          e: React.ChangeEvent<{
                                            value: unknown;
                                          }>
                                        ) => {
                                          const val = e.target.value as number;
                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              sections: prev?.sections.map(
                                                (section, index) => {
                                                  if (
                                                    index !== currentSection
                                                  ) {
                                                    return section;
                                                  } else {
                                                    return {
                                                      ...section,
                                                      questions: section.questions.map(
                                                        (ques, ind) => {
                                                          if (ind !== i) {
                                                            return ques;
                                                          } else {
                                                            return {
                                                              ...ques,
                                                              marks: val
                                                            };
                                                          }
                                                        }
                                                      )
                                                    };
                                                  }
                                                }
                                              )
                                            } as Assessment;
                                          });
                                        }}
                                        displayEmpty
                                      >
                                        <MenuItem value={1}>01</MenuItem>
                                        <MenuItem value={2}>02</MenuItem>
                                        <MenuItem value={3}>03</MenuItem>
                                        <MenuItem value={4}>04</MenuItem>
                                        <MenuItem value={5}>05</MenuItem>
                                        <MenuItem value={6}>06</MenuItem>
                                      </Select>
                                    </FormControl>
                                    <Box
                                      className={classes.sideIcons3}
                                      margin="15px 15px 10px 20px"
                                    >
                                      <IconButton
                                        onClick={() => {
                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              sections: prev?.sections.map(
                                                (section, index) => {
                                                  if (
                                                    index !== currentSection
                                                  ) {
                                                    return section;
                                                  } else {
                                                    return {
                                                      ...section,
                                                      questions: section.questions.filter(
                                                        (ques, ind) => ind !== i
                                                      )
                                                    };
                                                  }
                                                }
                                              )
                                            } as Assessment;
                                          });
                                        }}
                                      >
                                        <DeleteIcon
                                          style={{ color: 'white' }}
                                        />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                          <Divider />
                        </Container>
                      </div>
                    );
                  })}
              </Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={
                  data?.sections[currentSection] !== undefined
                    ? (data?.sections[currentSection]?.questions
                        ?.length as number)
                    : 1
                }
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box marginBottom="50px" marginTop="20px">
        <Grid container>
          <Grid item xs={4} md={8} lg={8}></Grid>

          <Grid item xs={4} md={2} lg={1}>
            <FormControl>
              <Box>
                <Button
                  color="primary"
                  size="large"
                  startIcon={<ArrowBackIosIcon />}
                  variant="contained"
                  onClick={() => history.goBack()}
                >
                  Back
                </Button>
              </Box>
            </FormControl>
          </Grid>
          <Grid item xs={4} md={2} lg={1}>
            <FormControl>
              <Button
                color="secondary"
                size="large"
                endIcon={<PublishIcon />}
                variant="contained"
                onClick={() => updateAssessment(data?._id as string)}
              >
                Update
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User,
  assessmentfirstpart: state.assessmentReducers.assessmentSetp as Assessment,
  selectedQuestions: state.assessmentReducers.questions as QuestionBody
});

export default connect(mapStateToProps)(Confirm_assessment);

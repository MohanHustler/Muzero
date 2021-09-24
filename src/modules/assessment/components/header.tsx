import React, { Dispatch, FunctionComponent } from 'react';
import {
  Badge,
  Box,
  Grid,
  IconButton,
  Typography,
  Tooltip,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Cancel as CancelIcon
} from "@material-ui/icons"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Section } from '../contracts/section_interface';
import Button from "../../common/components/form_elements/button";
import { Assessment } from '../contracts/assessment_interface';
import { useSnackbar } from 'notistack';
import { findIndex } from 'lodash';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },

    tmarks: {
      background: '#f0a500',
      borderRadius: 20,
      padding: '3px 10px',
      marginRight: '20px',
    },
    selecctionMarks: {
      color: 'blue',
      fontSize: '20px',
      padding: '7px',
    },
    slection: {
      color: ' blue',
    },
    selectionBar: {
      background: 'white',
      borderRadius: 25,
      padding: '8px',
    },

    navigationBar: {
      '& > * + *': {
        marginLeft: theme.spacing(3),
      },
    },
    mainWrapper: {
      marginTop: '20px',
    },
  })
);



interface Props {
  data: Assessment | null;
  setCurrentSection: Dispatch<React.SetStateAction<number>>;
  currentSection: number;
  setData: Dispatch<React.SetStateAction<Assessment | null>>;
  removeSection: (i: number) => void;
  type:boolean;
}

export const Header: FunctionComponent<Props> = ({
  data,
  currentSection,
  setCurrentSection,
  setData,
  removeSection,
  type
}) => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <Grid container item lg={12} md={12} xs={12} sm={12}>
        <Grid container item lg={2} md={2} xs={2} sm={2} >
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Box margin="auto 10px">
              <FormControl >
                <InputLabel shrink={true}>Section Title</InputLabel>
                <Input
                  placeholder="Section Title"
                  inputRef={titleRef}
                  disabled={data?.sections[currentSection] === undefined}
                  value={data?.sections[currentSection] === undefined ? "Section Title" : data?.sections[currentSection].title}
                  onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
                    const val = ev.target.value as string;
                    setData((prev) => {
                      return {
                        ...prev,
                        sections: prev?.sections.map((section, index) => {
                          if (index === currentSection) {
                            return {
                              ...section,
                              title: val,
                            };
                          } else {
                            return section;
                          }
                        }),
                      } as Assessment;
                    });
                  }}
                  onBlur={() => {
                    if (
                      (data?.sections[currentSection].title.length as number) < 4
                    ) {
                      enqueueSnackbar(
                        'Section Title should be atleast 4 characters long',
                        { variant: 'error' }
                      );
                      titleRef.current?.focus();
                    }
                  }}
                />

              </FormControl>
            </Box>

          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Box margin="auto 10px">
              <Tooltip
                title="Non-zero input to set individual Section timings"
              >
                <FormControl>
                  <InputLabel shrink={true}>Time(Mins)</InputLabel>
                  <Input
                    placeholder="Section Time(mins)"
                    disabled={data?.sections[currentSection] === undefined}
                    value={data?.sections[currentSection] === undefined  ? 10 : data?.sections[currentSection].duration===null?0:data?.sections[currentSection].duration}
                    onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
                      const val = ev.target.value as number;
                      setData((prev) => {
                        return {
                          ...prev,
                          sections: prev?.sections.map((section, index) => {
                            if (index === currentSection) {
                              return {
                                ...section,
                                duration: val,
                              };
                            } else {
                              return section;
                            }
                          }),
                        } as Assessment;
                      });
                    }}
                  />

                </FormControl>
              </Tooltip>

            </Box>

          </Grid>

        </Grid>
        <Grid container item lg={10} md={10} xs={10} sm={10} justify="flex-start">
          <Grid item lg={11} md={11} xs={11} sm={11} >
            <Grid container justify="flex-start" >
              {data?.sections.map((section, index) => {
                return (
                  <Grid item key={index} lg={2} md={3} sm={6} xs={6}>
                    <Box margin="10px" key={index}>
                      <Badge
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        color="primary"
                        badgeContent={section.questions.length}
                      >

                        <Button
                          color={currentSection === index ? "secondary" : "default"}
                          size="medium"
                          variant="contained"
                          onClick={() => {
                            setCurrentSection(index);
                          }}
                        >
                          {section.title}
                          {
                            index !== 0 && <IconButton
                              onClick={() => {
                                removeSection(index)
                              }}
                              size="small"
                              style={{ position: "absolute", bottom: "20px", left: "100px" }}
                            >
                              <CancelIcon />
                            </IconButton>
                          }

                        </Button>
                      </Badge>
                      


                    </Box>
                  </Grid>

                );
              })}

            </Grid>

          </Grid>
          <Grid item lg={1} md={1} xs={1} sm={1}>
            <Box paddingTop="11px">
            {(data?.sections.findIndex((val, ind) => ind === 5) == -1 ) && <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setData((prev) => {
                    return {
                      ...prev,
                      sections: [...prev?.sections as Section[], {
                        title: "Section "+["A","B","C","D","E","F"][data?.sections.length],
                        questions: [],
                        totalMarks: 0,
                        duration: 0,
                      } as Section]
                    } as Assessment
                  })
                }
                }
                startIcon={<AddIcon />}
              >
                Add
              </Button>}
            </Box>
          </Grid>
          </Grid>
        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={8} md={8} xs={8} sm={8}>
          <Box margin="auto 10px" width="100%">
              <FormControl fullWidth >
                <InputLabel shrink={true}>Section Instructions</InputLabel>
                <Input
                  placeholder="Section Instructions"
                  fullWidth
                  disabled={data?.sections[currentSection] === undefined}
                  value={data?.sections[currentSection] === undefined ? "" : data?.sections[currentSection].instructions===null?"":data?.sections[currentSection].instructions}
                  onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
                    const val = ev.target.value as string;
                    setData((prev) => {
                      return {
                        ...prev,
                        sections: prev?.sections.map((section, index) => {
                          if (index === currentSection) {
                            return {
                              ...section,
                              instructions: val,
                            };
                          } else {
                            return section;
                          }
                        }),
                      } as Assessment;
                    });
                  }}
                  
                />

              </FormControl>
            </Box>
          </Grid>
          {type&&<Grid item lg={4} md={4} xs={4} sm={4}>
            <Box paddingTop="17px">
              <Grid container >
                <Grid item lg={6} md={6} xs={6} sm={6} >
                  <Typography component="span" color="textPrimary">
                    <Box
                      component="p"
                      fontWeight="400"
                      textAlign="right"
                      margin="0"
                      className={classes.navigationBar}
                    >
                      Added Marks:{' '}
                      <Typography
                        component="span"
                        className={classes.tmarks}
                        color="textPrimary"
                      >
                        {data?.sections.reduce((finalSection, currentSection) => {
                          return {
                            ...finalSection,
                            questions: [...finalSection.questions, ...currentSection.questions]
                          }
                        }).questions?.findIndex((val, ind) => ind == 0) !== -1 ? data?.sections.reduce((finalSection, currentSection) => {
                          return {
                            ...finalSection,
                            questions: [...finalSection.questions, ...currentSection.questions]
                          }
                        }).questions.reduce((finalQues, currentQues) => {
                          return {
                            ...finalQues,
                            marks: Number(finalQues.marks) + Number(currentQues.marks)
                          }
                        }).marks : 0}
                      </Typography>
                    </Box>
                  </Typography>
                </Grid>
                <Grid item lg={6} md={6} xs={6} sm={6}>
                  <Typography component="span" color="textPrimary">
                    <Box
                      component="p"
                      fontWeight="400"
                      textAlign="right"
                      margin="0"
                      className={classes.navigationBar}
                    >
                      Total Marks :{' '}
                      <Typography
                        component="span"
                        className={classes.tmarks}
                        color="textPrimary"
                      >
                        {data?.totalMarks}
                      </Typography>
                    </Box>
                  </Typography>
                </Grid>



              </Grid>
            </Box>



          </Grid>}

        </Grid>
          

        </Grid>
      

    </div>
  );
}

export default Header;

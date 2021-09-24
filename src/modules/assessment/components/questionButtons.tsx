import React, { FunctionComponent, Dispatch } from "react";
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
} from "@material-ui/core";
import {createStyles, makeStyles,Theme} from "@material-ui/core/styles"
import {Topic} from "../contracts/topics_interface"
import {Assessment} from "../contracts/assessment_interface"
import {useSnackbar} from "notistack"
import {
    Add as AddIcon,
    Remove as RemoveIcon
  } from "@material-ui/icons" 
import Red from "@material-ui/core/colors/red"
import {QuestionBody} from "../contracts/qustions_interface"

const RedColor = Red[600]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        sideIcons3: {
            width: "48px",
            background: "linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)",
            borderRadius: "25px",
            color: "white",
            border: "1px solid linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)",
            marginRight: "10px",
        },
        sideIcons4: {
            width: "48px",
            background: RedColor,
            borderRadius: "25px",
            borderColor: RedColor,
            borderWidth: "1px",
            borderStyle: "solid",
            color: "white",
            marginRight: "10px",
        },
        darkgray: {
            backgroundColor: "#F4F4F4"
          },
        
    })
)


interface Props {
    qans:QuestionBody,
    i:number,
    selectedQues : string[],
    setSelectedQues:Dispatch<React.SetStateAction<string[]>>;
    setTopics: Dispatch<React.SetStateAction<Topic[]>>;
    currentTopic:number,
    complexity : string,
    setData: Dispatch<React.SetStateAction<Assessment|null>>;
    data: Assessment |null,
    currentSection : number,
  }

const QuestionButtons: FunctionComponent<Props> = ({
    qans,
    i,
    selectedQues,
    setSelectedQues,
    setTopics,
    currentTopic,
    complexity,
    setData,
    data,
    currentSection,
  }) => {
    const classes=useStyles()
    const {enqueueSnackbar} = useSnackbar()
    return (
        <Grid container justify="flex-end">
                              <Grid item container md={7} sm={8} lg={11} justify="flex-end">
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  {/* <Box
                                    display="flex"
                                    alignItems="center"
                                  >
                                    <FormControl margin="normal" style={{ width: "80%" }}>
                                      <InputLabel shrink={true}>Negative Marks</InputLabel>
                                      <Select
                                        value={qans.negativeMarking}
                                        type="number"
                                        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                          const val = Number(e.target.value)
                                          setTopics((prev) => {
                                            return prev?.map((topic, ind) => {
                                              if (ind !== currentTopic) {
                                                return topic
                                              }
                                              else {
                                                return {
                                                  ...topic,
                                                  questionSet:topic.questionSet.map((el)=>{
                                                      if(el[0]!==complexity){
                                                        return el
                                                      }
                                                      else{
                                                        return [el[0], el[1].map((question)=>{
                                                            if(question._id===qans._id){
                                                                return {
                                                                    ...question,
                                                                    negativeMarking:val
                                                                }
                                                            }
                                                            else{
                                                                return question
                                                            }
                                                        })]
                                                      }
                                                  })
                                                }
                                              }
                                            })
                                          })

                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              sections: prev?.sections.map((section, index) => {
                                                if (index !== currentSection) {
                                                  return section
                                                }
                                                else {
                                                  return {
                                                    ...section,
                                                    questions: section.questions.map((ques) => {
                                                      if (ques._id !== qans._id) {
                                                        return ques
                                                      }
                                                      else {
                                                        return {
                                                          ...ques,
                                                          negativeMarking: val
                                                        }
                                                      }
                                                    })
                                                  }
                                                }
                                              })
                                            } as Assessment
                                          })


                                        }
                                        }
                                      >
                                        <MenuItem value="0">None</MenuItem>
                                        {[1, 2, 3, 4, 5, 6].filter((el) => el <= qans.marks).map((el, index) => <MenuItem key={index} value={el}>{el}</MenuItem>)}
                                      </Select>

                                    </FormControl>

                                  </Box> */}
                                </Grid>
                                {qans.type==="numeric"&&<React.Fragment>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  {/* <Box
                                    display="flex"
                                    alignItems="center"

                                  >
                                    <Tooltip
                                      title="Applicable for Numeric questions only"
                                    >
                                      <div>

                                        <FormControl margin="normal" style={{ width: "80%" }}>
                                          <InputLabel shrink={true}>Percentage Error</InputLabel>
                                          <Input
                                            value={qans.percentageError}
                                            type="number"

                                            endAdornment={"%"}
                                            disabled={qans.type !== "numeric"}

                                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                              const val = Number(e.target.value)
                                              if (val <= 20) {
                                                setTopics((prev) => {
                                                    return prev?.map((topic, ind) => {
                                                      if (ind !== currentTopic) {
                                                        return topic
                                                      }
                                                      else {
                                                        return {
                                                          ...topic,
                                                          questionSet:topic.questionSet.map((el)=>{
                                                              if(el[0]!==complexity){
                                                                return el
                                                              }
                                                              else{
                                                                return [el[0], el[1].map((question)=>{
                                                                    if(question._id===qans._id){
                                                                        return {
                                                                            ...question,
                                                                            percentageError:val
                                                                        }
                                                                    }
                                                                    else{
                                                                        return question
                                                                    }
                                                                })]
                                                              }
                                                          })
                                                        }
                                                      }
                                                    })
                                                  })
                                                setData((prev) => {
                                                  return {
                                                    ...prev,
                                                    sections: prev?.sections.map((section, index) => {
                                                      if (index !== currentSection) {
                                                        return section
                                                      }
                                                      else {
                                                        return {
                                                          ...section,
                                                          questions: section.questions.map((ques) => {
                                                            if (ques._id !== qans._id) {
                                                              return ques
                                                            }
                                                            else {
                                                              return {
                                                                ...ques,
                                                                percentageError: val
                                                              }
                                                            }
                                                          })
                                                        }
                                                      }
                                                    })
                                                  } as Assessment
                                                })
                                              }
                                              else {
                                                enqueueSnackbar("Percentage error above 20% not allowed", { variant: "info" })

                                              }

                                            }
                                            }
                                          />
                                          <FormHelperText>0-20% error allowed</FormHelperText>
                                        </FormControl>
                                      </div>
                                    </Tooltip>
                                  </Box> */}
                                </Grid>
                                </React.Fragment>}

                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  {/* <FormControl margin="normal" style={{ width: "80%" }}>
                                    <InputLabel shrink={true}>Question Type</InputLabel>
                                    <Select
                                      margin="none"
                                      required
                                      disabled={qans.source === "database"}
                                      value={qans.type}
                                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                        const val = e.target.value as "numeric"|"single"|"multiple"
                                        setTopics((prev) => {
                                            return prev?.map((topic, ind) => {
                                              if (ind !== currentTopic) {
                                                return topic
                                              }
                                              else {
                                                return {
                                                  ...topic,
                                                  questionSet:topic.questionSet.map((el)=>{
                                                      if(el[0]!==complexity){
                                                        return el
                                                      }
                                                      else{
                                                        return [el[0], el[1].map((question)=>{
                                                            if(question._id===qans._id){
                                                                return {
                                                                    ...question,
                                                                    type:val
                                                                }
                                                            }
                                                            else{
                                                                return question
                                                            }
                                                        })]
                                                      }
                                                  })
                                                }
                                              }
                                            })
                                          })
                                        setData((prev) => {
                                          return {
                                            ...prev,
                                            sections: prev?.sections.map((section, index) => {
                                              if (index !== currentSection) {
                                                return section
                                              }
                                              else {
                                                return {
                                                  ...section,
                                                  questions: section.questions.map((ques) => {
                                                    if (ques._id !== qans._id) {
                                                      return ques
                                                    }
                                                    else {
                                                      return {
                                                        ...ques,
                                                        type: val
                                                      }
                                                    }
                                                  })
                                                }
                                              }
                                            })
                                          } as Assessment
                                        })

                                      }
                                      }
                                    >
                                      <MenuItem value="single">Single Choice</MenuItem>
                                      <MenuItem value="multiple">Multiple Choice</MenuItem>
                                      <MenuItem value="numeric">Numeric</MenuItem>
                                    </Select>
                                  </FormControl> */}
                                </Grid>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  {/* <FormControl style={{ width: "80%" }} margin="normal" >
                                    <InputLabel shrink={true}>Enter Marks</InputLabel>
                                    <Select
                                      margin="none"
                                      required
                                      value={qans.marks}
                                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                        const val = e.target.value as number
                                        setTopics((prev) => {
                                            return prev?.map((topic, ind) => {
                                              if (ind !== currentTopic) {
                                                return topic
                                              }
                                              else {
                                                return {
                                                  ...topic,
                                                  questionSet:topic.questionSet.map((el)=>{
                                                      if(el[0]!==complexity){
                                                        return el
                                                      }
                                                      else{
                                                        return [el[0], el[1].map((question)=>{
                                                            if(question._id===qans._id){
                                                                return {
                                                                    ...question,
                                                                    marks:val
                                                                }
                                                            }
                                                            else{
                                                                return question
                                                            }
                                                        })]
                                                      }
                                                  })
                                                }
                                              }
                                            })
                                          })
                                        setData((prev) => {
                                          return {
                                            ...prev,
                                            sections: prev?.sections.map((section, index) => {
                                              if (index !== currentSection) {
                                                return section
                                              }
                                              else {
                                                return {
                                                  ...section,
                                                  questions: section.questions.map((ques, ind) => {
                                                    if (ques._id !== qans._id) {
                                                      return ques
                                                    }
                                                    else {
                                                      return {
                                                        ...ques,
                                                        marks: val
                                                      }
                                                    }
                                                  })
                                                }
                                              }
                                            })
                                          } as Assessment
                                        })
                                      }
                                      }
                                      displayEmpty
                                    >
                                      <MenuItem value={1}>01</MenuItem>
                                      <MenuItem value={2}>02</MenuItem>
                                      <MenuItem value={3}>03</MenuItem>
                                      <MenuItem value={4}>04</MenuItem>
                                      <MenuItem value={5}>05</MenuItem>
                                      <MenuItem value={6}>06</MenuItem>
                                    </Select>
                                  </FormControl> */}
                                </Grid>
                                <Grid item xs={3} sm={3} md={2} lg={2}>
                                  {/* {
                                    !(selectedQues.includes(qans.questionDescription)) ? (
                                      <Box
                                        className={classes.sideIcons3}
                                        margin="15px 15px 10px 20px"
                                      >
                                        <IconButton

                                          onClick={() => {
                                            const addedMarks = data?.sections.reduce((finalSection, currentSection) => {
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
                                            }).marks : 0

                                            console.log(Number(addedMarks) + Number(qans.marks))
                                            if (Number(addedMarks) + Number(qans.marks) > Number(data?.totalMarks)) {
                                              enqueueSnackbar("Total added marks exceeding assignment marks. Action denied", { variant: "error" })
                                              return
                                            }
                                            else {
                                              setData((prev) => {
                                                return {
                                                  ...prev,
                                                  sections: prev?.sections.map((section, index) => {
                                                    if (index !== currentSection) {
                                                      return section
                                                    }
                                                    else {
                                                      return {
                                                        ...section,
                                                        questions: [...section.questions, qans]
                                                      }
                                                    }
                                                  })
                                                } as Assessment
                                              })
                                              setSelectedQues((prev) => {
                                                return [...prev, qans.questionDescription]
                                              })
                                            }


                                          }}

                                        >
                                          <AddIcon style={{ color: "white" }} />
                                        </IconButton>
                                      </Box>
                                    ) : (
                                        <Box
                                          className={classes.sideIcons4}
                                          margin="15px 15px 10px 20px"
                                        >

                                          <IconButton

                                            onClick={() => {
                                              setData((prev) => {
                                                return {
                                                  ...prev,
                                                  sections: prev?.sections.map((section, index) => {
                                                    return {
                                                      ...section,
                                                      questions:section.questions.filter(ques=>ques.questionDescription!==qans.questionDescription)
                                                    }
                                                  })
                                                } as Assessment
                                              })

                                              setSelectedQues((prev) => {
                                                const ind = prev.findIndex((val, ind) => { return val === qans.questionDescription })
                                                return prev.filter((val, index) => {
                                                  return index !== ind
                                                })
                                              })
                                            }}

                                          >
                                            <RemoveIcon style={{ color: "white" }} />
                                          </IconButton>
                                        </Box>
                                      )
                                  } */}
                                </Grid>
                              </Grid>
                            </Grid>
    )
  };



  export default QuestionButtons
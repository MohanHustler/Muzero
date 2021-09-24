import React, { FunctionComponent, Dispatch } from "react";
import {
    Box,
    Checkbox,
    Grid,
    Typography,
    Tooltip
  } from "@material-ui/core";
import {QuestionBody} from "../contracts/qustions_interface"
import 'katex/dist/katex.min.css';
import {Assessment} from "../contracts/assessment_interface"
import "./katexCustom.css"
import {useSnackbar} from "notistack"
var Latex= require("react-latex")
interface Props {
    qans: QuestionBody,
    selectedQues : string[]
    setSelectedQues : Dispatch<React.SetStateAction<string[]>>;
    data:Assessment|null;
    setData:Dispatch<React.SetStateAction<Assessment|null>>;
    currentSection:number
  }

  const QuestionText: FunctionComponent<Props> = ({
    qans,
    selectedQues,
    setSelectedQues,
    data,
    setData,
    currentSection
  }) => {

    
    console.log(qans)
    const {enqueueSnackbar} = useSnackbar()

    return (
        <Grid container >
            <Grid item xs={3} sm={2} md={1} lg={1}>
                <Box marginTop="5px">
                    <Checkbox
                        color="primary"
                        name="questionDescription"
                        checked={selectedQues.includes(qans.checksum)}
                        onChange={(ev:React.ChangeEvent<HTMLInputElement>)=>{
                            const checked = ev.target.checked
                            if(checked){
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
                                    enqueueSnackbar("Total added marks exceeding assignment marks. Please check Marks assignment section", { variant: "error" })
                                    return
                                  }
                                  else{
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
                                        return [...prev, qans.checksum]
                                      })
                                  }

                                
                            }
                            else{
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
                                    const ind = prev.findIndex((val, ind) => { return val === qans.checksum })
                                    return prev.filter((val, index) => {
                                      return index !== ind
                                    })
                                  })
                            }
                        }}
                    />
                </Box>

            </Grid>
            <Grid item xs={9} sm={9} md={9} lg={9}>
                <Box

                    marginLeft="-20px"
                    marginTop="10px"
                    marginBottom="10px"
                >

                    <Typography variant="h5" >
                        <Grid container>
                          <Grid item md={1} lg={1} sm={2} xs={3}>
                            {qans.srno+ " : "}
                          </Grid>
                          <Grid item md={11} lg={11} sm={10} xs={9}>
                          <Latex trust={true}>{qans.questionDescription}</Latex>
                          </Grid>
                        </Grid>
                        
                    </Typography>
                    {
                      qans.imageLinks.filter((el)=>el.filename.substring(0,1)==="q").length>0 && qans.imageLinks.filter((el)=>el.filename.substring(0,1)==="q").map((image)=>{
                      const data = image.encoding
                      return <img src={`data:image/jpeg;base64,${data}`} />
                    }) 
                    }
                </Box>
                <Box marginBottom="20px">
                    <Grid container>
                        {
                            qans.type !== "numeric" ?
                                <React.Fragment>
                                    {[qans.option1, qans.option2, qans.option3, qans.option4].filter((el)=>el.length!==0).map((option, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Grid item xs={3} sm={2} md={1} lg={1}>
                                                    <Checkbox

                                                        color="primary"
                                                        value={option}
                                                        name="option1"
                                                        checked={(qans.answer as string[]).includes(["A", "B", "C", "D"][index])}
                                                    />
                                                </Grid>
                                                <Grid item xs={3} sm={4} md={5} lg={5}>
                                                    <Box component="h3" marginTop="10px">
                                                      <Typography variant = "body2" display="block">
                                                      <Latex >{option}</Latex>
                                                      </Typography>
                                                        
                                                    </Box>
                                              {
                                                qans.imageLinks.filter((el) => el.filename.substring(0, 1) === (index+1).toString()).length > 0 && qans.imageLinks.filter((el) => el.filename.substring(0, 1) === (index+1).toString()).map((image) => {
                                                  const data = image.encoding
                                                  return <img src={`data:image/jpeg;base64,${data}`} />
                                                })
                                              }
                                                </Grid>
                                            </React.Fragment>
                                        )
                                    })}
                                </React.Fragment> :
                                <React.Fragment>
                                    <Grid item xs={4} sm={2} md={2} lg={1}>
                                        <Typography
                                            variant="body1"
                                        >
                                            Ans. -
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={4} md={2} lg={2}>
                                        <Typography
                                            variant="body1">

                                            {Number(qans.answer[0]).toFixed(2)}

                                        </Typography>
                                    </Grid>

                                    <Grid item xs={11} sm={6} md={3} lg={3}>
                                        <Typography
                                            variant="body1">
                                            Allowed Ranges     =
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={4} sm={2} md={1} lg={1}>
                                        <Typography
                                            variant="body1">
                                            Min :
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={4} md={2} lg={2}>
                                        <Tooltip title="Change percentage error value to change values">
                                            <Typography
                                                variant="body1">

                                                {Number(Number(qans.answer[0]) * (1 - (qans.percentageError / 100))).toFixed(2)}

                                            </Typography>
                                        </Tooltip>
                                    </Grid>

                                    <Grid item xs={4} sm={2} md={1} lg={1}>
                                        <Typography
                                            variant="body1">
                                            Max:
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={7} sm={4} md={2} lg={2}>
                                        <Tooltip
                                            title="Change percentage error value to change values">
                                            <Typography
                                                variant="body1">

                                                {Number(Number(qans.answer[0]) * (1 + (qans.percentageError / 100))).toFixed(2)}

                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                </React.Fragment>
                        }

                    </Grid>
                </Box>
                
                <Box

                marginLeft="-20px"
                marginTop="10px"
                marginBottom="10px"
            >
                <Typography variant="h5" >
                    <Latex displayMode trust>{qans.answerDescription}</Latex>
                </Typography>
                {
                  qans.imageLinks.filter((el)=>el.filename.substring(0,1)==="s").length>0 && qans.imageLinks.filter((el)=>el.filename.substring(0,1)==="s").map((image)=>{
                  const data = image.encoding
                  return <img src={`data:image/jpeg;base64,${data}`} />
                }) 
                }
            </Box>
                

            </Grid>
        </Grid>
    )
  }

  export default QuestionText

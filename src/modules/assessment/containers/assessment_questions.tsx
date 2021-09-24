import React, { FunctionComponent, useState, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../store";
import { User } from "../../common/contracts/user";
import { RouteComponentProps } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  FormControl,
  Grid,
} from "@material-ui/core";
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos,
  ArrowForwardIos as ArrowForwardIosIcon
} from "@material-ui/icons"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import Button from "../../common/components/form_elements/button";
import { patchAssessment, getTopics, getAssessment } from "../helper/api";
import Header from "../components/header";
import Navbar from "../../common/components/navbar";

import { Assessment } from "../contracts/assessment_interface";
import { Section } from "../contracts/section_interface"
import { Redirect } from 'react-router-dom';
import { Topic } from "../contracts/topics_interface";
import { useSnackbar } from "notistack";
import FilterContainer from "../components/filterContainer";
import QuestionContainer from "../components/questionContainer"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    
    greenbg: {
      backgroundColor: '#e2ffe0'
    },
    margin: {
      marginTop: "20px"
    },
    mainWrapper: {
      margin: "20px auto 0px",
    },
    
    root: {
      height: 300,
      flexGrow: 1,
      minWidth: 300,
      transform: "translateZ(0)",
      // The position fixed scoping doesn't work in IE 11.
      // Disable this demo to preserve the others.
      "@media all and (-ms-high-contrast: none)": {
        display: "none",
      },
    },
    

    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      width: 800,
      height: 600,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    popover: {
      pointerEvents: 'none',
    },
    popoverPaper: {
      pointerEvents: "auto",
      padding: theme.spacing(1)
    },


  })
);


type Source = "user" | "database"
interface Props extends RouteComponentProps<{ username: string }> {
  authUser: User;
}

const Assessment_questions: FunctionComponent<Props> = ({
  authUser,
  location,
  history
}) => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [complexity, setComplexity] = useState<string>("");
  const [currentSection, setCurrentSection] = useState<number>(0)
  const [data, setData] = useState<Assessment | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [redirectTo, setRedirectTo] = useState('');
  const [noQuestions,setNoQuestions] = useState<boolean>(false)
 
  const [topics, setTopics] = useState<Topic[]>([])
  const [currentTopic, setCurrentTopic] = useState<number>(0)
  const [selectedQues, setSelectedQues] = useState<string[]>([])


  const [loading,setLoading] = useState<boolean>(true)

  var timer: NodeJS.Timeout | null = null
  const dataId = React.useRef<string | null>(null)


  const dataRef= React.useRef<Assessment | null>(null)

  useEffect(()=>{
    dataRef.current=data
  },[data])

  useEffect(() => {
    getAssessmentData()
  }, []);

  useEffect(() => {
    timer = setInterval(() => {
      enqueueSnackbar("Saving your data...", { variant: "info" })
      updateAssessment(false)
    }, 300000)

    return () => {
      clearInterval(timer as NodeJS.Timeout)
    }
  }, [])



  const SnackbarAction = (key: number, i: number) => {

    return (
      <React.Fragment>
        <Button onClick={() => {
          setCurrentSection(0)
          setData((prev) => {
            return {
              ...prev,
              sections: prev?.sections.filter((section: Section, index) => index !== i)
            } as Assessment
          })
          
          closeSnackbar(key)
        }}>
          Confirm
        </Button>
        <Button onClick={() => { closeSnackbar(key) }}>
          Dismiss
        </Button>
      </React.Fragment>
    )
  };

  const removeSection = (i: number): void => {

    if (data?.sections.find((val, ind) => ind === i)?.questions.findIndex((val, ind) => ind === 0) !== -1) {
      setData((prev) => {
        return {
          ...prev,
          sections: prev?.sections.filter((section: Section, index) => index !== i)
        } as Assessment
      })
    }
    else {
      enqueueSnackbar("You are overwriting data for following sections:" + data?.sections.find((section, index) => index === i)?.title + ". Please Confirm.", {
        variant: "info", persist: true, action: (key) => {
          return SnackbarAction(key as number, i)
        }
      })
    }

  }

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const getAssessmentData = async () => {
    try {
      const response = await getAssessment(location.search);
      console.log(response)
      setData(response);
      dataId.current = response._id
      setCurrentSection(0)
      setSelectedQues(response.sections.reduce((finalSection, currentSection) => {
        return {
          ...finalSection,
          questions: [...finalSection.questions, ...currentSection.questions]
        }
      }).questions.map((ques) => {
        return ques.questionDescription
      }))
      getTopicsData('?boardname=' + response.boardname + '&classname=' + response.classname + '&subjectname=' + response.subjectname)
    }
    catch (error) {
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const getTopicsData = async (QUERY: string) => {
    try {
      const response = await getTopics(QUERY)
      const TopicArr :Topic[] = []
      response.map((doc)=>{
        if(TopicArr.findIndex(el=>el.title===doc._id.topic)===-1){
          TopicArr.push({
            title:doc._id.topic,
            questionSet:[[doc._id.questions,doc.questions]]
          } as Topic)
        }
        else{
          const currentTopic = TopicArr[TopicArr.findIndex(el=>el.title===doc._id.topic)]
          TopicArr[TopicArr.findIndex(el=>el.title===doc._id.topic)] = {
            ...currentTopic,
            questionSet:[...currentTopic.questionSet,[doc._id.questions,doc.questions]]
          
          }
        }
      })
      console.log(TopicArr)
      setTopics(TopicArr)
      if(TopicArr.length===0){
        setNoQuestions(true) 
      }
      else{
        setComplexity("All")
      }
      setLoading(false)
      console.log(TopicArr)
      
    }
    catch (error) {
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  }







  const updateAssessment = async (redirect:boolean) => {

    await patchAssessment('?assessmentId=' + dataId.current+'&update=true', dataRef.current as Assessment)
    if(redirect){
      history.push(`/profile/confirm_assessment` + location.search)
    }
  };

  return (
    <div>
          {
      loading?<Box></Box>:<Grid container>
      <Navbar />
      <Grid container item lg={10} md={10} sm={11} xs={12} className={classes.mainWrapper}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box margin="20px 10px">
            <Header
              data={data}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              setData={setData}
              removeSection={removeSection}
              type={false}
            />
          </Box>
        </Grid>

      </Grid>




      <Grid container item lg={10} md={10} sm={11} xs={12} className={classes.mainWrapper}>


      {
          noQuestions?
          "No Questions available for current Selection. Please choose a different combination of board,subject and course.":
          <React.Fragment>
            {/* Filters container */}
        <FilterContainer complexity={complexity} setComplexity={setComplexity} topics={topics} currentTopic={currentTopic} setCurrentTopic={setCurrentTopic} setPage={setPage} />

         {/* Question container */}
        <QuestionContainer selectedQues={selectedQues} setSelectedQues={setSelectedQues} topics={topics} setTopics={setTopics} 
          currentTopic={currentTopic} complexity={complexity} setData={setData} data={data} page={page} setPage={setPage}
          rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} currentSection={currentSection} />
          </React.Fragment>
        
        }
        

        <Grid container justify="flex-end" className={classes.margin} >
          <Grid item xs={4} md={2} lg={1}>
            <FormControl>
              <Box>
                <Button
                  color="primary"
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={`/profile/assessment`}
                  startIcon={<ArrowBackIosIcon />}
                >
                  Back
                </Button>
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={4} md={2} lg={1}>
            <Box marginLeft="20px">
            <FormControl>
              <Button
                color="secondary"
                size="large"
                variant="contained"
                disabled={noQuestions}
                onClick={()=>updateAssessment(true)}
                endIcon={<ArrowForwardIosIcon />}
              >
                Next
              </Button>
            </FormControl>
            </Box>
            
          </Grid>

        </Grid>



      </Grid>


    </Grid>
    }
    </div>



  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User,
  assessmentfirstpart: state.assessmentReducers.assessmentSetp as Assessment,
});

export default connect(mapStateToProps)(Assessment_questions);
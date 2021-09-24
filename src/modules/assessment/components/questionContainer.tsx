import React, { FunctionComponent, Dispatch } from "react";
import {
    Box,
    Container,
    Divider,
    Grid,
    Paper,
    TablePagination,
} from "@material-ui/core";
import QuestionText from "../components/questionBody"
import {createStyles, makeStyles,Theme} from "@material-ui/core/styles"
import {Topic} from "../contracts/topics_interface"
import {Assessment} from "../contracts/assessment_interface"
import Red from "@material-ui/core/colors/red"
import QuestionButtons from "../components/questionButtons"
import {QuestionBody} from "../contracts/qustions_interface"
import { access } from "fs";

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
    selectedQues : string[],
    setSelectedQues:Dispatch<React.SetStateAction<string[]>>;
    topics: Topic[],
    setTopics: Dispatch<React.SetStateAction<Topic[]>>;
    currentTopic:number,
    complexity : string,
    setData: Dispatch<React.SetStateAction<Assessment|null>>;
    data: Assessment |null,
    page:number,
    setPage: Dispatch<React.SetStateAction<number>>
    rowsPerPage:number,
    setRowsPerPage:Dispatch<React.SetStateAction<number>>
    currentSection : number,
  }



const QuestionContainer: FunctionComponent<Props> = ({
    selectedQues,
    setSelectedQues,
    topics,
    setTopics,
    currentTopic,
    complexity,
    setData,
    data,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    currentSection,
  }) => {
      const classes = useStyles()
      return (
        <Grid item xs={8} sm={8} md={9} lg={9}>
          <Box marginLeft="20px" >
            <Paper elevation={3} >
              <Box>
                {complexity==="All"?topics[currentTopic].questionSet.reduce((acc,val)=>["All",[...acc[1],...val[1]]],["All",[]])[1].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((qans:QuestionBody, i:number) => {
                    return (
                      <div key={i}>
                        <Container disableGutters className={i % 2 === 1 ? classes.darkgray : undefined}>
                          <Box margin="0px 15px 15px 15px" padding="15px" >
                            <QuestionText qans={qans} selectedQues={selectedQues} setSelectedQues={setSelectedQues} data={data} setData={setData} currentSection={currentSection}  />
                            <QuestionButtons qans={qans} i={i}  selectedQues={selectedQues} setSelectedQues={setSelectedQues} 
                            setTopics={setTopics} currentTopic={currentTopic} complexity={complexity} setData={setData}
                            data={data} currentSection={currentSection} />
                          </Box>
                          <Divider />
                        </Container>
                      </div>
                  
                    );
                  }):
                topics[currentTopic].questionSet.filter(el=>el[0]===complexity)[0][1].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((qans:QuestionBody, i:number) => {
                    
                    return (
                      <div key={i}>
                        <Container disableGutters className={i % 2 === 1 ? classes.darkgray : undefined}>
                          <Box margin="0px 15px 15px 15px" padding="15px" >
                            <QuestionText qans={qans} selectedQues={selectedQues} setSelectedQues={setSelectedQues} data={data} setData={setData} currentSection={currentSection}  />
                            <QuestionButtons qans={qans} i={i}  selectedQues={selectedQues} setSelectedQues={setSelectedQues} 
                            setTopics={setTopics} currentTopic={currentTopic} complexity={complexity} setData={setData}
                            data={data} currentSection={currentSection} />
                          </Box>
                          <Divider />
                        </Container>
                      </div>
                  
                    );
                  })}
              </Box>
                                {
                    complexity==="All"?<TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Math.ceil(Number(topics[currentTopic].questionSet.reduce((acc,val)=>["All",[...acc[1],...val[1]]],["All",[]])[1].length))}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={((ev,val:number)=>{setPage(val)})}
                    onChangeRowsPerPage={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setRowsPerPage(parseInt(event.target.value));
                        setPage(0);
                      }}
                  />:<TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Math.ceil(Number(topics[currentTopic].questionSet.filter(el=>{
                      if(complexity==="All"){
                        return true
                      }
                      else{
                        return el[0]===complexity
                      }
                    })[0][1].length))}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={((ev,val:number)=>{setPage(val)})}
                    onChangeRowsPerPage={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setRowsPerPage(parseInt(event.target.value));
                        setPage(0);
                      }}
                  />
                  }

            </Paper>

          </Box>




        </Grid>
      )
  };

export default QuestionContainer

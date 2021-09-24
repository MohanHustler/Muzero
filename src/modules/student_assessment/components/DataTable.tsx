import {AssessmentAnswers} from "../contracts/assessment_answers"
import React, { Dispatch, FunctionComponent,useState ,useEffect} from 'react';
import { DataGrid } from "@material-ui/data-grid";
import {Container,Box} from "@material-ui/core"

interface Props {
    assessmentAnswers:AssessmentAnswers |null,
    currentSection: number;
    answeredQuestions:string[][][];
}

interface RowData{
    id:string,
    result:string,
    correct:string,
    your:string
}

interface QuestionResult {
    result: string,
    marks: number
}
  
export const DataTable: FunctionComponent<Props> = ({
    assessmentAnswers,
    currentSection,
    answeredQuestions 
  }) => {
    
    const columns = [
        { field: 'id', headerName: 'Qns', width: 70 },
        { field: 'result', headerName: 'Result', width: 80 },
        { field: 'marks', headerName: 'Marks', width: 80 },
        { field: 'correct', headerName: 'Correct', width: 80 },
        {
          field: 'your',
          headerName: 'Your Ans.',
          type: 'string',
          width: 80,
        }
      ];

    const [rows,setRows] = useState<RowData[]>([])

    // {
    //     assessmentAnswers?.find((val,ind)=>ind===currentSection)?.answers.map((answer,index)=>{
            // return [(index+1).toString(),"Check",answer.join(","),]
    //     }).forEach((record,index)=>{
    //         console.log(record)
    //         return <TableRow key={index}>
    //             {record.map((data,ind)=>{
    //                 return <TableCell key={ind}>
    //                     {data}
    //                 </TableCell>
    //             })}
    //         </TableRow>
    //     })
    // }

    
    
    useEffect(()=>{
        setRows(()=>{
            return assessmentAnswers?.find((val,ind)=>ind===currentSection)?.map((question,index)=>{
                return {id:question.index.toString(), result:question.result.toString(),marks:question.marks, correct:question.correct , your:question.your} as RowData
            }) as RowData[]
        })
    },[currentSection])

      
    return (
        <React.Fragment>
            
            <Container style={{width:"100%",marginTop:"10px",display:"flex"}}>
            <DataGrid autoPageSize disableColumnMenu rows={rows} columns={columns} />
            </Container>
            
            
            
        </React.Fragment>
    )
  }
import React,{useState,useEffect} from "react"
import { Assessment } from "../../assessment/contracts/assessment_interface"
import {SectionData, QuestionData, AssessmentData} from "../contracts/AssessmentData"



const useAssessment = (assessment:Assessment|null) : [Assessment|null,React.Dispatch<React.SetStateAction<Assessment|null>>,AssessmentData|null,React.Dispatch<React.SetStateAction<AssessmentData|null>>,()=>void,()=>void,(sectionIndex:number)=>void,(sectionIndex:number,questionIndex:number)=>void,(sectionIndex:number,questionIndex:number)=>void,(sectionIndex:number,questionIndex:number)=>void]=>{
    const [data,setData] = useState<Assessment | null>(assessment)


    const createAssessmentData=(assessmentFile:Assessment) : AssessmentData =>{
        
        return {
            unfocussed:0,
            unfocussedTime:0,
            sectionsData:assessmentFile?.sections.map((section,sectionIndex)=>{
                return {
                    visits : sectionIndex===0?1:0, 
                    questions : section.questions.map((question,questionIndex)=>{
                        return {
                            visits:questionIndex===0?1:0,
                            attempts:0,
                            timeSpent:0
                        } as QuestionData
                    })
                } as SectionData
            }) as SectionData[]
            
        } 
    }
    
    
    
    useEffect(()=>{
        console.log("triggered")
        if(data===null){
            return 
        }
        else{
            console.log(createAssessmentData(data as Assessment))
            setAssessmentData(createAssessmentData(data as Assessment))
        }
    },[data])

    const [assessmentData,setAssessmentData] = useState<AssessmentData|null>(
        {
            unfocussed:0,
            unfocussedTime:0,
            sectionsData:[{
                visits:0,
                questions:[{
                    visits:0,
                    attempts:0,
                    timeSpent:0
                }]
            }] as SectionData[]
        })
        

    function addUnfocussed(){
        setAssessmentData((prev)=>{
            return {
                ...prev,
                unfocussed:prev?.unfocussed as number+1
            } as AssessmentData
        })
    }
    function addUnfocussedTime(){
        setAssessmentData((prev)=>{
            return {
                ...prev,
                unfocussedTime:prev?.unfocussedTime as number+1
            } as AssessmentData
        })
    }

    function addVisitSection(sectionIndex:number){
        setAssessmentData((prev)=>{
            return {
                ...prev,
                sectionsData:prev?.sectionsData.map((section,index)=>{
                    if(index!==sectionIndex){
                        return section
                    }
                    else{
                        return {
                            ...section,
                            visits:section.visits+1
                        }
                    }
                })
            } as AssessmentData
        })
    }
    
    
    function addTimeTakenQuestion(sectionIndex:number,questionIndex:number){
        setAssessmentData((prev)=>{
            return {
                ...prev,
                sectionsData:prev?.sectionsData.map((section,index)=>{
                    if(index!==sectionIndex){
                        return section
                    }
                    else{
                        return {
                            ...section,
                            questions:section.questions.map((question,ind)=>{
                                if(ind!==questionIndex){
                                    return question
                                }
                                else{
                                    return {
                                        ...question,
                                        timeSpent:question.timeSpent+1
                                    }
                                }
                            })
                        }
                    }
                })
            } as AssessmentData
        })

    }
    function addVisitQuestion(sectionIndex:number,questionIndex:number){
        setAssessmentData((prev)=>{
            console.log(prev)
            return {
                ...prev,
                sectionsData:prev?.sectionsData.map((section,index)=>{
                    if(index!==sectionIndex){
                        return section
                    }
                    else{
                        return {
                            ...section,
                            questions:section.questions.map((question,ind)=>{
                                if(ind!==questionIndex){
                                    return question
                                }
                                else{
                                    return {
                                        ...question,
                                        visits:question.visits+1
                                    }
                                }
                            })
                        }
                    }
                })
            } as AssessmentData
        })

    }
    function addAttemptsQuestion(sectionIndex:number,questionIndex:number){
        setAssessmentData((prev)=>{
            return {
                ...prev,
                sectionsData:prev?.sectionsData.map((section,index)=>{
                    if(index!==sectionIndex){
                        return section
                    }
                    else{
                        return {
                            ...section,
                            questions:section.questions.map((question,ind)=>{
                                if(ind!==questionIndex){
                                    return question
                                }
                                else{
                                    return {
                                        ...question,
                                        attempts:question.attempts+1
                                    }
                                }
                            })
                        }
                    }
                })
            } as AssessmentData
        })

    }
    return [data,setData,assessmentData,setAssessmentData,addUnfocussed,addUnfocussedTime,addVisitSection,addVisitQuestion,addTimeTakenQuestion,addAttemptsQuestion]
}

export default useAssessment
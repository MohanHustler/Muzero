export interface QuestionData {
    visits : number ,
    attempts : number ,
    timeSpent : number
}

export interface SectionData {
    visits : number,
    questions : QuestionData[]
}
export interface AssessmentData {
    unfocussed:number,
    unfocussedTime:number,
    sectionsData:SectionData[]
};
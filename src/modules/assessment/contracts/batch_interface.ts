import {Student} from "./student_interface"
export interface Batch {
    _id: string,
    boardname: string, 
	classname: string,
	subjectname: string,
    batchfriendlyname: string
    batchstartdate: Date
    batchenddate: Date
    batchicon: string
    students: Student[],
}
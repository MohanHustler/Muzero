export interface excelRow {
    row:string|number,
    error:string
  }
  
export interface UploadDataResponse {
    excelData:excelRow[]
} 


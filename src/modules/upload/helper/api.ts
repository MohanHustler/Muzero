import axios from "axios"
import { UPLOAD_DATA } from "./routes"
import {UploadDataResponse} from "./contracts"

export const dataupload =async  (formData: FormData) =>{
    const response = await axios.post<UploadDataResponse>(UPLOAD_DATA, formData)
    return response.data.excelData
}

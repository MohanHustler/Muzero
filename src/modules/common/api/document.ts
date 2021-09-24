import axios from 'axios';
import { Organization, Tutor } from '../contracts/user';
import { GET_KYC_DOCUMENT_UPLOAD_URL, UPDATE_KYC_DOCUMENT_URL, UPLOAD_ZIP } from './routes';

interface Document {
  fileName: string;
  contentType: string;
  contentLength: number;
}

interface UploadUrlForKycDocumentResponse {
  url: string;
  uuid: string;
}

export const fetchUploadUrlForKycDocument = async (document: Document) => {
  const response = await axios.get<UploadUrlForKycDocumentResponse>(
    GET_KYC_DOCUMENT_UPLOAD_URL,
    { params: document }
  );

  return response.data;
};

export const uploadKycDocument = async (url: string, data: FormData) => {
  const response = await axios.put(url, data);

  return response.data;
};

export const updateKycDocument = async (
  data: {
    kycDocType: string;
    kycDocFormat: string;
    kycDocLocation: string;
  }[]
) => {
  const response = await axios.post(
    UPDATE_KYC_DOCUMENT_URL, data);

  return response.data;
};

export const uploadAadhaarZip = async (data: FormData) => {
  const response = await axios.post(UPLOAD_ZIP, data);
  return response.data;
}
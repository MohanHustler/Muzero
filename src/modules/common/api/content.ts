import axios from 'axios';
import {
  CREATE_ORG_CHAPTER_CONTENT,
  DELETE_CHAPTER_CONTENT,
  GET_ORG_CHAPTER_CONTENT_UPLOAD_URL,
} from './routes';
import {
  ChapterContentFileRequest,
  CreateChapterContentRequest,
  DeleteChapterContentRequest,
  ChapterContentUploadUrlRequest,
  ChapterContentUploadUrlResponse,
} from '../contracts/academic';

export const createOrgChapterContent = async (
  data: CreateChapterContentRequest
) => {
  const response = await axios.post(CREATE_ORG_CHAPTER_CONTENT, data);

  return response.data;
};

export const createOrgChapterContentFile = async (
  data: ChapterContentFileRequest
) => {
  const response = await axios.post(CREATE_ORG_CHAPTER_CONTENT, data);

  return response.data;
};

export const deleteOrgChapterContent = async (
  data: DeleteChapterContentRequest
) => {
  const response = await axios.delete(DELETE_CHAPTER_CONTENT, {
    data,
  });
  return response.data;
};

export const fetchOrgChapterContentUploadUrl = async (
  params: ChapterContentUploadUrlRequest
) => {
  const response = await axios.get<ChapterContentUploadUrlResponse>(
    GET_ORG_CHAPTER_CONTENT_UPLOAD_URL,
    {
      params,
    }
  );

  return response.data;
};
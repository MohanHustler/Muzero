import { ChapterContent } from './chapter_content';

export interface Chapter {
  name: string;
  contents: ChapterContent[];
  isMaster: boolean;
  orderNo?: number;
}

import { Chapter } from '../contracts/chapter';

type ChapterStubProp = Partial<Chapter> & { name: string, isMaster: boolean };

export const getChapterStub = ({ name, contents = [], isMaster }: ChapterStubProp): Chapter => ({
  name,
  contents,
  isMaster,
});

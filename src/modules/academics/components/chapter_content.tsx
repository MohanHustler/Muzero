import React, { FunctionComponent } from 'react';
import { StackActionItem } from '../../common/contracts/stack_action';
import { Chapter } from '../contracts/chapter';
import { Course } from '../contracts/course';
import { QuizMetaData } from '../contracts/quiz_meta';
import { ContentType } from '../enums/content_type';
import Documents from './content_types/documents';
import EmbeddedLinks from './content_types/embedded_links';
import Images from './content_types/images';
import Slides from './content_types/slides';
import Videos from './content_types/videos';
import Quizes from './content_types/quizes';

interface Props {
  chapter: Chapter;
  activeContentType: string;
  emitStackAction: (action: StackActionItem) => any;
  activeCourse: Course;
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
  activeChapterIndex: number;
  quizMeta: QuizMetaData;
  setQuizMeta: (quiz: QuizMetaData) => void;
}

const ChapterContent: FunctionComponent<Props> = ({
  chapter,
  activeContentType,
  emitStackAction,
  activeCourse,
  chapters,
  setChapters,
  activeChapterIndex,
  quizMeta,
  setQuizMeta
}) => {
  switch (activeContentType) {
    case ContentType.SLIDE:
      return (
        <Slides
          data={chapter.contents.filter(
            (content) => ContentType.SLIDE === content.contenttype
          )}
          emitStackAction={emitStackAction}
        />
      );
    case ContentType.EMBED_LINK:
      return (
        <EmbeddedLinks
          data={chapter.contents.filter(
            (content) => ContentType.EMBED_LINK === content.contenttype
          )}
          emitStackAction={emitStackAction}
        />
      );
    case ContentType.VIDEO:
      return (
        <Videos
          data={chapter.contents.filter(
            (content) => ContentType.VIDEO === content.contenttype
          )}
          emitStackAction={emitStackAction}
        />
      );
    case ContentType.IMAGE:
      return (
        <Images
          data={chapter.contents.filter(
            (content) => ContentType.IMAGE === content.contenttype
          )}
          emitStackAction={emitStackAction}
        />
      );
    case ContentType.DOCUMENT:
      return (
        <Documents
          data={chapter.contents.filter(
            (content) => ContentType.DOCUMENT === content.contenttype
          )}
          emitStackAction={emitStackAction}
        />
      );
    default:
      return (
        <Quizes
          quizzes={chapter.contents.filter(
            (content) => ContentType.QUIZ === content.contenttype
          )}
          chapterName={chapter.name}
          activeCourse={activeCourse}
          emitStackAction={emitStackAction}
          chapters={chapters}
          setChapters={setChapters}
          activeChapterIndex={activeChapterIndex}
          quizMeta={quizMeta}
          setQuizMeta={setQuizMeta}
        />
      );
  }
};

export default ChapterContent;

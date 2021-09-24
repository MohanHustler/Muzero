import React, { FunctionComponent, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Box, Container, FormHelperText, Grid } from '@material-ui/core';
import { PictureAsPdf as PdfIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import PhotoIcon from '../../../../assets/images/images.png';
import DocumentsIcon from '../../../../assets/images/documents.png';
import VideoIcon from '../../../../assets/images/video.png';
import LinkIcon from '../../../../assets/images/embed-link.png';
import ListIcon from '../../../../assets/images/quiz.png';
// import { uniqBy } from 'lodash';
import {
  StackActionItem,
  ChapterActionItem
} from '../../../common/contracts/stack_action';
import { Chapter } from '../../contracts/chapter';
import { ContentType } from '../../enums/content_type';
import {
  createCourseChapter,
  fetchCourseChaptersList,
  fetchTutorCoursesList,
  fetchChapterContentUploadUrl,
  updateChapterContent as updateChapterContentRequest,
  uploadFileOnUrl,
  createChapterContent as createChapterContentRequest,
  createChapterContentFile,
  fetchChapterContent,
  deleteChapterContent,
  updateChapter,
  deleteChapter
} from '../../../common/api/academics';
import {
  generateCourseChaptersSchema,
  generateQuestionSchemaForServer
} from '../../helpers';
import { getChapterStub } from '../../stubs/chapter';
import { Tutor } from '../../../common/contracts/user';
import { Course } from '../../contracts/course';
import Button from '../../../common/components/form_elements/button';
import ChapterContent from '../../components/chapter_content';
import CourseContentSidebar from '../../components/course_content_sidebar';
import Navbar from '../../../common/components/navbar';
import SelectContentTypeButton from '../../components/select_content_type_button';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { exceptionTracker } from '../../../common/helpers';
import { courseContentStyles } from '../../../common/styles';
import { QuestionApp } from '../../contracts/question';
import { QuizMetaData } from '../../contracts/quiz_meta';
import axios from 'axios';

interface Props extends WithStyles<typeof courseContentStyles> {
  profile: Tutor;
}

const TutorCourses: FunctionComponent<Props> = ({ profile, classes }) => {
  const [activeContentType, setActiveContentType] = useState(ContentType.IMAGE);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [redirectTo, setRedirectTo] = useState('');
  const [serverError, setServerError] = useState('');
  const [quizName] = useState(
    Math.round(new Date().getTime() / 1000) + '_stamp_' + ContentType.QUIZ
  );
  const [quizMeta, setQuizMeta] = useState<QuizMetaData>({
    title: '',
    duration: 0,
    marks: 0,
    contentname: ''
  });
  const [isReorderChapter, setIsReorderChapter] = useState(false);

  /**
   * Actions stack is the collection of actions occured on the item.
   * These actions then could be then followed to reach the desired state
   * for the item.
   *
   * For example, There could be NULL -> CREATE -> UPDATE operation for
   * item but without this stack all we would know about the UPDATE
   * operation of the item. But with Actions Stack we could follow the
   * trail and reach the desired state for the item.
   */
  const [stackActions, setStackActions] = useState<
    StackActionItem<ContentType>[]
  >([]);
  const [chapterActions, setChapterActions] = useState<ChapterActionItem[]>([]);

  const activeCourse = courses[activeCourseIndex];
  const activeChapter = chapters[activeChapterIndex];

  // Everytime, a new course is selected we'd fetch the chapters for the
  // selected course.
  useEffect(() => {
    (async () => {
      try {
        const coursesList = await fetchTutorCoursesList();
        const course = coursesList[activeCourseIndex];
        if (course === undefined) return;

        const {
          masterChapters,
          customChapters
        } = await fetchCourseChaptersList({
          boardname: course.board,
          classname: course.className,
          subjectname: course.subject
        });

        let structuredChapters = generateCourseChaptersSchema(
          masterChapters,
          customChapters
        );

        structuredChapters = structuredChapters.map((chapter, index) => {
          return { ...chapter, orderNo: index + 1 };
        });

        setActiveChapterIndex(0);
        setCourses(coursesList);
        setChapters(structuredChapters);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [profile.mobileNo, activeCourseIndex]);

  // Everytime, a new chapter is selected we'd fetch the content for the
  // selected chapter.
  useEffect(() => {
    getChapterContent();
    // eslint-disable-next-line
  }, [profile.mobileNo, activeChapterIndex, activeChapter, activeCourse]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const getChapterContent = async () => {
    if (activeCourse === undefined || activeChapter === undefined) return;

    try {
      const chapterContent = await fetchChapterContent({
        boardname: activeCourse.board,
        classname: activeCourse.className,
        subjectname: activeCourse.subject,
        chaptername: activeChapter.name
      });

      const chapterIndex = chapters.findIndex(
        (chapter) => chapter.name === chapterContent.chaptername
      );

      const chaptersList = [...chapters];

      // @ts-ignore
      chaptersList[chapterIndex].contents = chapterContent.contents;

      setChapters(chaptersList);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const createChapter = (name: string) => {
    if (activeCourse === undefined) return;

    setChapters([...chapters, getChapterStub({ name, isMaster: false })]);

    const createChapterItem = {
      chaptername: name,
      boardname: activeCourse.board,
      classname: activeCourse.className,
      subjectname: activeCourse.subject
    };
    setChapterActions([
      ...chapterActions,
      {
        type: StackActionType.CREATE,
        payload: createChapterItem
      }
    ]);
  };

  const editChapterItem = (index: number, name: string) => {
    const clonedChapters = [...chapters];
    const chapter = clonedChapters[index];
    const updateChapterItem = {
      chaptername: chapter.name,
      boardname: activeCourse.board,
      classname: activeCourse.className,
      subjectname: activeCourse.subject,
      newchaptername: name !== undefined ? name : ''
    };
    setChapterActions([
      ...chapterActions,
      {
        type: StackActionType.UPDATE,
        payload: updateChapterItem
      }
    ]);
    clonedChapters.splice(index, 1, getChapterStub({ name, isMaster: false }));
    setChapters(clonedChapters);
  };

  const removeChapterItem = (index: number) => {
    const clonedChapters = [...chapters];
    const chapter = clonedChapters[index];
    const deleteChapterItem = {
      chaptername: chapter.name,
      boardname: activeCourse.board,
      classname: activeCourse.className,
      subjectname: activeCourse.subject
    };

    setChapterActions([
      ...chapterActions,
      {
        type: StackActionType.DELETE,
        payload: deleteChapterItem
      }
    ]);

    clonedChapters.splice(index, 1);
    setChapters(clonedChapters);
  };

  const orderChapters = (chapters: Chapter[]) => {
    setChapters(chapters);
    setIsReorderChapter(true);
  };

  const handleSubmitChapterActions = () => {
    if (activeCourse === undefined) return;

    let actions = [...chapterActions];

    // if delete action presents then remove create and update actions
    let deleteActionArr = actions.filter(
      (action) => action.type === StackActionType.DELETE
    );
    deleteActionArr.forEach((el) => {
      let updateActions = actions.filter(
        (data) =>
          data.type === StackActionType.UPDATE &&
          data.payload.newchaptername === el.payload.chaptername
      );

      // remove create actions if update and delete present
      let createIndex;
      updateActions.forEach((updatedEl) => {
        createIndex = actions.findIndex(
          (data) =>
            data.type === StackActionType.CREATE &&
            data.payload.chaptername === updatedEl.payload.chaptername
        );
        if (createIndex !== -1) {
          actions.splice(createIndex, 1);
        }
      });

      // remove update & delete action if delete present
      let updateIndex = actions.findIndex(
        (data) =>
          data.type === StackActionType.UPDATE &&
          data.payload.newchaptername === el.payload.chaptername
      );
      if (updateIndex !== -1) {
        actions.splice(updateIndex, 1);
        let index = actions.findIndex(
          (data) =>
            data.type === StackActionType.DELETE &&
            data.payload.chaptername === el.payload.chaptername
        );
        actions.splice(index, 1);
      }

      // remove delete action if both create and update present
      if (createIndex !== -1 && updateIndex !== -1) {
        let deleteIndex = actions.findIndex(
          (action) => action.payload.chaptername === el.payload.chaptername
        );
        actions.splice(deleteIndex, 1);
      }

      // remove delete & create action if delete present
      let deleteCreateIndex = actions.findIndex(
        (data) =>
          data.type === StackActionType.CREATE &&
          data.payload.chaptername === el.payload.chaptername
      );
      if (deleteCreateIndex !== -1) {
        actions.splice(deleteCreateIndex, 1);
        let index = actions.findIndex(
          (data) =>
            data.type === StackActionType.DELETE &&
            data.payload.chaptername === el.payload.chaptername
        );
        actions.splice(index, 1);
      }
    });

    actions.forEach(async (action) => {
      try {
        if (StackActionType.CREATE === action.type) {
          await createCourseChapter(action.payload);
        } else if (StackActionType.UPDATE === action.type) {
          // @ts-ignore
          await updateChapter(action.payload);
        } else if (StackActionType.DELETE === action.type) {
          await deleteChapter(action.payload);
        }
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    });
    if (isReorderChapter) {
      axios.put('http://localhost:3004/chapters', chapters);
    }
    setChapterActions([]);
    setIsReorderChapter(false);
  };

  const updateCourse = async () => {
    if (activeCourse === undefined) return;

    // TODO: Check usage of this code => removing multiple create quiz
    // const uniqueLastOperationOnItem = uniqBy(stackActions.reverse(), (v) => {
    //   if (ContentType.QUIZ === v.payload.type) {
    //     return JSON.stringify([v.type]);
    //   }

    //   return JSON.stringify([
    //     v.payload.type,
    //     v.payload.data.name ? v.payload.data.name : v.payload.data
    //   ]);
    // }).reverse();

    const uniqueLastOperationOnItem = stackActions;

    if (uniqueLastOperationOnItem.length === 0) {
      setServerError('No content added');
    }

    try {
      for (let i = 0; i < uniqueLastOperationOnItem.length; ++i) {
        const action = uniqueLastOperationOnItem[i];
        if (StackActionType.CREATE === action.type) {
          const stackActionPayloadType = action.payload.type;

          if (
            stackActionPayloadType === ContentType.DOCUMENT ||
            stackActionPayloadType === ContentType.IMAGE ||
            stackActionPayloadType === ContentType.SLIDE ||
            stackActionPayloadType === ContentType.VIDEO
          ) {
            const file = action.payload.data as File;

            // TODO: Pass course & chapter from with action.
            const serverBucket = await fetchChapterContentUploadUrl({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contenttype: file.type,
              contentlength: file.size
            });

            await uploadFileOnUrl(serverBucket.url, file);

            // TODO: Pass course & chapter from with action.
            const response = await createChapterContentFile({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contenttype: action.payload.type,
              contentlength: file.size,
              contentname: new Date().getTime() + '_stamp_' + file.name,
              uuid: serverBucket.uuid
            });
            setServerError(response.message);
          } else if (stackActionPayloadType === ContentType.EMBED_LINK) {
            const embedLink = action.payload.data as string;

            // TODO: Pass course & chapter from with action.
            const response = await createChapterContentRequest({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contenttype: action.payload.type,
              contentname: embedLink,
              title: 'string',
              duration: 1,
              marks: 2,
              uuid: embedLink
            });
            setServerError(response.message);
          } else if (stackActionPayloadType === ContentType.QUIZ) {
            const questions = action.payload.data as QuestionApp[];

            const newQuizes = chapters[activeChapterIndex].contents.filter(
              (quiz) =>
                quiz.chapter === activeChapter.name &&
                quiz.contenttype === ContentType.QUIZ
            );

            // TODO: Pass course & chapter from with action.
            const response = await createChapterContentRequest({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contenttype: action.payload.type,
              contentname:
                Math.floor(100000000 + Math.random() * 900000000) +
                '_stamp_' +
                ContentType.QUIZ,
              title: newQuizes[i].title,
              duration: newQuizes[i].duration,
              marks: newQuizes[i].marks,
              questions: questions.map((question) =>
                generateQuestionSchemaForServer(question)
              )
            });
            if (response.message === 'Success') {
              getChapterContent();
            }

            setServerError(response.message);
          }
        } else if (StackActionType.DELETE === action.type) {
          const stackActionPayloadType = action.payload.type;

          if (
            stackActionPayloadType === ContentType.DOCUMENT ||
            stackActionPayloadType === ContentType.IMAGE ||
            stackActionPayloadType === ContentType.SLIDE ||
            stackActionPayloadType === ContentType.VIDEO
          ) {
            const file = action.payload.data as File;

            const response = await deleteChapterContent({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contentname: file.name
            });
            setServerError(response.message);
          } else if (stackActionPayloadType === ContentType.EMBED_LINK) {
            const embedLink = action.payload.data as string;

            const response = await deleteChapterContent({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contentname: embedLink
            });
            setServerError(response.message);
          } else if (stackActionPayloadType === ContentType.QUIZ) {
            const contentName = action.payload.data as string;
            const response = await deleteChapterContent({
              boardname: activeCourse.board,
              chaptername: activeChapter.name,
              classname: activeCourse.className,
              subjectname: activeCourse.subject,
              contentname: contentName
            });
            setServerError(response.message);
          }
        } else if (StackActionType.UPDATE === action.type) {
          const questions = action.payload.data as QuestionApp[];

          // TODO: Pass course & chapter from with action.
          const response = await updateChapterContentRequest({
            boardname: activeCourse.board,
            chaptername: activeChapter.name,
            classname: activeCourse.className,
            subjectname: activeCourse.subject,
            contenttype: action.payload.type,
            contentname: quizMeta.contentname,
            title: quizMeta.title,
            duration: quizMeta.duration,
            marks: quizMeta.marks,
            questions: questions.map((question) =>
              generateQuestionSchemaForServer(question)
            )
          });
          setServerError(response.message);
        }
      }

      // Destroy previous stack actions so nothing gets done twice.
      setStackActions([]);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        setStackActions([]);
        setServerError(error.response?.data.message);
      }
    }
  };

  const createChapterContent = (
    chapterIndex: number,
    contentType: ContentType,
    data: any
  ) => {
    let chaptersList = [...chapters];

    switch (contentType) {
      case ContentType.DOCUMENT:
      case ContentType.IMAGE:
      case ContentType.SLIDE:
      case ContentType.VIDEO:
        const file = data as File;

        chaptersList[chapterIndex].contents = [
          ...chaptersList[chapterIndex].contents,
          {
            chapter: activeChapter.name,
            contentname: file.name,
            contenttype: contentType
          }
        ];

        break;
      case ContentType.EMBED_LINK:
        const embedLink = data as string;

        chaptersList[chapterIndex].contents = [
          ...chaptersList[chapterIndex].contents,
          {
            chapter: activeChapter.name,
            contentname: embedLink,
            contenttype: contentType,
            uuid: embedLink
          }
        ];

        break;
      case ContentType.QUIZ:
        const questions = data as QuestionApp[];

        chaptersList[chapterIndex].contents = [
          ...chaptersList[chapterIndex].contents,
          {
            chapter: activeChapter.name,
            contentname:
              Math.floor(100000000 + Math.random() * 900000000) +
              '_stamp_' +
              ContentType.QUIZ,
            contenttype: contentType,
            questions: []
          }
        ];

        const chapterQuizContentIndex =
          chaptersList[chapterIndex].contents.length - 1;
        chaptersList[chapterIndex].contents[
          chapterQuizContentIndex
        ].questions = questions;
        chaptersList[chapterIndex].contents[chapterQuizContentIndex].title =
          quizMeta.title;
        chaptersList[chapterIndex].contents[chapterQuizContentIndex].duration =
          quizMeta.duration;
        chaptersList[chapterIndex].contents[chapterQuizContentIndex].marks =
          quizMeta.marks;
        break;
      default:
        throw new Error(`Invalid content type [${contentType}].`);
    }

    setChapters(chaptersList);
  };

  const removeChapterContent = async (
    chapterIndex: number,
    contentType: ContentType,
    data: any
  ) => {
    let chaptersList = [...chapters];

    switch (contentType) {
      case ContentType.DOCUMENT:
      case ContentType.IMAGE:
      case ContentType.SLIDE:
      case ContentType.VIDEO:
        const file = data as File;

        chaptersList[chapterIndex].contents = chaptersList[
          chapterIndex
        ].contents.filter(
          (chapter) =>
            chapter.contenttype !== contentType ||
            chapter.contentname !== file.name
        );

        break;
      case ContentType.EMBED_LINK:
        const embedLink = data as string;

        chaptersList[chapterIndex].contents = chaptersList[
          chapterIndex
        ].contents.filter(
          (chapter) =>
            chapter.contenttype !== contentType || chapter.uuid !== embedLink
        );

        break;
      case ContentType.QUIZ:
        const contentName = data as string;
        chaptersList[chapterIndex].contents = chaptersList[
          chapterIndex
        ].contents.filter((chapter) => chapter.contentname !== contentName);
        break;
      default:
        throw new Error(`Invalid content type [${contentType}].`);
    }
    setChapters(chaptersList);
  };

  const updateChapterContent = (
    chapterIndex: number,
    contentType: ContentType,
    data: any
  ) => {
    let chaptersList = [...chapters];

    switch (contentType) {
      case ContentType.QUIZ:
        const questions = data as QuestionApp[];

        const chapterQuizContentIndex = chaptersList[
          chapterIndex
        ].contents.findIndex(
          (content) => ContentType.QUIZ === content.contenttype
        );

        if (chapterQuizContentIndex === -1) return;

        if (
          chaptersList &&
          chaptersList[chapterIndex] &&
          chaptersList[chapterIndex].contents &&
          chaptersList[chapterIndex].contents[chapterQuizContentIndex] &&
          chaptersList[chapterIndex].contents[chapterQuizContentIndex].questions
        ) {
          chaptersList[chapterIndex].contents[
            chapterQuizContentIndex
          ].questions = questions;
        }

        break;
      default:
        throw new Error(`Invalid content type [${contentType}].`);
    }

    setChapters(chaptersList);
  };

  const handleEmittedStackAction = (action: StackActionItem<ContentType>) => {
    setServerError('');
    setStackActions((currentActions) => [...currentActions, action]);

    switch (action.type) {
      case StackActionType.CREATE:
        createChapterContent(
          activeChapterIndex,
          action.payload.type,
          action.payload.data
        );
        break;
      case StackActionType.DELETE:
        removeChapterContent(
          activeChapterIndex,
          action.payload.type,
          action.payload.data
        );
        break;
      case StackActionType.UPDATE:
        updateChapterContent(
          activeChapterIndex,
          action.payload.type,
          action.payload.data
        );
        break;
      default:
        throw new Error(`Invalid bucket action type [${action.type}].`);
    }
  };

  return (
    <div>
      <Navbar />

      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CourseContentSidebar
              activeChapterIndex={activeChapterIndex}
              chapters={chapters}
              handleClickOnChapter={(chapterIndex) =>
                setActiveChapterIndex(chapterIndex)
              }
              handleAddChapter={createChapter}
              handleUpdateChapters={(chapters) => orderChapters(chapters)}
              activeCourseIndex={activeCourseIndex}
              courses={courses}
              handleSelectCourse={(courseIndex) =>
                setActiveCourseIndex(() => courseIndex)
              }
              editChapterItem={(chapterIndex, name) =>
                editChapterItem(chapterIndex, name)
              }
              removeChapterItem={(chapterIndex) =>
                removeChapterItem(chapterIndex)
              }
              handleSubmitChapterActions={handleSubmitChapterActions}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box
              bgcolor="white"
              marginY="30px"
              boxShadow="0px 4px 20px rgba(7, 40, 137, 0.0417)"
              borderRadius="5px"
              height="81vh"
              overflow="scroll"
            >
              <Box padding="20px" borderBottom="1px solid #DCDFF1">
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box component="h2" className={classes.courseHeadingText}>
                      {activeChapter &&
                        activeChapter.name &&
                        `Chapter ${activeChapterIndex + 1} - ${
                          activeChapter.name
                        }`}
                    </Box>
                    <FormHelperText className={classes.helperText}>
                      Select how this flow should be shown
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      className={classes.saveBtn}
                    >
                      <Button
                        disableElevation
                        color="primary"
                        size="large"
                        variant="contained"
                        onClick={updateCourse}
                      >
                        Save flow
                      </Button>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" color="red">
                      {serverError}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box padding="20px">
                <Box display="flex" justifyContent="space-between">
                  <SelectContentTypeButton
                    icon={<img src={PhotoIcon} alt="upload image" />}
                    isActive={activeContentType === ContentType.IMAGE}
                    onClick={() => setActiveContentType(ContentType.IMAGE)}
                  >
                    Upload Images
                  </SelectContentTypeButton>

                  <SelectContentTypeButton
                    icon={<PdfIcon />}
                    isActive={activeContentType === ContentType.SLIDE}
                    onClick={() => setActiveContentType(ContentType.SLIDE)}
                  >
                    Add PDF
                  </SelectContentTypeButton>

                  <SelectContentTypeButton
                    icon={<img src={DocumentsIcon} alt="upload image" />}
                    isActive={activeContentType === ContentType.DOCUMENT}
                    onClick={() => setActiveContentType(ContentType.DOCUMENT)}
                  >
                    Add Docs
                  </SelectContentTypeButton>

                  <SelectContentTypeButton
                    icon={<img src={VideoIcon} alt="upload image" />}
                    isActive={activeContentType === ContentType.VIDEO}
                    onClick={() => setActiveContentType(ContentType.VIDEO)}
                  >
                    Upload Video
                  </SelectContentTypeButton>

                  <SelectContentTypeButton
                    icon={<img src={LinkIcon} alt="upload image" />}
                    isActive={activeContentType === ContentType.EMBED_LINK}
                    onClick={() => setActiveContentType(ContentType.EMBED_LINK)}
                  >
                    Embed Link
                  </SelectContentTypeButton>

                  <SelectContentTypeButton
                    icon={<img src={ListIcon} alt="upload image" />}
                    isActive={activeContentType === ContentType.QUIZ}
                    onClick={() => setActiveContentType(ContentType.QUIZ)}
                  >
                    Add Quiz
                  </SelectContentTypeButton>
                </Box>

                {activeChapter && (
                  <ChapterContent
                    chapter={activeChapter}
                    activeContentType={activeContentType}
                    emitStackAction={handleEmittedStackAction}
                    activeCourse={activeCourse}
                    chapters={chapters}
                    setChapters={setChapters}
                    activeChapterIndex={activeChapterIndex}
                    quizMeta={quizMeta}
                    setQuizMeta={setQuizMeta}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(courseContentStyles)(TutorCourses);

import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Select
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { Chapter } from '../contracts/chapter';
import { Course } from '../contracts/course';
import AddChapterModal from '../components/add_chapter_modal';
import ChapterListItem from '../components/chapter_list_item';
import Button from '../../common/components/form_elements/button';
import Tooltip from '../../common/components/tooltip';
import { courseContentStyles } from '../../common/styles';

function reorder(list: Chapter[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

interface Props extends WithStyles<typeof courseContentStyles> {
  activeChapterIndex: number;
  chapters: Chapter[];
  handleClickOnChapter: (chapterIndex: number) => any;
  handleAddChapter: (name: string) => any;
  handleUpdateChapters: (chapters: Chapter[]) => any;
  activeCourseIndex: number;
  courses: Course[];
  handleSelectCourse: (courseIndex: number) => any;
  editChapterItem: (index: number, name: string) => any;
  removeChapterItem: (index: number) => any;
  handleSubmitChapterActions: () => void;
}

const CourseContentSidebar: FunctionComponent<Props> = ({
  activeChapterIndex,
  chapters,
  handleClickOnChapter,
  handleAddChapter,
  handleUpdateChapters,
  activeCourseIndex,
  courses,
  handleSelectCourse,
  editChapterItem,
  removeChapterItem,
  handleSubmitChapterActions,
  classes
}) => {
  const [openAddChapterModal, setOpenAddChapterModal] = useState(false);

  const addChapter = async (name: string) => {
    setOpenAddChapterModal(false);
    handleAddChapter(name);
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let items = reorder(
      chapters,
      result.source.index,
      result.destination.index
    );
    items = items.map((item, index) => {
      if (item.orderNo !== index + 1) {
        return { ...item, orderNo: index + 1 };
      }
      return item;
    });
    handleUpdateChapters(items);
  };

  const getChapterNumber = (chapterIndex: number) => chapterIndex + 1;

  return (
    <Box
      bgcolor="white"
      marginY="30px"
      boxShadow="0px 4px 20px rgb(7 40 137 / 4%)"
      borderRadius="5px"
      height="81vh"
      overflow="scroll"
    >
      <Box padding="20px">
        <Box
          margin="0 0 10px 0"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box component="h3" className={classes.courseHeading}>
            Select Courses
          </Box>
          <Box>
            <Button
              disableElevation
              color="primary"
              size="large"
              variant="contained"
              onClick={handleSubmitChapterActions}
            >
              Save
            </Button>
          </Box>
        </Box>

        <FormControl variant="outlined" fullWidth>
          <InputLabel>Select</InputLabel>

          <Select
            native
            label="Select"
            inputProps={{
              name: 'course'
            }}
            value={courses.length > 0 ? activeCourseIndex : ''}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              handleSelectCourse(e.target.value as number)
            }
          >
            {courses.map((course, index) => (
              <option key={index} value={index}>
                {course.board} - {course.className} - {course.subject}
              </option>
            ))}
          </Select>

          <FormHelperText>Please select a course</FormHelperText>
        </FormControl>
      </Box>

      <Box position="relative">
        <Tooltip title="Add New Chapter">
          <IconButton
            className={classes.addChapterButton}
            onClick={() => setOpenAddChapterModal(true)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Divider />
      </Box>

      <Box padding="20px">
        <FormHelperText className={classes.helperText}>
          List of chapters available in the course
        </FormHelperText>

        <Box>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {chapters.map((chapter, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ChapterListItem
                            key={index}
                            chapter={chapter}
                            chapterNumber={getChapterNumber(index)}
                            isActive={index === activeChapterIndex}
                            handleOnClick={() => handleClickOnChapter(index)}
                            editItem={(name) => editChapterItem(index, name)}
                            removeItem={() => removeChapterItem(index)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>

      <AddChapterModal
        openModal={openAddChapterModal}
        handleClose={() => setOpenAddChapterModal(false)}
        handleAddChapter={addChapter}
      />
    </Box>
  );
};

export default withStyles(courseContentStyles)(CourseContentSidebar);

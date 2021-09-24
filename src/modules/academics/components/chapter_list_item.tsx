import React, { FunctionComponent, useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import {
  Edit as EditIcon,
  RemoveCircle as RemoveCircleIcon
} from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Chapter } from '../contracts/chapter';
import EditChapterModal from '../components/edit_chapter_modal';
import { courseContentStyles } from '../../common/styles';

interface Props extends WithStyles<typeof courseContentStyles> {
  chapter: Chapter;
  chapterNumber: number;
  isActive: boolean;
  handleOnClick: () => any;
  editItem: (name: string) => any;
  removeItem: () => any;
}

const ChapterListItem: FunctionComponent<Props> = ({
  chapter,
  chapterNumber,
  isActive,
  handleOnClick,
  editItem,
  removeItem,
  classes
}) => {
  const [openEditChapterModal, setOpenEditChapterModal] = useState(false);

  const editChapter = async (name: string) => {
    setOpenEditChapterModal(false);
    editItem(name);
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      padding="5px"
      className={`${classes.chapterItem} ${isActive ? classes.isActive : ''}`}
      onClick={handleOnClick}
    >
      Chapter {chapterNumber} - {chapter.name}
      {chapter.isMaster === false && (
        <Box display="flex">
          <IconButton
            size="small"
            onClick={() => setOpenEditChapterModal(true)}
          >
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton size="small" onClick={removeItem}>
            <RemoveCircleIcon color="secondary" />
          </IconButton>
          <EditChapterModal
            openModal={openEditChapterModal}
            handleClose={() => setOpenEditChapterModal(false)}
            handleEditChapter={editChapter}
            chaptername={chapter.name}
          />
        </Box>
      )}
    </Box>
  );
};

export default withStyles(courseContentStyles)(ChapterListItem);

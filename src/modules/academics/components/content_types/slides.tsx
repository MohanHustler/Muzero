import React, { FunctionComponent } from 'react';
import { Box } from '@material-ui/core';
import { StackActionItem } from '../../../common/contracts/stack_action';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { ContentType } from '../../enums/content_type';
import Dropzone from '../../../common/components/dropzone/dropzone';
import { ChapterContent } from '../../contracts/chapter_content';
import FileListPreview from '../../../common/components/dropzone/previewers/file_list_preview';

interface Props {
  data: ChapterContent[];
  emitStackAction: (action: StackActionItem) => any;
}

export const Slides: FunctionComponent<Props> = ({ data, emitStackAction }) => {
  const handleDroppedFiles = (files: File[]) => {
    if (files.length < 1) return;

    files.forEach((file) => {
      emitStackAction({
        type: StackActionType.CREATE,
        payload: {
          data: file,
          type: ContentType.SLIDE
        }
      });
    });
  };

  const removeFileItem = (file: File) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: file,
        type: ContentType.SLIDE
      }
    });
  };

  const files = data.map((content) => new File([], content.contentname));

  return (
    <Box>
      <Box
        component="h3"
        fontWeight="500"
        font-size="18.2px"
        line-height="21px"
        color="#666666"
        margin="20px 0"
      >
        Step 1: Add PDF
      </Box>

      <Dropzone
        onChange={handleDroppedFiles}
        files={files}
        acceptedFiles={['.pdf']}
        maxFileSize={104857600} // 100 MB
        FilePreviewComponent={FileListPreview}
        onRemoveItem={removeFileItem}
      />
    </Box>
  );
};

export default Slides;

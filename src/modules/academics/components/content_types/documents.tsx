import React, { useState, FunctionComponent } from 'react';
import { Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { StackActionItem } from '../../../common/contracts/stack_action';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { ChapterContent } from '../../contracts/chapter_content';
import { ContentType } from '../../enums/content_type';
import GirlWithCup from '../../../../assets/images/girl-with-cup.jpg';
import Dropzone from '../../../common/components/dropzone/dropzone';
import FileListPreview from '../../../common/components/dropzone/previewers/file_list_preview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageContainer: {
      width: '273px',
      height: '193px',
      margin: '20px 30px 20px 0',
      '& img': {
        height: '100%',
        width: '100%',
        border: '1px dashed #DDDDDD',
        borderRadius: '5px'
      }
    }
  })
);

interface Props {
  data: ChapterContent[];
  emitStackAction: (action: StackActionItem) => any;
}

export const Documents: FunctionComponent<Props> = ({
  data,
  emitStackAction
}) => {
  const [docs, setDocs] = useState(true);

  const classes = useStyles();

  const handleDroppedFiles = (files: File[]) => {
    if (files.length < 1) return;

    files.forEach((file) => {
      emitStackAction({
        type: StackActionType.CREATE,
        payload: {
          data: file,
          type: ContentType.DOCUMENT
        }
      });
    });
  };

  const removeFileItem = (file: File) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: file,
        type: ContentType.DOCUMENT
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
        Step 5: Add Documents
      </Box>
      {/* TODO: Replace docs with original array value and loop through the images  */}
      {docs && (
        <Box display="flex" marginBottom="15px">
          <Box className={classes.imageContainer}>
            <img src={GirlWithCup} alt="documents" />
          </Box>
          <Box className={classes.imageContainer}>
            <img src={GirlWithCup} alt="documents" />
          </Box>
        </Box>
      )}

      <Dropzone
        onChange={handleDroppedFiles}
        files={files}
        acceptedFiles={['.doc', '.docx']}
        maxFileSize={104857600} // 100 MB
        FilePreviewComponent={FileListPreview}
        onRemoveItem={removeFileItem}
      />
    </Box>
  );
};

export default Documents;

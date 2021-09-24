import React, { FunctionComponent, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { StackActionItem } from '../../../common/contracts/stack_action';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { ContentType } from '../../enums/content_type';
import Dropzone from '../../../common/components/dropzone/dropzone';
import GirlWithCup from '../../../../assets/images/girl-with-cup.jpg';
import { ChapterContent } from '../../contracts/chapter_content';
import FileListPreview from '../../../common/components/dropzone/previewers/file_list_preview';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subHeading: {
      fontWeight: 500,
      lineHeight: '19px',
      color: '#666666',

      '& span': {
        background: '#00B9F5',
        fontSize: '12px',
        lineHeight: '14px',
        color: 'rgba(255, 255, 255, 0.87)',
        borderRadius: '50%',
        padding: '4px 7px',
        marginLeft: '10px'
      }
    },
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

export const Images: FunctionComponent<Props> = ({ data, emitStackAction }) => {
  const [docs, setDocs] = useState(true);

  const classes = useStyles();

  const handleDroppedFiles = (files: File[]) => {
    if (files.length < 1) return;

    files.forEach((file) => {
      emitStackAction({
        type: StackActionType.CREATE,
        payload: {
          data: file,
          type: ContentType.IMAGE
        }
      });
    });
  };

  const removeFileItem = (file: File) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: file,
        type: ContentType.IMAGE
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
        Step 4: Add Images
      </Box>

      <Dropzone
        onChange={handleDroppedFiles}
        files={files}
        acceptedFiles={['image/jpeg', 'image/png']}
        maxFileSize={104857600} // 100 MB
        FilePreviewComponent={FileListPreview}
        onRemoveItem={removeFileItem}
      />

      {/* TODO: Replace docs with original array value and loop through the images  */}
      {docs && (
        <Box marginTop="30px">
          <Typography className={classes.subHeading}>
            Images Uploaded
            <span>2</span>
          </Typography>
          <Box display="flex">
            <Box className={classes.imageContainer}>
              <img src={GirlWithCup} alt="documents" />
            </Box>
            <Box className={classes.imageContainer}>
              <img src={GirlWithCup} alt="documents" />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Images;

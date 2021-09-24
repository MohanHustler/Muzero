import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone';
//import { Box, Typography } from '@material-ui/core';
import FileChipPreview from './previewers/file_chip_preview';

const useStyles = makeStyles(() =>
  createStyles({
    dropzoneRoot: {
      borderRadius: '500px',
      maxWidth: '500px',
      minHeight: 'auto',
      outline: 'none',
    },

    dropzoneTextContainerRoot: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 6px 0 15px',
    },

    dropzoneText: {
      fontSize: '18px',
      margin: '20px 0',
    },

    dropzoneIcon: {
      background:
        'linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)',
      borderRadius: '100%',
      color: '#FFF',
      padding: '10px',
    },
  })
);

interface Props extends DropzoneAreaProps {
  files?: File[];
  FilePreviewComponent?: React.ElementType;
  onRemoveItem?: (file: File, fileIndex: number) => any;
}

const Dropzone: FunctionComponent<Props> = ({
  files = [],
  FilePreviewComponent = FileChipPreview,
  onRemoveItem,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div>
      <DropzoneArea
        {...props}
        showPreviews={false}
        showPreviewsInDropzone={false}
        filesLimit={1}
        classes={{
          root: classes.dropzoneRoot,
          textContainer: classes.dropzoneTextContainerRoot,
          text: classes.dropzoneText,
          icon: classes.dropzoneIcon,
        }}
      />

      <div>
        {/* <Box margin="20px 0 10px">
          <Typography variant="subtitle2">Previews</Typography>
        </Box> */}

        {files.map((file, index) => (
          <FilePreviewComponent
            key={index}
            label={file.name}
            onDelete={() => onRemoveItem && onRemoveItem(file, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dropzone;

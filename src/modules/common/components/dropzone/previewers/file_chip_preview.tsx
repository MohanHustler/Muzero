import React, { FunctionComponent } from "react";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Chip, ChipProps } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    preview: {
      marginRight: '10px',
      marginBottom: '10px',
    },
  })
);

const FileChipPreview: FunctionComponent<ChipProps> = (props) => {
  const classes = useStyles();

  return (
    <Chip
      className={classes.preview}
      {...props}
    />
  );
};

export default FileChipPreview;

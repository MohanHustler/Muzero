import React, { FunctionComponent } from "react";
import { Box, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    previewContainer: {
      alignItems: 'center',
      border: "1px solid #F2F2F2",
      display: 'flex',
      justifyContent: 'space-between',
      padding: "10px 15px",
      maxWidth: '500px',
    },
  })
);

interface Props {
  label: string;
  onDelete: () => any;
};

const FileListPreview: FunctionComponent<Props> = ({ label, onDelete }) => {
  const classes = useStyles();

  return (
    <Box className={classes.previewContainer}>
      <Typography>{label}</Typography>
      <Box component="span">
        <IconButton size="small" onClick={onDelete}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FileListPreview;

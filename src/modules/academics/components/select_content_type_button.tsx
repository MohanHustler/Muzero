import React, { FunctionComponent } from 'react';
import { Box, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentBtn: {
      '& button': {
        border: '1px solid rgba(102, 102, 102, 0.2)',
        borderRadius: '3px',
        fontWeight: 'normal',
        fontSize: '16px',
        textAlign: 'center',
        color: '#666666',
        padding: '8px 8px'
      }
    },
    activeContentBtn: {
      '& button': {
        color: '#202842',
        border: '1px solid #00B9F5'
      }
    }
  })
);

interface Props {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => any;
}

const SelectContentTypeButton: FunctionComponent<Props> = ({
  children,
  icon,
  isActive,
  onClick
}) => {
  const classes = useStyles();
  return (
    <Box
      className={`${classes.contentBtn} ${
        isActive ? classes.activeContentBtn : ''
      }`}
    >
      <Button
        disableElevation
        variant="outlined"
        size="small"
        startIcon={icon}
        onClick={onClick}
      >
        {children}
      </Button>
    </Box>
  );
};

export default SelectContentTypeButton;

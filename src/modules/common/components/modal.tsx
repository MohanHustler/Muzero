import React, { FunctionComponent } from 'react';
import { Modal as BaseModal, Box, IconButton, Theme } from '@material-ui/core';
import { Cancel as CancelIcon } from '@material-ui/icons';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        height: '100%',
        overflow: 'scroll',
        position: 'absolute',
        left: '10%',
        top: '10%'
      }
    },

    modalContainer: {
      borderRadius: '5px',
      outline: 'none',
      overflow: 'hidden'
    },

    modalBody: {
      [theme.breakpoints.up('sm')]: {
        maxHeight: '550px',
        minWidth: '600px',
        'overflow-y': 'auto'
      }
    },

    closeButton: {
      color: '#FFF'
    }
  });

interface Props extends WithStyles<typeof styles> {
  header?: React.ReactNode;
  open: boolean;
  handleClose: () => any;
}

const Modal: FunctionComponent<Props> = ({
  children,
  classes,
  handleClose,
  header,
  open
}) => {
  return (
    <BaseModal className={classes.modal} open={open} onClose={handleClose}>
      <Box className={classes.modalContainer}>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          padding="20px 20px 20px 40px"
          bgcolor="#4C8BF5"
        >
          {header && <Box marginRight="20px">{header}</Box>}

          <Box marginLeft="auto">
            <IconButton
              size="small"
              onClick={handleClose}
              className={classes.closeButton}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          className={classes.modalBody}
          padding="20px 40px 30px 40px"
          bgcolor="white"
        >
          {children}
        </Box>
      </Box>
    </BaseModal>
  );
};

export default withStyles(styles)(Modal);

import React, { FunctionComponent } from 'react';
import { Box, Typography } from '@material-ui/core';
import Button from './form_elements/button';

import Modal from './modal';

interface Props {
  header: string;
  helperText: string;
  openModal: boolean;
  onClose: () => any;
  handleDelete: () => any;
}

const ConfirmationModal: FunctionComponent<Props> = ({
  header,
  helperText,
  openModal,
  onClose,
  handleDelete
}) => {
  return (
    <Modal
      open={openModal}
      handleClose={onClose}
      header={
        <Box marginLeft="10px">
          <Typography component="span" color="secondary">
            <Box component="h3" color="white" fontWeight="400" margin="0">
              {header}
            </Box>
          </Typography>
        </Box>
      }
    >
      <Box padding="0 10px">
        <Box marginBottom="10px">
          <Typography>{helperText}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" marginTop="10px">
          <Box marginRight="10px">
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>

          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Ok
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

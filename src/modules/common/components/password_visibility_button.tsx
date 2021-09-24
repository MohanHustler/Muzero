import React, { FunctionComponent } from 'react';
import { IconButton } from '@material-ui/core';
import {
  Visibility as VisibilityOnIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

interface Props {
  isVisible: boolean;
  handleChange: (arg0: boolean) => any;
}

const PasswordVisibilityButton: FunctionComponent<Props> = ({
  isVisible,
  handleChange,
}) => {
  if (isVisible) {
    return (
      <IconButton size="small" onClick={() => handleChange(false)}>
        <VisibilityOffIcon />
      </IconButton>
    );
  }

  return (
    <IconButton size="small" onClick={() => handleChange(true)}>
      <VisibilityOnIcon />
    </IconButton>
  );
};

export default PasswordVisibilityButton;

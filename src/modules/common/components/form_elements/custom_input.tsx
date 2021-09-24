import React, { FunctionComponent } from 'react';
import { Input, InputProps, createStyles, Theme } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      fontSize: '16px',
      lineHeight: '18px',
      color: '#212121',

      '& input::placeholder': {
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '18px',
        color: 'rgba(33, 33, 33, 0.54)'
      }
    }
  });

interface Props extends WithStyles<typeof styles>, Omit<InputProps, 'classes'> {
  component?: React.ReactNode;
  to?: string;
}

const CustomInput: FunctionComponent<Props> = ({ classes, ...props }) => {
  return <Input {...props} className={`${classes.root} ${props.className}`} />;
};

export default withStyles(styles)(CustomInput);

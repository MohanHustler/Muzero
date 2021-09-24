import React, { FunctionComponent } from 'react';
import {
  Checkbox,
  CheckboxProps,
  createStyles,
  Theme
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '& svg': {
        fill: '#10182F'
      }
    }
  });

interface Props
  extends WithStyles<typeof styles>,
    Omit<CheckboxProps, 'classes'> {
  component?: React.ReactNode;
  to?: string;
}

const CustomCheckbox: FunctionComponent<Props> = ({ classes, ...props }) => {
  return (
    <Checkbox {...props} className={`${classes.root} ${props.className}`} />
  );
};

export default withStyles(styles)(CustomCheckbox);

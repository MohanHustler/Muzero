import React, { FunctionComponent } from 'react';
import { Select, SelectProps, createStyles, Theme } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

interface Props
  extends WithStyles<typeof styles>,
    Omit<SelectProps, 'classes'> {
  component?: React.ReactNode;
  to?: string;
}

const CustomSelect: FunctionComponent<Props> = ({ classes, ...props }) => {
  return (
    <Select {...props} className={`${classes.root} ${props.className}`}>
      {props.children}
    </Select>
  );
};

export default withStyles(styles)(CustomSelect);

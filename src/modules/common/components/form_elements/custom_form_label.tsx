import React, { FunctionComponent } from 'react';
import {
  FormLabel,
  FormLabelProps,
  createStyles,
  Theme
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '19px',
      color: '#212121',
      marginTop: '5px'
    }
  });

interface Props
  extends WithStyles<typeof styles>,
    Omit<FormLabelProps, 'classes'> {
  component?: React.ReactNode;
  to?: string;
}

const CustomFormLabel: FunctionComponent<Props> = ({ classes, ...props }) => {
  return (
    <FormLabel {...props} className={`${classes.root} ${props.className}`}>
      {props.children}
    </FormLabel>
  );
};

export default withStyles(styles)(CustomFormLabel);

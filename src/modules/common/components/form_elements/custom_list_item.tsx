import React, { FunctionComponent } from 'react';
import {
  // ListItem,
  ListItemProps,
  createStyles,
  Theme
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

interface Props
  extends WithStyles<typeof styles>,
    Omit<ListItemProps, 'classes'> {}

const CustomListItem: FunctionComponent<Props> = ({ classes, ...props }) => {
  return (
    <div></div>
    // <ListItem
    //   {...props}
    //   button
    //   className={`${classes.root} ${props.className}`}
    // >
    //   {props.children}
    // </ListItem>
  );
};

export default withStyles(styles)(CustomListItem);

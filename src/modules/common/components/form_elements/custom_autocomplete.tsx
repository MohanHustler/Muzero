import React, { FunctionComponent } from 'react';
import { createStyles, Theme, Box } from '@material-ui/core';
// import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

interface Props extends WithStyles<typeof styles> {}

const CustomAutocomplete: FunctionComponent<Props> = ({
  classes,
  ...props
}) => {
  // return <Autocomplete {...props} />;
  return <Box></Box>;
};

export default withStyles(styles)(CustomAutocomplete);

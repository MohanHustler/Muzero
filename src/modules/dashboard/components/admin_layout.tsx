import React, { FunctionComponent } from 'react';
import { Box, Container, Theme } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Admin } from '../../common/contracts/user';
import Navbar from '../../common/components/navbar';

const styles = (theme: Theme) => createStyles({});

interface Props extends WithStyles<typeof styles> {
  profile: Admin;
}

const AdminLayout: FunctionComponent<Props> = ({
  children,
  classes,
  profile
}) => (
  <div>
    <Navbar />

    <Container maxWidth="md">
      <Box paddingY="20px">
        <Box component="h2">Welcome Admin, {profile.adminName}!</Box>

        <Box>{children}</Box>
      </Box>
    </Container>
  </div>
);

export default withStyles(styles)(AdminLayout);

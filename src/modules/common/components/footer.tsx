import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Link,
  Toolbar,
} from '@material-ui/core';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },

    navigationBar: {
      '& > * + *': {
        marginLeft: theme.spacing(3),
      },
    },

    userDropdownTextContainer: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
      },
    },
  })
);

interface Props {
  authUser: User;
}

const Footer: FunctionComponent<Props> = () => {
  const classes = useStyles();

  
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar>
          <div className={classes.grow} />

          <Box className={classes.navigationBar}>
            <Link
              align="left"
              target="_blank"
              to="/user-guide"
              color="secondary"
              component={RouterLink}
            > User Guide
            </Link>
            <Link
              align="left"
              target="_blank"
              to="/legal-notice"
              color="secondary"
              component={RouterLink}
            > Legal Notice
            </Link>
            
          </Box>
        </Toolbar>
      </AppBar>
    );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User,
});

export default connect(mapStateToProps)(Footer);

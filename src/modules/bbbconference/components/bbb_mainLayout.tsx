import React, { FunctionComponent } from 'react'
import { Box, Theme } from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Navbar from '../../common/components/navbar';

const styles = (theme: Theme) => createStyles({
  layout: {
    padding: '12px',
    marginTop: '8px',
    height: "100%",
  }
});

interface Props extends WithStyles<typeof styles> {
  
}

const MainLayoutBBB: FunctionComponent<Props> = ({children, classes}) => {
  return (
    <div>
      <Navbar/>
      <Box className={classes.layout}>
        {children}
      </Box>
    </div>
  )
}

export default withStyles(styles)(MainLayoutBBB)

import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  ListItem,
  ListItemText,
  Theme
} from '@material-ui/core';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import GirlWithNotebook from '../../../assets/images/girl-with-notebook.jpg';
import Logo from '../../../assets/svgs/logo.svg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background:
        'radial-gradient(47.89% 47.89% at 64.2% 52.11%, rgba(41, 75, 100, 0) 0%, rgba(41, 75, 100, 0.27) 67.71%), url(' +
        GirlWithNotebook +
        ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center right',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '20px 0'
    },

    gridBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },

    gridBox: {
      padding: '20px',
      [theme.breakpoints.up('sm')]: {
        padding: '20px'
      }
    },

    logoContainer: {
      textAlign: 'center',
      marginBottom: '10px',
      [theme.breakpoints.up('sm')]: {
        marginBottom: '40px'
      }
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

const LegalNotice: FunctionComponent<Props> = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.logoContainer}>
          <img src={Logo} alt="Logo" />
        </div>

        <Grid container>
          <Grid item sm="auto" md={1} />
          <Grid item sm={2} md={12} className={classes.gridBackground}>
            <Box component="h1" className={classes.gridBox} textAlign="center">
              Legal Notices
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">1. Copyright</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The copyright in the User Content on Mu-zero Platform are owned by educators, where Mu-zero is a limited license holder to publish the same on Mu-zero Platform. The User Content is subject to the various Terms and Conditions and other policies (together “Terms”) as provided on the Mu-zero Platform, kindly ensure that you use the User Content only within the parameters as provided in the Terms. You are prohibited from using the User Content as your own without the prior permission of the content creator and Mu-zero." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero Content on the Mu-zero Platform including but not limited to, images, graphics, process, images, software, graphics, are owned by or licensed to Mu-zero and subject to Copyright and you are prohibited from using the same as your own, without the prior permission of Mu-zero. For clarity, Mu-zero Content does not include User Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you believe that any Educator/User has used copyright-protected work in the User Content posted on the Mu-zero Platform or if you believe your or someone else’s copyrights are being infringed upon through the Mu-zero Platform, then let us know by writing to us at legal@Mu-zero.io." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Please note that by claiming copyright infringement you are initiating a legal process, kindly be sure to consider whether fair use, fair dealing, or a similar exception to copyright apply before you report." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">2. Trademark</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The trademarks, service marks, logos displayed on the Mu-zero Platform are owned by Mu-zero (“Mu-zero Marks”). If you haven’t received our permission, do not use the Mu-zero Marks as your own or in any manner that implies sponsorship or endorsement or any relation to Mu-zero." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="A product or service branded with the Mu-zero name or logo is a reflection of Mu-zero. Unless you are one of our licensees, we don’t allow others to make, sell, or give away anything with our name or logo on it." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">3. Other legal notices</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In the event of any other disputes or claims arising from the use of the Mu-zero Platform, please get in touch with us at legal@Mu-zero.io." />
              </ListItem>
            </Box>
          </Grid>
          <Grid item sm="auto" md={2} />
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(LegalNotice));

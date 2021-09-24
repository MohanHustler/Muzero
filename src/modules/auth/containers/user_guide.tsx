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

const UserGuide: FunctionComponent<Props> = ({ classes }) => {
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
              User Guide
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText primary="Spreading knowledge is possible only through interactions between the users allowing the exchange of ideas and knowledge.Keeping this in mind we at Mu-zero Platform strive to ensure that the Platform is not misused in anyway. Following guidelines would be of great help to ensure this. Any user, who come cross any inappropriate content can report or flag such content, but do keep in mind that the reporting option should be used judiciously and if you have any doubts, i.e. if the content is inappropriate please go through the guidelines to make an informed decision." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Additionally, these guidelines are to be read along with all the other policies on the Mu-zero platform including but not limited to our Terms and Conditions and Privacy Policy." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    1. Guidelines for prohibited content and acts
                  </Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Harmful or dangerous content: Mu-zero platform is designed as a safe space for learners and educators alike and we would like your help in ensuring that it remains so. Any content which may cause physical or emotional harm, that incites violence or endanger the safety of any individual is expressly prohibited on the Mu-zero Platform. Content that requires references to harmful or dangerous acts solely for educational purposes are allowed. The sale and promotion of any regulated or illegal goods is not allowed." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Hateful content: We realise that exchange of ideas and opinions is essential in the learning process, we do not encourage or tolerate any hate speech. Hate speech is any content where the sole objective is inciting hatred against specific individuals or groups with respect to but not limited to race or ethnic origin, country caste, religion, disability, gender, age, sexual orientation/gender identity etc." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Violent and graphic content: Mu-zero is an educational Platform and the content uploaded is restricted only to educational content. Any violent or graphic content is prohibited. Any references made to violent or graphic situations or instances must be for education purposes only. Mu-zero does not allow any content that promotes terrorist acts or incites violence, or content whose sole objective is to sensationalise, shock or disturb individuals is not to be uploaded on the Platform in any manner." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Harassment and bullying: Mu-zero Platform is used by many users on a daily basis and it is important to be respectful and kind to your fellow users, we do not tolerate any form of harassment or bullying on the Platform and strive to keep the Platform a safe space to foster learning. Harassment in this case would include but not be limited to abusive videos, comments, messages, revealing someone’s personal information, including sensitive personally identifiable information of individuals, content or comments uploaded in order to humiliate someone, sexual harassment or sexual bullying in any form." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Spam: Posting untargeted, unwanted and repetitive content in lessons, comments of messages with an intention to spam the Platform and to drive traffic from the Platform to other third-party sites is in direct violation of our Terms and Conditions. Posting links to external websites with malware and other prohibited sites is not allowed. The use or launch of any automated system in any manner that sends more request messages to Mu-zero’s servers in a given period of time that is more than a human can reasonably produce using a conventional on-line web browser is prohibited" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Misleading metadata: Misuse of title, description, tags, thumbnail and bios and other features which constitutes the Metadata on the Platform is not allowed. Using these features to trick or circumvent our search algorithms is prohibited" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Scams: Any content uploaded/posted in order to trick others for their own financial gain is not allowed and we at Mu-zero do not tolerate any practices of extortion or blackmail either." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Copyright: Please refer to our copyright policy provided in our Terms and Conditions to know more about proprietary information relating to User Content and Mu-zero Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Privacy violation: Kindly refer to our Privacy Policy given here to know how to protect your privacy and respect the privacy of other users. If you believe that your privacy has been violated is any manner where a user has knowingly or unknowingly disclosed any information on the Platform, please feel free to approach us so that we can take the necessary steps." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Impersonation: Impersonation (using names, image, documents, certificates etc. not belonging to you or not used to identify you ) would mean the intention to cause confusion regarding who the real person is by pretending to be them. Impersonating another person is not permitted while using the Mu-zero Platform. Pretending to be a company, institute, group etc.by using their logo, brand name or any distinguishing mark would also amount to impersonation and could also be a potential trademark infringement." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Interaction with Mu-zero: At Mu-zero and its team treat each other with respect and have a healthy and supportive work environment. We believe in hands on interaction with our users to help them navigate and gain the maximum benefit from the platform. We do not encourage any communication with Mu-zero employee of staff that is hateful, abusive or sexually suggestive in any manner." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">2. Reporting tools</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Users can report any content that are in the nature of any of the prohibited acts, violative of any intellectual property rights or spam. However, before reporting the same users must be sure that contents are actually peohibited/ restricted." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Tips on Do’s & Don’ts: Here are a few tips from us on how to use the platform in a safe manner:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="A. Keeping yourself and your account safe " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Keep your log-in credentials a secret and do not reveal your password or ID to anyone." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Create a strong password to ensure that your account is not compromised, here are some tips to ensure that your password is strong:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Your password should be at least eight characters in length, combine numbers and letters, and not include commonly used words." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Select a word or acronym and insert numbers between some of the letters." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Include Special characters." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mix capital and lowercase letters." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Don't reuse passwords associated with any other type of account." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Log out of all devices to ensure that your log-in credentials are secure." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Register with our phone number in order to ensure you have a backup in case you forget your login details. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Do not reveal any personal information about yourself to anyone online, additionally do not meet someone you have a conversation with online in person, this could be a potentially dangerous act and you might be compromising your safety." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you are below the age of 18, and want to use the platform, a parent or guardian can create an account on your behalf. Persons below the age of 18 are not allowed to have individual account without the consent of a parent or guardian. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="B. Reporting Content " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Any content , text, video on your profile that would confuse other users as to who the video or content belongs to or leads users to believe that you have been endorsed or sponsored by another person, and the trademark of such person might have been infringed. If we receive any complaints or reports regarding the same, we may remove the content, if supported with relevant evidence. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you are a trademark or copyright owner and believe that your intellectual property right is being infringed, you have the option of reporting the same. If we receive an infringement complaint that is genuine, we may remove the content in question and serve a warning to the alleged infringer. We also suggest that before reporting the issue, both parties try to solve the disputes directly with the user who posted the content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you see any content that you feel is inappropriate and violates the guidelines given here, please report the content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you encounter a video that you believe violates the privacy of an individual or violates your privacy, please report the same, we shall initiate action accordingly as we have a strict privacy policy. If you report any content for violation of privacy, the content will be removed only if the information, images or date is clearly identifiable." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In the event a fellow user harasses you or you believe that someone is being harassed on the platform you can report the user or content. You may even write to us at help@Mu-zero.com for any further help or assistance. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="C. Posting Content" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="When posting videos or lessons on the platform always ensure that the information is correct, the content itself does not belong to a third party and that it is free from any of the prohibited acts in these guidelines. Always ensure that the personal information of a person or even your own personally identifiable information is not disclosed while posting any content on the platform, this would be in violation of our Privacy Policy. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="You will be personally held responsible for your actions on the Platform, thus please ensure that any content that you post including comments does not hurt the sentiments of any group or individual and cannot be construed as being harassment or bullying." />
              </ListItem>
            </Box>
          </Grid>

          <Grid item sm="auto" md={2} />
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(UserGuide));

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

const PrivacyPolicy: FunctionComponent<Props> = ({ classes }) => {
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
              Privacy Policy
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">1. General Conditions</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Mu-zero Technologies Private Limited, A company incorporated under the Companies Act 2013 (hereinafter referred as Mu-zero) is committed to ensure ethical standards in gathering, using, and safeguarding clients’/users’ information and safeguard their interests. We constantly review our systems and data to secure your personal information. Any instance of misuse is subject to inquiry and legal proceedings to ensure users privacy." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Any User who does not agree with any provisions of this Privacy Policy and the Terms of Service is authorized to use our online platform. Any use of the Website, Application, or services in connection with the Application, Website or products, or registrations with us through any mode or use of any products shall be deemed as your willful and free consent." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="This privacy policy governs your use of the Mu-zero Application, www.Mu-zero.io (“Website”) and the other associated/ancillary applications, products, websites and services managed by the Company, Mu-zero Technologies Private Limited." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Please read this privacy policy (“Policy“) carefully before using the Application, Website, its services and products, along with the Terms of Use. " />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">2. Know our policy</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="This privacy policy (“Policy”) applies to all Users who access the Mu-zero Platform/services and are therefore required to read and understand the Policy before submitting any Personal Information. Also if you have inadvertently submitted any Personal Information to Mu-zero you are also entitled to require Mu-zero to delete and destroy any such information which is undesirable by writing to us at help@Mu-zero.io." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Mu-zero does not make any representations concerning the privacy practices or policies of third parties websites or terms of use of such websites, nor does Mu-zero guarantee the accuracy, integrity, or quality of the information, data, text, software, sound, photographs, graphics, videos, messages or other materials available on such websites." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Mu-zero has taken all reasonable precautions to treat Personal Information as confidential with industry standards that it has implemented to protect from unauthorized access, improper use or disclosure, modification and unlawful destruction or accidental loss of the Personal Information." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">3. Right to Access</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Guest user: User are allowed to access the Platform, register for courses and avail services available with Mu-zero as a guest and without creating an account on the Platform or providing any Personal Information, Mu-zero takes no responsibility or validate the information provided by the guest, except as otherwise required under any law, regulation or an order of competent authority." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Registered user: In order to have access to all the benefits on Mu-zero Services / Platform, a User is required to first create an account on our Platform by giving personal details. Mu-zero may, in future, include other optional requests for information from the User to help Mu-zero to customize the Platform to deliver personalized information to the User. Without User's agreement, Mu-zero will not share, rent or sell any Personal Information with third parties in any way other than what is disclosed in this Policy. Mu-zero may keep records of telephone calls received and made for making enquiries, registered courses, feedback or other purposes for the purpose of rendering services effectively and efficiently." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">4. Types of Users Information</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="All information provided by you will be covered under ‘Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011 (the “Data Protection Rules“)) shall collectively be referred to as “Information” in this Policy." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="(a) “Personal Information” (your name, age, email address, phone number, password and your ward’s educational interests or any financial account information provided to Mu-zero at the time of registration or any time thereafter.);" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(b) “Sensitive Personal Information”-(transaction-related information, such as when you make purchases, respond to any offers, or download or use applications from us);" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(c) “Associated Information“- (information you provide us when you contact us for help; and  information you enter into its system when using the Application/Services/products, such as while asking doubts, participating in discussions and taking tests. (each as individually defined under this)" />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    5. Automatically Collected Information
                  </Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="In addition, the Application/products/Services may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile devices unique device ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browsers you use, and information about the way you use the Application/ Services / products; the full Uniform Resource Locator (URL) click stream to, and from our Platform, including date and time; cookie number; courses or videos you viewed or searched for; the email id you used to call our customer service. " />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="During some visits we may use software tools such as JavaScript to measure and collect session information, including page response times, download errors, length of visits to certain page, course and videos, page interaction information, and methods used to browse away from the page. As is true for most Mobile applications, Mu-zero also collects other relevant information as per the permissions that you provide. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero also uses an outside credit card processing company to bill you for the goods and services availed by you. These companies do not retain, share, store or use personally identifiable information of you for any other purpose." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">6. Sharing of Personal Information</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="a. Mu-zero may have to use Personal Information without reference only for research, statistical analysis and business intelligence purpose (i.e. to analyse trends, behavior patterns, to maintain the Application/Services and products, to learn about each user’s learning patterns and movements around the Application/Services and products and to gather demographic information and usage behavior and provide you with personalized content, and better learning objectives / experience.)." />
              </ListItem>

              <ListItem dense>
                <ListItemText
                  primary="b. Mu-zero may share such Personal Information, research, statistical or intelligence data in an aggregated or non-personally identifiable form to third parties service providers and affiliates (who work on behalf of or with Mu-zero to provide such services) to help Mu-zero communicate with Users or to provide the services and  maintain the Platform. User’s personal, identifiable and non- identifiable data may periodically be transmitted to external service providers to help us improve the Application, products and its Services. 
Mu-zero does not sell, trade or rent your Information to any third party unless, we have been expressly authorized by you either in writing or electronically to do so."
                />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="c. Mu-zero will take all reasonable measures to ensure that the Personal Information is  stored, modified and used for rendering services to you and as otherwise in compliance with laws. When editing or deleting Personal Information, we may ask you to verify your identity before we can act on your request .Mu-zero may at its discretion reject any request that is contrary to law, requires un-reasonable technical efforts. We do not assure that we will delete all residual copies and archives made by any third party without our knowledge and consent." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="d. Mu-zero shall use your Personal Information to communicate with you, either be by calls, text or emails. If at any time you wish to not receive any communication from our end you can opt-out of the same by writing to us on help@mu-zero.io." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">7. Exceptions</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Your Personal Information may be shared with third parties who have a need or authority to receive such information, if we have a good-faith belief that access, use, preservation or disclosure of the information is reasonably necessary to comply with" />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="(i) in response to any authority having to receive such information under law" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(ii)  any order of court" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(iii) detect, prevent, or otherwise address fraud, security or technical issues " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(iv)  protect against harm to the rights, property or safety of Mu-zero, our users or the public as required or permitted by law." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(v)  to enforce applicable ToU, including investigation of potential violations thereof." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(vi)  when it believes in good faith (doctrine of uberrima fides) that the disclosure is necessary to protect its rights, protect your safety or the safety of others, investigate fraud, address security or technical issues or respond to a government request;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(vii)  with its trusted services providers who work on its behalf, do not have an independent use of the information, in order to personalize the Application/Website/Services/products for a better user experience and to perform behavioural analysis; Mu-zero discloses to them, and have agreed to and adhered to the rules set forth in Privacy Policy;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(viii)  to protect against imminent harm to the rights, property or safety of the Application/ Website of the Company or its users or the public as required or permitted by law;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(ix) to another third party as part of reorganization or a sale of the assets of division or company. Any third party to which Mu-zero transfers or sells its assets will have the right to continue to use the personal and other information that a User provide to us." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    8. Security/ Access to Personal Information
                  </Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Mu-zero is concerned about safeguarding the confidentiality of your Information & Password. It adopts stringent security measures to protect your password from being exposed or disclosed to anyone. It provide physical, electronic, and procedural safeguards to protect Information it processes and maintain. However, no security system can prevent all potential security breaches." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="It limits access to this Information to authorized employees only who need to know that information in order to operate, develop or improve its Application/Services/products/Website. Only upon you forgetting the password for its Application/Website or Services, Mu-zero will have a right to reset the same to you with your prior approval as per standard web practices." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">9. Public Forums</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="When you use certain features on its website like the discussion forums and you post or share your personal information such as comments, messages, files, photos, will be available to all users, and will be in the public domain. All such sharing of information is done at your own risk. Please keep in mind that if you disclose personal information in your profile or when posting on its forums this information may become publicly available." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    10. How long does Mu-zero retain user data? optional
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Currently, Mu-zero retains user data while an account is active and for at least three years afterwards. It may alter this practice according to legal and business requirements. For example, it may lengthen the retention period for some data if needed to comply with law or voluntary codes of conduct. Unless otherwise prohibited, it may shorten the retention period for some types of data if needed to free up storage space." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">11. Your Consent</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="All the information provided to Mu-zero by you, you as a User confirms that the same including sensitive Personal Information, is true, accurate and voluntary. By registering with it, you are expressly consenting to its collection, processing, storing, disclosing and handling of your information as set forth in this Policy now and as amended by us. Processing, your information in any way, including, but not limited to, collecting, storing, deleting, using, combining, sharing, transferring and disclosing information, all of which activities will take place in India." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Any portion of the Information containing personal data relating to minors provided by you shall be deemed to be given with the consent of the minor’s legal guardian. Such consent is deemed to be provided by your registration with Mu-zero. User has the right to withdraw information at any time, in accordance with the terms of this Policy and the Terms of Service." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    12. User choices with regard to access of information
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero does not make any unsolicited calls or otherwise market any products or services, except for in relation to the purpose for which such information has been provided or taking any feedback, addressing any complaints, informing you about new features or free/paid courses. User shall not disclose their Personal Information to any third parties that is not authorised by Mu-zero and verify the identity of such person who seek information. Mu-zero will communicate with the Users through call, SMS, email or notices posted on the Platform or through any other means available, which shall include but not be limited to text, other forms of messaging, calls etc. The Users can change their e-mail and contact preferences at any time by logging into their account or by emailing at help@mu-zero.io. " />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">13. Alert</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero will occasionally send email or notices to communicate about new Services, products and benefits, as they are considered an essential part of the Services/products you have chosen, which it perceives might be useful for you." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">14. Cookies</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero send cookies (small files containing a string of characters) to your computer, thereby uniquely identifying your browser. Cookies are used to track your preferences, help you login faster, and aggregated to determine user trends. This data is used to improve its offerings, such as providing more content in areas of greater interest of users. Cookies help Some of the features and services function properly. This allows us to provide you with more useful and relevant services." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">15. Links</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero may present links in a format that enables us to keep track of whether these links have been followed. Mu-zero uses this information to improve its customized content. Clicking on links may take you to sites outside its domain. Mu-zero are not responsible for the privacy practices of other web sites. This Privacy Policy applies solely to information collected by its Website." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">16. Interest-Based Ads</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="On unaffiliated sites, Mu-zero may display interest-based ads (personalized or targeted ads) using information you make available or information from activities such as subscription on our Platform, visiting sites that contain Mu-zero content or ads." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In providing interest-based ads, we follow applicable laws, as well as the Code for Self-Regulation in Advertising by the Advertising Standards Council of India and the Self-Regulatory Principles for Online Behavioral Advertising developed by the Digital Advertising Alliance (a coalition of marketing, online advertising, and consumer advocacy organizations)." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Advertisers or ad companies working on their behalf sometimes use technology to serve the ads that appear on our sites directly to your browser. They automatically receive your IP address when this happens. They may also use cookies to measure the effectiveness of their ads and to personalise ad content. We do not have access to or control over cookies or other features that advertisers and third party sites may use, and the information practices of these advertisers and third party websites are not covered by our Policy. Please contact them directly for more information about their privacy practices." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">17. Revision of Privacy Policy </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In the event there are significant changes in the way Mu-zero treats User's personal information, Mu-zero will display a notice on the Platform or send Users an email." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Users are advised to review this Policy regularly for any changes, as continued use is deemed approval of all changes. Should you have any concern or reject the changes in the privacy policy you can refuse to accept the amendments and opt for withdrawing your Personal Information by writing to us." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If you have any compliant or grievances with respect to Website or Privacy Policy please write to us at help@mu-zero.io" />
              </ListItem>
            </Box>
          </Grid>

          <Grid item sm="auto" md={2} />
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(PrivacyPolicy));

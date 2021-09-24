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

const TermsConditions: FunctionComponent<Props> = ({ classes }) => {
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
              Terms and Conditions
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText primary="Welcome to the Mu-zero’s terms and condition. These terms and conditions (“Terms and Conditions”), are between Mu-zero and users, (hereinafter referred to as “User(s)”). By accessing our website [object Object] (“Website”) and/or our app ‘Mu-zero Platform’ and/or ‘Mu-zero ’ (“Apps”), Website and Apps together shall be referred to as “Mu-zero Platform”, you agree to be bound by the provisions of these Terms and Conditions." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Please read these Terms and Conditions, along with the Privacy Policy and all other rules and policies made available or published on Mu-zero Platform as they shall govern your use of the Mu-zero Platform. By using or visiting the Mu-zero Platform or any Mu-zero software, data feeds, and service provided to you on, from, or through the Mu-zero Platform, you signify your agreement to (1) these “Terms and Conditions”, (2) Mu-zero’s Privacy Policy and any other terms that are updated from time to time. If you do not agree to any of these terms, please do not use the Mu-zero Platform." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">A. About Mu-zero</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The domain name, Website and the Apps are owned, registered and operated by Mu-zero Technologies Private Limited, a private company incorporated under the (Indian) Companies Act, 2013, and having its corporate office at D040601, SUSHANT AQUAPOLIS, NH-24,GHAZIABAD- 201009 India, (hereinafter referred to as “Mu-zero” or “ us” or “we” or “our” or “Company”)." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">B. Mu-zero Platform</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. These Terms and Conditions apply to all Users of the Mu-zero Platform, including educators who are also contributors of User Content on the Mu-zero Platform. The Mu-zero Platform includes all aspects of the Website and Apps which includes but is not limited to products, software and service offered via the Mu-zero Platform, such as the Mu-zero application, online platform, Mu-zero Plus - Subscription, Mu-zero Bytes and any other service or application that Mu-zero introduces from time to time. ( terms to be changed)" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. Mu-zero Platform is an online platform that supports and facilitates the online creation of educational videos/or tutorials, by the Users of the Mu-zero Platform and acts as an intermediary between the educator and the User. A User may create a video, audio clip or tutorial, by using the Mu-zero Platform. Such content uploaded through the use of the Mu-zero Platform shall hereinafter be referred to as “User Content”. You agree and acknowledge that Mu-zero has no control over and assumes no responsibility for, the User Content and by using the Mu-zero Platform, you expressly relieve Mu-zero from any and all liability arising from the User Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. The Mu-zero Platform may include or contain links to any third-party websites that may or may not be owned or controlled by Mu-zero. Mu-zero has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites. Therefore Mu-zero disclaim any and all liability arising from your use of any third-party website or services. Users are recommended to read and understand the terms and conditions and privacy policy of such website before using any third-party website or services." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. Mu-zero grants a non-exclusive, non-transferable, non-sub licensable, limited license to use the Mu-zero Platform(Services/Application/products) in accordance with the Terms and Conditions, Privacy Policy and all other rules published elsewhere .If You do not agree with the Terms or the Privacy Policy, please do not use the Mu-zero Platform(Services / Application/products)." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="5. You agree and acknowledge that Mu-zero shall have the right at any time to change or discontinue any aspect or feature of the Mu-zero Platform, including, but not limited to, the User Content, hours of availability and equipment needed for access or use. Further, Mu-zero may discontinue disseminating any portion of information or category of information, may change or eliminate any transmission method and may change transmission speeds or other signal characteristics. Mu-zero reserves the right to refuse access to the Mu-zero Platform, terminate Accounts, remove or edit contents without any notice to user." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">C. Mu-zero Accounts</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In order to access some of the features of the Mu-zero Platform (Services / Application/ products), you may have to create your account with Mu-zero. You agree and confirm that you will never use another User’s account nor provide access to your account to any third-party. When creating your account, you confirm that the information so provided is accurate and complete. Further, you agree that you are solely responsible for the activities that occur on your account, and you shall keep your account password secure and not share the same with anyone. You must notify Mu-zero immediately of any breach of security or unauthorized use of your account. At no point in time will Mu-zero be liable for any losses caused by any unauthorized use of your account, you shall solely be liable for the losses caused to Mu-zero or others due to such unauthorized use, if any." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero takes no responsibility for any User Content that is uploaded on the Mu-zero Platform, and further, the User shall be solely responsible for his or her own actions in utilizing such User Content and availing the Mu-zero Platform provided herein." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    D. Access, Permissions and Restrictions
                  </Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="Mu-zero allows you to access and use the Mu-zero Platform(Services / Application/ products) subject to below mentioned  Terms and Conditions:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. You agree not to distribute in any medium any part of the Mu-zero Platform or the content without prior written permission of Mu-zero." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. You agree not to alter or modify any part of the Mu-zero Platform(Services / Application/ products)." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. You agree not to access content of any other User through any technology or means other than the video playback pages of the Mu-zero Platform itself." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. You agree not to use the Mu-zero Platform for any of the following commercial uses unless you obtain Mu-zero’s prior written approval:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(a) the sale of access to the Mu-zero Platform(Services / Application/ products);" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(b) the sale of advertising, sponsorships, or promotions placed on or within the Mu-zero Platform(Services / Application/ products) or content; or" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(c) the sale of advertising, sponsorships, or promotions on any page or website that provide similar Mu-zero Platform(Services / Application/ products) as that of Mu-zero." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="5. You agree to receive installs and updates from Mu-zero regularly. These updates are designed to improve, enhance and further develop the Mu-zero Platform and may take the form of bug fixes, enhanced functions, new software modules and completely new versions. You agree to receive such updates (and permit Mu-zero to deliver these to you) as part of your use of the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="6. You agree not to use or launch any automated system, including without limitation, “robots,” “spiders,” or “offline readers,” that accesses the Mu-zero Platform in a manner that sends more request messages to Mu-zero’s servers in a given period of time than a human can reasonably produce in the same period by using a conventional on-line web browser. Notwithstanding the foregoing, Mu-zero grants the operators of public search engines permission to use spiders to copy materials from the site for the sole purpose of and solely to the extent necessary for creating publicly available searchable indices of the materials, but not caches or archives of such materials. Mu-zero reserves the right to revoke these exceptions either generally or in specific cases at any time with or without providing any notice in this regard. You agree not to collect or harvest any personally identifiable information, including account names, from the Mu-zero Platform, nor to use the communication systems provided by the Mu-zero Platform (e.g., comments, email) for any commercial solicitation purposes. You agree not to solicit, for commercial purposes, any Users of the Mu-zero Platform with respect to User Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="7. You may post reviews, comments and other content; send other communications; and submit suggestions, ideas, comments, questions or other information as long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringement of intellectual property rights, or otherwise injurious to third parties or objectionable and does not consist of or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings or any other form of spam. Further, you give Mu-zero limited, royalty free, worldwide, non-exclusive license to use the User Content and communication in developing its Mu-zero Platform and in any of its marketing or promotional activities." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="8. In your use of the Mu-zero Platform, you will at all times comply with all applicable laws and regulations." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="9. Mu-zero reserves the right to discontinue any aspect of the Mu-zero Platform at any time with or without notice at its sole discretion." />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">E. Content Use</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="In addition to the general restrictions mentioned above, the following limitation and conditions shall apply to your use of the Content." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="1. Except as mentioned below, all information, content, material, trademarks, services marks, logos, trade names, and trade secrets including but not limited to the software, text, images, graphics, video, script and audio, contained in the Application, Website, Services and products are proprietary property of the Company (“Proprietary Information”) are owned by or licensed to Mu-zero and subject to copyright and other intellectual property rights under the law. No Proprietary Information may be copied, downloaded, reproduced, modified, republished, uploaded, posted, transmitted or distributed in any way without obtaining prior written permission from the Company and nothing on this Mu-zero Platform (Application/ Services/products) shall be or products deemed to confer a license of or any other right, interest or title to or in any of the intellectual property rights belonging to the Company, to the User. You may own the medium on which the information, content or materials resides, but the Company shall at all times retain full and complete title to the information, content or materials and all intellectual property rights inserted by the Company on such medium. Certain contents on the Website may belong to third parties. Such contents have been reproduced after taking prior consent from said party and all rights relating to such content will remain with such third party. Further, you recognize and acknoweldge that the ownership of all trademarks, copyright, logos, service marks and other intellectual property owned by any third party shall continue to vest with such party and You are not permitted to use the same without the consent of the respective third party." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. User Content is provided to you on an AS IS basis. You may access Content for your information and personal use solely as intended through the provided functionality on the Mu-zero Platform and as permitted under these Terms and Conditions. You shall not copy, reproduce, make available online or electronically transmit, publish, adapt, distribute, transmit, broadcast, display, sell, license, or otherwise exploit any User Content for any other purposes other than as provided herein without the prior written consent of Mu-zero or the respective licensors of the User Content. Mu-zero and its licensors reserve all rights not expressly granted in and to the Mu-zero Platform and the User Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. You agree not to circumvent, disable or otherwise interfere with security-related features of the Mu-zero Platform or features that prevent or restrict use or copying of any User Content or enforce limitations on use of the Mu-zero Platform or the User Content therein." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. You understand that when using the Mu-zero Platform, you will be exposed to User Content from variety of sources and by different Users, and that Mu-zero is not responsible for the accuracy, usefulness, safety, or intellectual property rights of or relating to such User Content. You further understand and acknowledge that you may be exposed to User Content that is inaccurate, offensive, indecent, or objectionable, and you agree to waive, and hereby do waive, any legal or equitable rights or remedies you have or may have against Mu-zero with respect thereto, and, to the extent permitted by applicable law, agree to indemnify and hold harmless Mu-zero, its owners, operators, affiliates, licensors, and licensees to the fullest extent allowed by law regarding all matters related to your use of the Mu-zero Platform. (disclaimer)" />
              </ListItem>
            </Box>

            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">F. Content and Conduct</Box>
                </ListItemText>
              </ListItem>

              <ListItem dense>
                <ListItemText primary="1. Mu-zero does not guarantee any confidentiality with respect to any User Content (including videos and User comments) submitted by users." />
              </ListItem>

              <ListItem dense>
                <ListItemText primary="2. You shall be solely responsible for your own User Content and the consequences of submitting and publishing such User Content on the Mu-zero Platform. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to publish the User Content that you submit; and you grant limited license to Mu-zero to all patent, trademark, trade secret, copyright or other proprietary rights in and to such User Content for publication on the Mu-zero Platform pursuant to these Terms and Conditions for the duration the said User Content is available on Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. For clarity, you retain your ownership rights in your User Content. However, by submitting User Content to Mu-zero, you hereby grant Mu-zero a limited, worldwide, non-exclusive, royalty-free, sub-licenseable and transferable license to use, copy, reproduce, process, distribute, display, adapt, modify, publish, make available online or electronically transmit the User Content in connection with the Mu-zero Platform and Mu-zero’s (and its successors’ and affiliates’) business, including without limitation for promoting and redistributing part or all of the Mu-zero Platform in any media formats and through any media channels. You also hereby grant each User of the Mu-zero Platform a limited, non-exclusive license to access your User Content through the Mu-zero Platform. The above licenses granted by you in the User Content you submit to the Mu-zero Platform terminate within a commercially reasonable time after you request Mu-zero to remove or delete your videos from the Mu-zero Platform provided you pay the mutually agreed amount that Mu-zero incurred in providing the Mu-zero Platform to you. You understand and agree, however, that Mu-zero may retain, but not display, distribute, or perform, server copies of your videos that have been removed or deleted. The above licenses granted by you in User comments and testimonial you submit are perpetual and irrevocable." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. You agree that user shall not be permitted to perform any of the following prohibited activities while availing Mu-zero Platform( Application/Services/Products):" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1. Making available any content that is misleading, unlawful, harmful, threatening, abusive, tortious, defamatory, libelous, vulgar, obscene, child-pornographic, lewd, lascivious, profane, invasive of another’s privacy, hateful, or racially, ethnically or otherwise objectionable;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.2. Stalking, intimidating and/or harassing another and/or inciting other to commit violence;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.3. Transmitting material that encourages anyone to commit a criminal offence, that results in civil liability or otherwise breaches any relevant laws, regulations or code of practice;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.4. Interfering with any other person’s use or enjoyment of the Mu-zero Platform (Application/Services/products);" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.5. Making, transmitting or storing electronic copies of materials protected by copyright without the permission of the owner, committing any act that amounts to the infringement of intellectual property or making available any material that infringes any intellectual property rights or other proprietary rights of anyone else;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.6. Make available any content or material that You do not have a right to make available under any law or contractual or fiduciary relationship, unless You own or control the rights thereto or have received all necessary consents for such use of the content;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.7. Impersonate any person or entity, or falsely state or otherwise misrepresent Your affiliation with a person or entity;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.8. Post, transmit or make available any material that contains viruses, trojan horses, worms, spyware, time bombs, cancel bots, or other computer programming routines, code, files or such other programs that may harm the Application/services, interests or rights of other users or limit the functionality of any computer software, hardware or telecommunications, or that may harvest or collect any data or personal information about other Users without their consent;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.9. Access or use the Application/Website/Services/products in any manner that could damage, disable, overburden or impair any of the Application’s/Website’s servers or the networks connected to any of the servers on which the Application/Website is hosted;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.10. Intentionally or unintentionally interfere with or disrupt the services or violate any applicable laws related to the access to or use of the Mu-zero Platform (Application/ Services/products), violate any requirements, procedures, policies or regulations of networks connected to the Application/Website/Services/products, or engage in any activity prohibited by these Terms;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.11. Disrupt or interfere with the security of, or otherwise cause harm to, the Application/ Website/Services/products, materials, systems resources, or gain unauthorized access to user accounts, passwords, servers or networks connected to or accessible through the Application/Website/Services/products or any affiliated or linked sites;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.12. Interfere with, or inhibit any user from using and enjoying access to the Application/ Website/ Services/products, or other affiliated sites, or engage in disruptive attacks such as denial of service attack on the Application/Website/Services/products;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.13. Use deep-links, page-scrape, robot, spider or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to increase traffic to the Application/Website/Services/products, to access, acquire, copy or monitor any portion of the Application /Website/Services/products, or in any way reproduce or circumvent the navigational structure or presentation of the Application, or any content, to obtain or attempt to obtain any content, documents or information through any means not specifically made available through the Application/ Website/Services/products;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.14. Alter or modify any part of the Services;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.15. Use the Services for purposes that are not permitted by: (i) these Terms; and (ii) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdiction; or" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.16.  Violate any law, statue, ordinance, regulation or terms of user guide;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="5.  If at any given point it comes to the notice of Mu-zero that you are engaged in any kind of prohibited acts, then in such a case Mu-zero shall have the sole right to suspend/          terminate your account with immediate effect and without any notice of such suspension or termination, we also reserve the right in our sole discretion to initiate any legal proceedings against you in such cases." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="6. Mu-zero at its sole discretion may process any audio or audio-visual content uploaded by you to the Mu-zero Platform to confirm if the same is in accordance with the Mu-zero internal quality requirements and is compatible with the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="7. Mu-zero does not endorse any User Content submitted on the Mu-zero Platform by any User or other licensor, or any opinion, recommendation, or advice expressed therein, and Mu-zero expressly disclaims any and all liability in connection with User Content. Mu-zero does not permit copyright infringing activities and infringement of intellectual property rights on the Mu-zero Platform, and Mu-zero will remove all User Content if properly notified that such Content infringes on another’s intellectual property rights. Mu-zero reserves the right to remove User Content without prior notice if it has reason to believe that the User Content infringes any copyright." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    G. Mu-zero Intellectual Property Right
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The Mu-zero Platform, the processes, and their selection and arrangement, including but not limited to all text, graphics, User interfaces, visual interfaces, sounds and music (if any), artwork and computer code on the Mu-zero Platform is owned and controlled by Mu-zero and the design, structure, selection, coordination, expression, look and feel and arrangement of such content mentioned hereinabove is protected by copyright, patent and trademark laws, and various other national and international IPR laws and regulations. For clarity, content in the above sentence shall not include User Content." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Unless otherwise indicated or anything contained to the contrary, or any proprietary material owned by a third-party and so expressly mentioned, Mu-zero owns all IPR to and into the trademark “MU-ZERO” and the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The mark “Mu-zero” is the sole property of Mu-zero. Reproduction in whole or in part of the same is strictly prohibited unless used with an express written permission from Mu-zero." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">H. Electronic Communication</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="When you visit Mu-zero Platform or send email to us, you are communicating with us electronically. By communicating with us, you consent to receive communication from us electronically. We will communicate with you by email or posting notices on Mu-zero Platform. You agree that all agreements, notices, disclosures, disclaimers, offers and other communications that are provided to you electronically satisfy any legal requirement that such communication should be in writing." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">I. Termination of Account</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. Mu-zero will terminate a User's access to the Mu-zero Platform, if" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.1. the User is a repeat copyright infringer;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.2. the Users breaches any terms of these Terms and Conditions." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.3. Violation of any applicable laws;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.4. your use of the Mu-zero Platform disrupts our business operations or affects any other party/ User; or" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1.5. you have behaved in a way, which objectively could be regarded as inappropriate or unlawful or illegal or which would bring any claims against Mu-zero." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. Mu-zero reserves the right to decide whether User Content violates these Terms and Conditions for reasons other than copyright infringement, such as, but not limited to, pornography, obscenity, or excessive length or any other parameter that Mu-zero deems fit from time to time. Mu-zero may at any time, without prior notice and in its sole discretion, remove such User Content and/or terminate a User's account for submitting such material in violation of these Terms and Conditions." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. We may suspend access to the Mu-zero Platforms or require You to change Your password if we reasonably believe that the Mu-zero Platforms have been or are likely to be misused, and we will notify You accordingly. Any termination of Your registration and/or Account or the Mu-zero Platforms will not affect liability previously incurred by You." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">J. Effective of Termination</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="In case any of the above-mentioned cases occur, Mu-zero reserves the right, in its sole discretion, to terminate or suspend the User’s account with immediate effect. Upon suspension or termination of the User’s account:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. Mu-zero shall at its sole discretion withhold or stop any and all payments that are to be made to such User and evaluate the pay-outs. Payments shall only be made for all legitimate work that is not subject matter of any violation or dispute." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. Payments shall not be made for the work that is the subject matter of any of the breaches." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. User access shall be terminated immediately, and the User shall not be able to access the said terminated account." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">K. Copyright Infringement</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. Mu-zero operates a clear copyright policy in relation to any User Content alleged to infringe the copyright of a third party." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. As part of Mu-zero's copyright policy, Mu-zero will terminate User access to the Mu-zero Platform if a User has been determined to be a repeat infringer. A repeat infringer is a User who has been notified of infringing activity more than twice." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. If you believe that your work has been copied in a way that constitutes copyright infringement, please refer to the instructions given in the copyright policy on how to make a claim of copyright infringement." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. Notice of Copyright Infringement:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1. Pursuant to provisions of the Indian Copyright Act, 1952 read with the Information Technology Act of 2000, we an intermediary, allow general public to post content on our platform. We have implemented procedures for receiving written notification of claimed infringements on the User Content uploaded on Mu-zero Platform. We have also designated an agent to receive notices of claimed copyright infringement. If you believe in good faith that your copyright has been infringed, you may provide us with a written communication which contains:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.1. An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.2. A description of the copyrighted work that you claim has been infringed upon;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.3. A description of where the material that you claim is infringing is located on the Mu-zero Platform, including the educator name, topic and any other detail identifying the infringing content;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.4. Your email address, your physical address and telephone number;" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.5. A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4.1.6. A statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Our policy to deal with Copyright infringements:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="We follow a 3-strike policy- Three instances brought to our notice that are provided with all required supporting information will lead to the educator getting banned from the Mu-zero Platform. His/her right to any and all compensation or monetary benefit that he/she might be eligible for shall be revoked. The detailed process is as under:" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. First case of violation- The infringing User Content is taken down and educator is given a warning and is suspended for a week from making any new courses." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. Second case of violation- The educator is suspended from making any more videos on the Mu-zero Platform for a month and all User Content that amount to copyright violations are brought down immediately." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. Third violation- The educator is banned from the Mu-zero Platform and will be unable to make any more courses in the future." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">L. Confidentiality</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="You will not without obtaining prior written consent of Mu-zero, disclose to third party any Confidential Information (as defined below) that is disclosed to you during the term of your use of the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="For the purpose of this clause Confidential Information shall include but shall not be limited to employee details, User list, business model, processes, ideas, concepts etc. relating to Mu-zero or Mu-zero Platform which are not available in the public domain. You acknowledge and agree that the Confidential Information so provided to you shall at all time be the property of Mu-zero and any breach of the same shall cause irreparable damage to us." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">M. Disclaimer</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="1. Users agree that use of the mu-zero platform shall be at the discretion of user. The company and its officers, directors, employees, and agents disclaims all warranties and conditions, with regard to" />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(i) the website, application/products and the services, including without limitation, all implied warranties and conditions of merchantability, fitness for a particular purpose, title, accuracy, timeliness. Performance, completeness, suitability and non-infringement." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(ii)  errors, mistakes, or inaccuracies of user content or any content, " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(iii)  personal injury or property damage, of any nature whatsoever, resulting from your access to and use of the mu-zero platform," />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(iv)  any unauthorized access to or use of our secure servers and/or any personal  and/or financial information stored therein," />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(v)  any interruption or cessation of transmission to or from the mu-zero platform," />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="(vi)  any errors or omissions in any user content or any other content or for any loss or damage of any kind incurred as a result of the use of any user content or any other content that is posted, emailed, transmitted, or otherwise made available on our platform. " />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="2. Company disclaim all liability inrespect of any user content  advertised or offered by a third party through our platform or any linked  services, and mu-zero will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of user content or services. . It shall be your own responsibility to ensure that services provided by us meet your specific requirements." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="3. We understand that, in some jurisdictions, warranties, disclaimers and conditions may apply that cannot be legally excluded, if that is true in your jurisdiction, then to the extent permitted by law, mu-zero limits its liability for any claims under those warranties or conditions to either supplying you the mu-zero platforms again." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="4. The mu-zero platform is controlled and offered by mu-zero from its facilities in india. Mu-zero makes no representations that the mu-zero platform is appropriate or available for use in other locations. Those who access or use the mu-zero platform from other jurisdictions do so at their own volition and are responsible for compliance with local law." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">N. Indemnity</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="To the extent permitted by applicable law, you agree to defend, indemnify and hold harmless Mu-zero, its parent corporation, officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Mu-zero Platform; (ii) your violation of any term of these Terms and Conditions; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right; (iv) any claim that your User Content caused damage to a third party; or (v) violation of any applicable laws. This defence and indemnification obligation will survive these Terms and Conditions and your use of the Mu-zero Platform." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    O. Eligibility to use and Acceptance of the Terms and
                    Conditions
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="You affirm that you are either more than 18 years of age, or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms and Conditions, and to abide by and comply with these Terms and Conditions. If you are under 18 years of age, then you should take permission of your parents or guardian before using the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="You agree and acknowledge that your use of the Mu-zero Platform is subject to the most current version of the Terms and Conditions made available on the Mu-zero Platform at the time of such use. Also you have read these terms and conditions and you know what terms apply to your use." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero reserves the right to refuse access to use the Mu-zero Platforms to any Users or to suspend and/or terminate access granted to existing registered Users at any time without according any reasons for doing so." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">P. Force Majeure</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero shall not be liable for failure to perform, or the delay in performance of, any of its obligations if, and to the extent that, such failure or delay is caused by events substantially beyond the its control, including but not limited to acts of God, acts of the public enemy or governmental body in its sovereign or contractual capacity, war, terrorism, floods, fire, strikes, epidemics, civil unrest or riots, power outage, and/or unusually severe weather." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">Q. Information Technology Act</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="These Terms and Conditions constitute an electronic record in accordance with the provisions of the Information Technology Act, 2000.These Terms and Conditions are published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries guidelines) Rules, 2011 that require publishing the rules and regulations, privacy policy and terms and conditions for access or usage of the Mu-zero Platform." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="You are advised not to post any information or messages that are, or that may be construed, as being malicious , defamatory, inappropriate, slanderous, pornographic or otherwise sexually oriented or that makes attacks on or the otherwise opines or comments on any individuals or groups of individuals, educational institutions or any other entities whatsoever (whether companies, firms, or any other institutions). You also agree not to post any information to which you do not have copyrights or other appropriate permissions to post in public forum. Your failure to comply with these terms may result in removal of your postings without prior notice to User. The IP address of all posts is recorded to aid in enforcing these conditions." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">R. Other Laws</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Certain laws require to maintain data with respect to the Mu-zero Platform and other personal information in a prescribed format and Mu-zero will use all the information to the extent required in compliance with the applicable laws and as may be directed or amended from time to time." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">S. Governing Law and Jurisdiction</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="The Terms and Conditions are governed by and constructed in accordance with the laws of India, without reference to conflict of laws principles and you irrevocably and unconditionally submit to the exclusive jurisdiction of the courts located in Noida, Utter Pradesh, India." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">
                    T. Modification, Amendment or Termination
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Mu-zero may, in its sole discretion, modify or revise these Terms and Conditions and policies at any time, and you agree to be bound by such modifications or revisions. Your continued use of the Mu-zero Platform post any modification of the Terms and Conditions shall be taken as your consent and acceptance to such modifications. Nothing in these Terms and Conditions shall be deemed to confer any third-party rights or benefits." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">U. General</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="If any part of these Terms and Conditions is unlawful, void or unenforceable, that part of will be deemed severable and will not affect the validity and enforceability of any remaining provisions. Any notice required to be given in connection with the Mu-zero Platform shall be in writing and sent to the registered office of Mu-zero. We do not guarantee continuous, uninterrupted or secure access to the Mu-zero Platform, and operation of the Mu-zero Platform may be interfered by numerous factors outside our control. Headings are for reference purpose only an on no way define, limit, construe or describe the scope or extent of such section. Out failure to act with respect to any breach by you or others does not waive our right to act with respect to subsequent or similar breaches." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">V. Refund Policy</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Please read the subscription terms and conditions carefully before subscribing to any of the subscription plans, as once you have subscribed you cannot change, cancel your subscription plan. Once you subscribe and make the required payment, it shall be final and there cannot be any changes or modifications to the same and neither will there be any refund. However any refunds that are to be processed shall be processed in accordance with Mu-zero’s refund policy." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Notice: All notices served by the Company shall be provided via email to user  account or as a general notification on the Application. Any notice/ intimation to be provided to the Company should be sent to support@mu-zero.io." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Entire Agreement: The Terms, along with the Privacy Policy, and any other guidelines made applicable to the Application from time to time, constitute the entire agreement between the Company and user with respect to access to or use of the Application, Website and the Services thereof." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Assignment: User(s) cannot assign or otherwise transfer his/her obligations under the Terms, or any right granted hereunder to any third party. The Company’s rights under the Terms are freely transferable by the Company to any third parties without the requirement of seeking consent of users." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Severability: If, for any reason, a court of competent jurisdiction finds any provision of the Terms, or portion thereof, to be unenforceable, that provision shall be enforced to the maximum extent permissible so as to give effect to the intent of the parties as reflected by that provision, and the remainder of the Terms shall continue in full force and effect." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Waiver: Any failure by the Company to enforce or exercise any provision of the Terms, or any related right, shall not constitute a waiver by the Company of that provision or right." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Relationship: User acknowledge that his/her participation on the Mu-zero Platform (Services / Application/ products), does not make them an employee or agency or partnership or joint venture or franchise of the Company." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="User must read the all terms and conditions carefully that apply to use of the Mu-zero Platform (Services / Application/ products).  The use of the Mu-zero Platform (Services / Application/ products) by them shall be presumed that users have agreed to them." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">W. Feedback</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Any feedback You provide with respect to the Application shall be deemed to be non-confidential. Further, by submitting the feedback, You represent and warrant that (i) Your feedback does not contain confidential or proprietary information of You or of third parties; (ii) the Company is not under any obligation of confidentiality, express or implied, with respect to the feedback; (iii) the Application may have something similar to the feedback already under consideration or in development; and (iv) You are not entitled to any compensation or reimbursement of any kind from the Company for the feedback under any circumstances, unless specified." />
              </ListItem>
              <ListItem dense>
                <ListItemText primary="Under no circumstances shall the Company be held responsible in any manner for any content provided by other users even such content is offensive, hurtful or offensive. Please exercise caution while accessing the Application." />
              </ListItem>
            </Box>
            <Box className={classes.gridBox}>
              <ListItem dense>
                <ListItemText>
                  <Box component="h2">X. Customer Care</Box>
                </ListItemText>
              </ListItem>
              <ListItem dense>
                <ListItemText primary="We make all best endeavors to provide You with a pleasant experience. In the unlikely event that You face any issues, please contact us at support@mu-zero.io." />
              </ListItem>
            </Box>
          </Grid>

          <Grid item sm="auto" md={2} />
        </Grid>
      </Container>
    </div>
  );
};

export default withStyles(styles)(withRouter(TermsConditions));

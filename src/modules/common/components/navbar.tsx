import React, { FunctionComponent } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setAuthUser } from '../../auth/store/actions';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  InputBase,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';

import {
  // AccountCircle as AccountCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  Search as SearchIcon
} from '@material-ui/icons';
import { RootState } from '../../../store';
import {
  isAdminTutor,
  isStudent,
  isOrganization,
  isOrgTutor,
  isAdmin
} from '../helpers';
import { User } from '../../common/contracts/user';
import Logo from '../../../assets/svgs/book.svg';
import HomeIcon from '../../../assets/svgs/home.svg';
import HomeBlueIcon from '../../../assets/images/home-blue.jpg';
import StudentIcon from '../../../assets/svgs/student.svg';
import StudentBlueIcon from '../../../assets/images/student-blue.jpg';
import ScheduleIcon from '../../../assets/svgs/schedule.svg';
import ScheduleBlueIcon from '../../../assets/images/schedule-blue.jpg';
import AssessmentIcon from '../../../assets/svgs/assessment.svg';
import AssessmentBlueIcon from '../../../assets/images/assessment-blue.jpg';
import TutorIcon from '../../../assets/images/tutor.png';
import TutorBlueIcon from '../../../assets/images/tutor-blue.png';
import NotesIcon from '../../../assets/svgs/course.svg';
import NotesBlueIcon from '../../../assets/images/course-blue.png';
import CourseIcon from '../../../assets/svgs/course.svg';
import CourseBlueIcon from '../../../assets/images/course-blue.png';
import BellIcon from '../../../assets/svgs/bell.svg';

import ProfileImage from '../../dashboard/containers/profile_image';
import { eventTracker } from '../../common/helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },

    navigationBar: {
      flex: 2,
      textAlign: 'center',
      marginTop: '20px',
      '& > * + *': {
        marginLeft: theme.spacing(5)
      },

      '& .MuiLink-underlineHover:hover': {
        textDecoration: 'none'
      }
    },

    userDropdownTextContainer: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'flex'
      },
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '19px',
      textAlign: 'right',
      color: '#22C5F8'
    },
    search: {
      position: 'relative',
      background: '#F5F5F7',
      border: '1px solid rgba(102, 102, 102, 0.5)',
      borderRadius: '8px',
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666666'
    },
    inputRoot: {
      color: 'inherit',
      width: '300px',
      height: '40px'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch'
      }
    },
    navIcon: {
      height: '25px',
      width: '25px'
    },
    navHeading: {
      fontSize: '10px',
      lineHeight: '12px',
      color: '#212121'
    },
    navSelectedHeading: {
      fontSize: '10px',
      lineHeight: '12px',
      color: '#4C8BF5'
    },
    bellContainer: {
      paddingTop: '4px',
      marginRight: '15px',
      textAlign: 'center',

      '&:hover': {
        textDecoration: 'none'
      }
    },
    bellIcon: {
      background: 'rgba(102, 102, 102, 0.2)',
      borderRadius: '100%',
      padding: '6px 8px'
    },
    expandIcon: {
      color: '#666666',
      marginLeft: '10px'
    },
    toolbar: {
      justifyContent: 'space-between',
      minHeight: '72px'
    },
    menuLink: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '19px',
      color: '#666666',
      padding: '15px 20px'
    },
    selectedMenuLink: {
      display: 'inline-block',
      padding: '10px',
      marginBottom: '10px',
      width: '10%',
      textAlign: 'center',
      textDecoration: 'none',

      '&:hover': {
        background: 'rgba(102, 102, 102, 0.2)',
        borderRadius: '5px',
        textDecoration: 'none'
      }
    },
    selectedMenuLinkBorder: {
      display: 'inline-block',
      borderBottom: '3px solid #4C8BF5',
      paddingBottom: '20px',
      width: '10%',
      textAlign: 'center'
    }
  })
);

interface Props {
  authUser: User;
}

const Navbar: FunctionComponent<Props> = ({ authUser }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navLeft = () => {
    return (
      <Box display="flex" alignItems="center" flex="1">
        <img className={classes.navIcon} src={Logo} alt="Logo" />
        <Box
          fontSize="24px"
          fontWeight="bold"
          lineHeight="134.69%"
          color="#4C8BF5"
          marginLeft="9px"
        >
          Edumatica
        </Box>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder=""
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </Box>
    );
  };

  const navRight = (name: string, mobile: string, user: string) => {
    return (
      <Box zIndex="9" display="flex" alignItems="center">
        <Link
          color="inherit"
          component={RouterLink}
          to={`/profile/notification`}
          className={classes.bellContainer}
        >
          <Tooltip title="Notification">
            {window.location.pathname !== '/profile/notification' ? (
              <Box>
                <img className={classes.bellIcon} src={BellIcon} alt="Logo" />
                <Typography className={classes.navHeading}>
                  Notification
                </Typography>
              </Box>
            ) : (
              <Box>
                <img className={classes.bellIcon} src={BellIcon} alt="Logo" />
                <Typography className={classes.navSelectedHeading}>
                  Notification
                </Typography>
              </Box>
            )}
          </Tooltip>
        </Link>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <ProfileImage
            profile={authUser}
            profileUpdated={(profile) => dispatch(setAuthUser(profile))}
            name={name}
            size="small"
          />
          <div className={classes.userDropdownTextContainer}>
            <Box color="secondary" marginLeft="10px">
              {name && name.length > 0 ? name : mobile}
            </Box>
          </div>
          <ExpandMoreIcon className={classes.expandIcon} />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'left top' : 'left bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                    <MenuItem
                      component={RouterLink}
                      to={`/profile/personal-information`}
                    >
                      <Box display="flex" alignItems="center">
                        <ProfileImage
                          profile={authUser}
                          profileUpdated={(profile) =>
                            dispatch(setAuthUser(profile))
                          }
                          name={name}
                          size="small"
                        />
                        <Box
                          display="flex"
                          flexDirection="column"
                          fontWeight="600"
                          fontSize="14px"
                          lineHeight="19px"
                          color="#666666"
                          marginLeft="15px"
                        >
                          <Box
                            fontWeight="600"
                            fontSize="18px"
                            lineHeight="25px"
                            color="#22C5F8"
                          >
                            {name && name.length > 0 ? name : mobile}
                          </Box>
                          Profile
                        </Box>
                      </Box>
                    </MenuItem>
                    <Divider variant="fullWidth" />
                    <MenuItem
                      className={classes.menuLink}
                      component={RouterLink}
                      to={`/profile/dashboard`}
                    >
                      Settings &amp; Privacy
                    </MenuItem>
                    <MenuItem
                      className={classes.menuLink}
                      component={RouterLink}
                      to={`/profile/dashboard`}
                    >
                      Help &amp; Support
                    </MenuItem>
                    <MenuItem
                      className={classes.menuLink}
                      onClick={() =>
                        eventTracker(
                          'Logout',
                          `${user} Logout`,
                          'Logout Success'
                        )
                      }
                      component={RouterLink}
                      to={`/login`}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    );
  };

  if (isOrganization(authUser)) {
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar className={classes.toolbar}>
          {navLeft()}
          {window.location.pathname.substring(0, 20) !==
            '/profile/org/process' && (
            <Box className={classes.navigationBar}>
              <Tooltip
                title="Dashboard"
                disableHoverListener={
                  window.location.pathname === '/profile/dashboard'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/dashboard`}
                  className={
                    window.location.pathname === '/profile/dashboard'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/dashboard' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Home
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Home
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Enroll Tutor"
                disableHoverListener={
                  window.location.pathname.substring(0, 15) ===
                  '/profile/tutors'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/tutors`}
                  className={
                    window.location.pathname.substring(0, 15) ===
                    '/profile/tutors'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname.substring(0, 15) ===
                  '/profile/tutors' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={TutorBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Tutors
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={TutorIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Tutors
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Enroll Student"
                disableHoverListener={
                  window.location.pathname.substring(0, 17) ===
                    '/profile/students' ||
                  window.location.pathname === '/profile/org/batches/create'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/students`}
                  className={
                    window.location.pathname.substring(0, 17) ===
                      '/profile/students' ||
                    window.location.pathname === '/profile/org/batches/create'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname.substring(0, 17) ===
                    '/profile/students' ||
                  window.location.pathname === '/profile/org/batches/create' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={StudentBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Batches
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={StudentIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Batches
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Assessment"
                disableHoverListener={
                  window.location.pathname.substring(0, 19) ===
                  '/profile/assessment'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/assessment`}
                  className={
                    window.location.pathname.substring(0, 19) ===
                    '/profile/assessment'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname.substring(0, 19) ===
                  '/profile/assessment' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Schedule"
                disableHoverListener={
                  window.location.pathname === '/profile/schedules'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/schedules`}
                  className={
                    window.location.pathname === '/profile/schedules' ||
                    window.location.pathname === '/profile/org/schedules/create'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname === '/profile/schedules' ||
                  window.location.pathname ===
                    '/profile/org/schedules/create' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Course Content"
                disableHoverListener={
                  window.location.pathname === '/profile/courses' ? true : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/courses`}
                  className={
                    window.location.pathname === '/profile/courses'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/courses' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={CourseIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Courses
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={CourseBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Courses
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>
            </Box>
          )}

          {navRight(
            authUser.organizationName,
            authUser.mobileNo,
            'Organization'
          )}
        </Toolbar>
      </AppBar>
    );
  }

  if (isAdmin(authUser)) {
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar className={classes.toolbar}>
          {navLeft()}

          <Box className={classes.navigationBar}>
            <Tooltip
              title="Dashboard"
              disableHoverListener={
                window.location.pathname === '/profile/dashboard' ? true : false
              }
            >
              <Link
                color="inherit"
                component={RouterLink}
                to={`/profile/dashboard`}
              >
                {window.location.pathname !== '/profile/dashboard' ? (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={HomeIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navHeading}>Home</Typography>
                  </Box>
                ) : (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={HomeBlueIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navSelectedHeading}>
                      Home
                    </Typography>
                  </Box>
                )}
              </Link>
            </Tooltip>

            <Link
              color="inherit"
              onClick={() =>
                eventTracker('Logout', 'Admin Logout', 'Logout Success')
              }
              component={RouterLink}
              to={`/login`}
            >
              Logout
            </Link>
            <IconButton edge="end" color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  if (isAdminTutor(authUser)) {
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar className={classes.toolbar}>
          {navLeft()}
          {window.location.pathname.substring(0, 16) !== '/profile/process' && (
            <Box className={classes.navigationBar}>
              <Tooltip
                title="Dashboard"
                disableHoverListener={
                  window.location.pathname === '/profile/dashboard'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/dashboard`}
                  className={
                    window.location.pathname === '/profile/dashboard'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/dashboard' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Home
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Home
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Enroll Student"
                disableHoverListener={
                  window.location.pathname.substring(0, 17) ===
                    '/profile/students' ||
                  window.location.pathname === '/profile/tutor/batches/create'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/students`}
                  className={
                    window.location.pathname.substring(0, 17) ===
                      '/profile/students' ||
                    window.location.pathname === '/profile/tutor/batches/create'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname.substring(0, 17) ===
                    '/profile/students' ||
                  window.location.pathname ===
                    '/profile/tutor/batches/create' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={StudentBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Students
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={StudentIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Students
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Assessment"
                disableHoverListener={
                  window.location.pathname.substring(0, 19) ===
                  '/profile/assessment'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/assessment`}
                  className={
                    window.location.pathname.substring(0, 19) ===
                    '/profile/assessment'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname.substring(0, 19) ===
                  '/profile/assessment' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Schedule"
                disableHoverListener={
                  window.location.pathname === '/profile/schedules'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/schedules`}
                  className={
                    window.location.pathname === '/profile/schedules' ||
                    window.location.pathname ===
                      '/profile/tutor/schedules/create'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname === '/profile/schedules' ||
                  window.location.pathname ===
                    '/profile/tutor/schedules/create' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Course Content"
                disableHoverListener={
                  window.location.pathname === '/profile/courses' ? true : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/courses`}
                  className={
                    window.location.pathname === '/profile/courses'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/courses' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={CourseIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Courses
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={CourseBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Courses
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>
            </Box>
          )}

          {navRight(authUser.tutorName, authUser.mobileNo, 'Tutor')}
        </Toolbar>
      </AppBar>
    );
  }

  if (isOrgTutor(authUser)) {
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar className={classes.toolbar}>
          {navLeft()}

          {window.location.pathname.substring(0, 16) !== '/profile/process' && (
            <Box className={classes.navigationBar}>
              <Tooltip
                title="Dashboard"
                disableHoverListener={
                  window.location.pathname === '/profile/dashboard'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/dashboard`}
                  className={
                    window.location.pathname === '/profile/dashboard'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/dashboard' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Home
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={HomeBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Home
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Schedule"
                disableHoverListener={
                  window.location.pathname === '/profile/schedules'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/schedules`}
                  className={
                    window.location.pathname === '/profile/schedules'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/schedules' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={ScheduleBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Schedules
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>

              <Tooltip
                title="Assessment"
                disableHoverListener={
                  window.location.pathname === '/profile/assessment'
                    ? true
                    : false
                }
              >
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/profile/assessment`}
                  className={
                    window.location.pathname === '/profile/assessment'
                      ? classes.selectedMenuLinkBorder
                      : classes.selectedMenuLink
                  }
                >
                  {window.location.pathname !== '/profile/assessment' ? (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <img
                        className={classes.navIcon}
                        src={AssessmentBlueIcon}
                        alt="Logo"
                      />
                      <Typography className={classes.navSelectedHeading}>
                        Assessment
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Tooltip>
            </Box>
          )}
          {navRight(
            authUser.tutorName,
            authUser.mobileNo,
            'Organization Tutor'
          )}
        </Toolbar>
      </AppBar>
    );
  }

  if (isStudent(authUser)) {
    return (
      <AppBar position="static" elevation={0} color="inherit">
        <Toolbar className={classes.toolbar}>
          {navLeft()}

          <Box className={classes.navigationBar}>
            <Tooltip
              title="Dashboard"
              disableHoverListener={
                window.location.pathname === '/profile/dashboard' ? true : false
              }
            >
              <Link
                color="inherit"
                component={RouterLink}
                to={`/profile/dashboard`}
                className={
                  window.location.pathname === '/profile/dashboard'
                    ? classes.selectedMenuLinkBorder
                    : classes.selectedMenuLink
                }
              >
                {window.location.pathname !== '/profile/dashboard' ? (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={HomeIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navHeading}>Home</Typography>
                  </Box>
                ) : (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={HomeBlueIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navSelectedHeading}>
                      Home
                    </Typography>
                  </Box>
                )}
              </Link>
            </Tooltip>

            <Tooltip
              title="Schedule"
              disableHoverListener={
                window.location.pathname === '/profile/schedules' ? true : false
              }
            >
              <Link
                color="inherit"
                component={RouterLink}
                to={`/profile/schedules`}
                className={
                  window.location.pathname === '/profile/schedules'
                    ? classes.selectedMenuLinkBorder
                    : classes.selectedMenuLink
                }
              >
                {window.location.pathname !== '/profile/schedules' ? (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={ScheduleIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navHeading}>
                      Schedules
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={ScheduleBlueIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navSelectedHeading}>
                      Schedules
                    </Typography>
                  </Box>
                )}
              </Link>
            </Tooltip>

            <Tooltip
              title="Notes"
              disableHoverListener={
                window.location.pathname === '/profile/notes' ? true : false
              }
            >
              <Link
                color="inherit"
                component={RouterLink}
                to={`/profile/notes`}
                className={
                  window.location.pathname === '/profile/notes'
                    ? classes.selectedMenuLinkBorder
                    : classes.selectedMenuLink
                }
              >
                {window.location.pathname !== '/profile/notes' ? (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={NotesIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navHeading}>
                      Notes
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={NotesBlueIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navSelectedHeading}>
                      Notes
                    </Typography>
                  </Box>
                )}
              </Link>
            </Tooltip>

            <Tooltip
              title="Assessment"
              disableHoverListener={
                window.location.pathname === '/profile/assessments'
                  ? true
                  : false
              }
            >
              <Link
                color="inherit"
                component={RouterLink}
                to={`/profile/assessments`}
                className={
                  window.location.pathname === '/profile/assessments'
                    ? classes.selectedMenuLinkBorder
                    : classes.selectedMenuLink
                }
              >
                {window.location.pathname !== '/profile/assessments' ? (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={AssessmentIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navHeading}>
                      Assessment
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <img
                      className={classes.navIcon}
                      src={AssessmentBlueIcon}
                      alt="Logo"
                    />
                    <Typography className={classes.navSelectedHeading}>
                      Assessment
                    </Typography>
                  </Box>
                )}
              </Link>
            </Tooltip>
          </Box>

          {navRight(authUser.studentName, authUser.mobileNo, 'Student')}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" elevation={0} color="inherit">
      <Toolbar>
        <img src={Logo} alt="Logo" />
        <div className={classes.grow} />

        <Box className={classes.navigationBar}>
          <Link
            color="inherit"
            component={RouterLink}
            to={`/profile/dashboard`}
          >
            Home
          </Link>

          <Link
            color="inherit"
            component={RouterLink}
            to={`/profile/schedules`}
          >
            Schedule Calendar
          </Link>

          <Link
            color="inherit"
            component={RouterLink}
            to={`/profile/personal-information`}
          >
            Profile
          </Link>
          <Link color="inherit" component={RouterLink} to={`/login`}>
            Logout
          </Link>
          <IconButton edge="end" color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(Navbar);

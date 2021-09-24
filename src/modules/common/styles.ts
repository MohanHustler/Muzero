import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GuyInClassRoom from '../../assets/images/guy-in-class-room.jpg';

export const onBoardingStyles = (theme: Theme) =>
  createStyles({
    root: {
      background:
        'radial-gradient(47.89% 47.89% at 64.2% 52.11%, rgba(41, 75, 100, 0) 0%, rgba(41, 75, 100, 0.27) 67.71%), url(' +
        GuyInClassRoom +
        ')',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '0 0'
    },
    formContainer: {
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'flex-start'
      }
    },
    boxLayout: {
      position: 'absolute',
      top: '140px',
      left: '145px',
      maxWidth: '425px'
    },
    heading: {
      fontSize: '24px',
      lineHeight: '28px'
    },
    navLink: {
      fontSize: '16px',
      lineHeight: '134.69%',
      letterSpacing: '0.0125em',
      fontWeight: 500
    },
    helperText: {
      textAlign: 'center',
      fontSize: '12px',
      color: 'rgba(0, 0, 0, 0.5)',
      width: '86%',
      margin: '0 auto'
    },
    instructions: {
      fontSize: '12px',
      lineHeight: '14px'
    }
  });

export const processPageStyles = (theme: Theme) =>
  createStyles({
    nextBtn: {
      '& button': {
        padding: '15px 25px 15px 70px',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '21px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '10px',

        '& svg': {
          marginLeft: '20px'
        }
      }
    },
    previousBtn: {
      '& button': {
        padding: '15px 60px 15px 25px',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '21px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '10px',
        marginRight: '40px',

        '& svg': {
          marginRight: '20px'
        }
      }
    },
    finishBtn: {
      '& button': {
        padding: '15px 50px',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '21px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '10px'
      }
    },
    skipBtn: {
      '& button': {
        padding: '15px 20px',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '21px',
        letterSpacing: '1px',
        color: '#405169',
        border: '1px solid #4C8BF5',
        borderRadius: '5px',
        marginRight: '30px'
      }
    },
    helperText: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '23px',
      color: '#212121',
      textAlign: 'center'
    },
    instructionText: {
      fontSize: '14px',
      lineHeight: '18px',
      color: '#212121',
      marginBottom: '0px',
      fontWeight: 'normal'
    },
    requiredField: {
      display: 'inline-block',
      color: 'red',
      marginLeft: '3px'
    },
    customCourse: {
      '& .MuiFormControlLabel-root': {
        width: '100%',

        '& .MuiSwitch-root': {
          margin: '0 auto'
        }
      }
    },
    customCourseHelper: {
      fontSize: '14px',
      lineHeight: '18px',
      color: '#212121',
      width: '38%',
      margin: '0 auto',
      marginTop: '10px'
    },
    inputCheck: {
      '& svg': {
        fill: '#000'
      }
    },
    removeIcon: {
      color: '#F9BD33'
    },
    docList: {
      borderBottom: '1px dashed #EAE9E4',
      borderTop: '1px dashed #EAE9E4',
      margin: '25px 0'
    }
  });

export const profilePageStyles = (theme: Theme) =>
  createStyles({
    profileContainer: {
      background: '#fff',
      boxShadow: '0px 10px 20px rgb(31 32 65 / 5%)',
      borderRadius: '4px'
    },
    profileSection: {
      borderBottom: '0.5px solid #E3E3E3',
      padding: '20px 0px 10px 40px'
    },
    profileheading: {
      fontWeight: 500,
      fontSize: '24px',
      lineHeight: '30px',
      letterSpacing: '1px',
      color: '#212121'
    },
    helperText: {
      fontWeight: 300,
      fontSize: '15px',
      lineHeight: '18px',
      color: '#606A7B'
    },
    yellowBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '40px',
      '& button': {
        borderRadius: '5px',
        border: '1px solid #4285F4',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
        fontWeight: 600,
        fontSize: '18px',
        lineHeight: '21px',
        letterSpacing: '1px',
        color: '#4285F4',
        padding: '7px 15px'
      }
    },
    label: {
      fontWeight: 500,
      color: 'rgba(33, 33, 33, 0.5)',
      marginBottom: '8px'
    },
    inputValueContainer: {
      marginBottom: '20px',
      display: 'flex',

      '& svg': {
        marginRight: '8px'
      }
    },
    inputValue: {
      fontSize: '16px',
      lineHeight: '18px',
      color: '#151522',
      marginLeft: '5px'
    },
    subHeading: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '23px',
      color: '#333333'
    },
    courseHeading: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '30px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '10px'
    },
    courseSubHeading: {
      fontWeight: 'normal',
      fontSize: '13px',
      lineHeight: '15px',
      color: '#000000'
    },
    standard: {
      fontSize: '15px',
      lineHeight: '18px',
      color: '#405169'
    },
    subjects: {
      fontSize: '16px',
      lineHeight: '19px',
      color: '#405169'
    },
    tableContainer: {
      width: 'auto',
      border: '0.5px solid #E3E3E3',

      '& th': {
        border: '0.5px solid #E3E3E3'
      }
    }
  });

export const profileModalStyles = (theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#ffffff',
      margin: '0px'
    },
    submitBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '30px',

      '& button': {
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '21px',
        letterSpacing: '1px',
        padding: '14px 24px'
      }
    },
    addBtn: {
      '& button': {
        padding: '8px 12px',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '5px',

        '& svg': {
          fontSize: '20px'
        }
      }
    },
    viewIcon: {
      color: '#4C8BF5'
    },
    removeIcon: {
      color: '#F9BD33'
    },
    docList: {
      borderBottom: '1px dashed #EAE9E4',
      borderTop: '1px dashed #EAE9E4',
      margin: '25px 0'
    },
    iconBtn: {
      marginRight: '20px'
    },
    helperText: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '23px',
      color: '#212121',
      textAlign: 'center'
    },
    instructionText: {
      fontSize: '14px',
      lineHeight: '18px',
      color: '#212121',
      marginBottom: '15px',
      fontWeight: 'normal'
    },
    requiredField: {
      display: 'inline-block',
      color: 'red',
      marginLeft: '3px'
    },
    customCourse: {
      '& .MuiFormControlLabel-root': {
        width: '100%',

        '& .MuiSwitch-root': {
          margin: '0 auto'
        }
      }
    },
    customCourseHelper: {
      fontSize: '14px',
      lineHeight: '18px',
      color: '#212121',
      width: '44%',
      margin: '0 auto',
      marginTop: '10px'
    }
  });

export const profileLayoutStyles = (theme: Theme) =>
  createStyles({
    bodyContainer: {
      [theme.breakpoints.up('lg')]: {
        padding: '0 40px'
      }
    },

    welcomeHeading: {
      [theme.breakpoints.up('lg')]: {
        padding: '0 40px'
      },
      fontFamily: 'Mulish',
      fontWeight: 'normal',
      fontSize: '24px',
      lineHeight: '30px',
      letterSpacing: '1px',
      color: '#333333'
    },
    navList: {
      background: '#fff',
      marginBottom: '20px'
    },
    navItem: {
      padding: '8px 0px 8px 20px'
    }
  });

export const enrollmentStyles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    zeroPadWhite: {
      padding: '0px'
    },
    table: {
      minWidth: 750,

      '& thead tr th': {
        color: '#606A7B'
      },
      '& tbody tr th, & tbody tr td': {
        color: '#151522',
        fontSize: '16px'
      },
      '& thead tr th:first-child, & tbody tr td:first-child': {
        paddingLeft: '20px'
      },
      '& .MuiTableSortLabel-root.MuiTableSortLabel-active': {
        color: '#606A7B'
      }
    },
    sideIcons: {
      background: '#ffffff',
      borderRadius: '25px',
      padding: '8px',
      color: 'white',
      border: '1px solid #ffffff',
      marginRight: '10px'
    },
    heading: {
      margin: '0px',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#212121'
    },
    btn: {
      border: '1px solid #4C8BF5'
    },
    tablePagination: {
      '& .MuiTablePagination-caption': {
        fontSize: '18px',
        color: 'rgba(0, 0, 0, 0.54)'
      },
      '& .MuiSelect-select.MuiSelect-select': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '17px',
        paddingBottom: '0px'
      }
    },
    selectedList: {
      background: '#4C8BF5',
      boxShadow: '0px 2px 12px rgb(46 46 46 / 51%)',
      borderRadius: '3px',
      fontWeight: 500,
      color: '#FFFFFF',
      padding: '10px 30px',
      cursor: 'pointer'
    },
    listItem: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      color: 'rgba(33, 33, 33, 0.4)',
      padding: '10px 30px',
      cursor: 'pointer'
    }
  });

export const createStudentStyles = (theme: Theme) =>
  createStyles({
    paddClass: {
      padding: '0px 30px'
    },
    heading: {
      margin: '0',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#212121'
    },
    subHeading: {
      margin: '5px 0 15px 0',
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '23px',
      color: '#000000'
    },
    helperText: {
      fontSize: '16px',
      letterSpacing: '0.15px',
      color: 'rgba(0, 0, 0, 0.6)'
    },
    label: {
      fontWeight: 500,
      fontSize: '16px',
      marginTop: '5px'
    },
    studentsList: {
      margin: '0',
      fontWeight: 'normal',
      color: '#151522'
    },
    removeIcon: {
      color: 'rgba(0, 0, 0, 0.5)'
    },
    addBtn: {
      '& button': {
        padding: '10px 16px',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '5px',

        '& svg': {
          fontSize: '20px'
        }
      }
    },
    clearBtn: {
      '& button': {
        border: '1px solid #666666',
        color: '#666666'
      }
    }
  });

export const batchStyles = (theme: Theme) =>
  createStyles({
    heading: {
      margin: '0px',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#666666'
    },
    checkLabel: {
      '& .MuiFormControlLabel-label': {
        fontFamily: 'Mulish',
        fontSize: '15px',
        lineHeight: '19px',
        letterSpacing: '0.25px',
        color: '#202842'
      }
    },
    addIcon: {
      '& button': {
        background: '#FDFDFD',
        border: '1px solid #F2F2F2',
        borderRadius: '0',
        padding: '20px 25px'
      }
    },
    studentChip: {
      padding: '10px',
      background: '#FFFFFF',
      boxShadow: '0px 10px 20px rgb(31 32 65 / 5%)',
      border: '1px solid rgba(102, 102, 102, 0.3)',
      borderRadius: '5px',
      minHeight: '70px',

      '& .MuiChip-root': {
        background: '#FDE5AD',
        borderRadius: '20px',
        padding: '10px 8px',
        fontFamily: 'Mulish',
        fontSize: '15px',
        color: '#202842'
      },
      '& .MuiChip-deleteIcon': {
        color: '#ABAEC2'
      }
    },
    addBtn: {
      '& button': {
        padding: '10px 35px'
      }
    },
    clearBtn: {
      '& button': {
        border: '1px solid #666666',
        color: '#666666',
        padding: '10px 35px'
      }
    }
  });

export const batchListStyles = (theme: Theme) =>
  createStyles({
    course: {
      fontSize: '16px',
      lineHeight: '18px',
      color: '#365969',
      flex: '2.5'
    },
    batchDateLabel: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '16px',
      color: '#666666',
      marginBottom: '6px'
    },
    batchDate: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      color: '#333333'
    },
    removeIcon: {
      color: '#666666'
    },
    rightSpacing: {
      marginRight: '10px'
    }
  });

export const assessmentStyles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    zeroPadWhite: {
      padding: '0px',
      color: 'white'
    },
    zeroPadGray: {
      padding: '0px',
      color: 'darkgray'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750,

      '& thead tr th': {
        color: '#606A7B'
      },
      '& tbody tr th, & tbody tr td': {
        color: '#151522',
        fontSize: '16px'
      },
      '& thead tr th:first-child, & tbody tr td:first-child': {
        paddingLeft: '20px'
      },
      '& .MuiTableSortLabel-root.MuiTableSortLabel-active': {
        color: '#606A7B'
      }
    },
    sideIcons: {
      background: '#ffffff',
      borderRadius: '25px',
      padding: '8px',
      color: 'white',
      border: '1px solid #ffffff',
      marginRight: '10px'
    },
    heading: {
      margin: '0px',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#212121'
    },
    addBtn: {
      '& a': {
        padding: '8px 16px'
      }
    },
    tablePagination: {
      '& .MuiTablePagination-caption': {
        fontSize: '18px',
        color: 'rgba(0, 0, 0, 0.54)'
      },
      '& .MuiSelect-select.MuiSelect-select': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '17px',
        paddingBottom: '0px'
      }
    },
    subLabel: {
      fontSize: '12px'
    },
    createBtn: {
      '& button': {
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        padding: '10px 24px'
      }
    },
    cancelBtn: {
      '& button': {
        background: '#FFFFFF',
        border: '1px solid #666666',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '1px',
        color: '#666666',
        padding: '10px 24px'
      }
    }
  });

export const scheduleStyles = (theme: Theme) =>
  createStyles({
    paperContainer: {
      background: '#F9F9F9',
      boxShadow: '0px 10px 20px rgb(31 32 65 / 5%)',
      borderRadius: '4px',

      '& .makeStyles-stickyElement-68': {
        background: '#F9F9F9'
      }
    },
    heading: {
      margin: '0px',
      fontWeight: 500,
      fontSize: '24px',
      letterSpacing: '1px',
      color: '#666666'
    },
    addBtn: {
      '& a': {
        fontFamily: 'Mulish',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      },
      '& svg': {
        marginRight: '5px'
      }
    },
    checkLabel: {
      '& .MuiFormControlLabel-label': {
        fontFamily: 'Mulish',
        fontSize: '15px',
        lineHeight: '19px',
        letterSpacing: '0.25px',
        color: '#202842'
      }
    },
    createBtn: {
      '& button': {
        padding: '8px 12px',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '5px',

        '& svg': {
          fontSize: '20px',
          marginRight: '5px'
        }
      }
    },
    clearBtn: {
      '& button': {
        border: '1px solid #666666',
        color: '#666666',
        padding: '10px 35px'
      }
    },
    removeIcon: {
      color: '#666666'
    },
    removeScheduleIcon: {
      color: '#F47C7B'
    },
    tableHeading: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      textTransform: 'uppercase',
      color: '#666666'
    },
    tableData: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
      textTransform: 'capitalize',
      letterSpacing: '1px',
      color: '#000000'
    },
    saveBtn: {
      '& button': {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '5px',
        padding: '14px 55px',
        fontWeight: 'bold',
        fontSize: '18px'
      }
    },
    cancelBtn: {
      marginRight: '10px',

      '& button': {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '5px',
        background: '#FFFFFF',
        border: '1px solid #666666',
        lineHeight: '18px',
        color: '#666666',
        padding: '14px 55px',
        fontWeight: 'normal',
        fontSize: '16px'
      }
    },
    dayName: {
      fontWeight: 'normal',
      fontSize: '20px',
      color: '#405169',
      margin: '0 0 0 20px'
    },
    scheduleName: {
      fontSize: '15px',
      lineHeight: '18px',
      color: '#365969',
      marginBottom: '13px'
    },
    scheduleDetails: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',

      color: '#333333'
    }
  });

export const scheduleSummaryStyles = makeStyles((theme: Theme) =>
  createStyles({
    todayCell: {
      backgroundColor: theme.palette.background.paper,
      border: 0
    },
    weekdayCell: {
      backgroundColor: theme.palette.background.default,
      border: 0
    },
    today: {
      backgroundColor: theme.palette.background.paper,
      textTransform: 'uppercase',

      '& .Cell-highlightedText-100': {
        color: '#333333',
        fontWeight: 'normal'
      }
    },
    weekday: {
      backgroundColor: theme.palette.background.default,
      textTransform: 'uppercase',
      color: '#333333'
    },
    className: {
      fontFamily: 'Mulish',
      fontSize: '18px',
      color: '#FFFFFF',
      margin: '0 10px 0 0'
    },
    subjectName: {
      fontWeight: 500,
      fontSize: '16px',
      color: '#FFFFFF',
      margin: '0 10px 0 0'
    },
    clockIcon: {
      color: '#fff'
    },
    scheduleDuration: {
      fontSize: '18px',
      color: '#FFFFFF'
    },
    studentsList: {
      fontFamily: 'Mulish',
      fontSize: '15px',
      letterSpacing: '0.25px',
      color: '#FFFFFF'
    },
    editBtn: {
      '& button': {
        border: '2px solid #FFFFFF',
        borderRadius: '5px',
        fontFamily: 'Montserrat',
        fontWeight: 600,
        fontSize: '14px',
        letterSpacing: '1px',
        color: '#FFFFFF'
      },
      '& svg': {
        marginLeft: '8px'
      },
      '& img': {
        marginLeft: '8px',
        height: '20px',
        width: '17px'
      }
    }
  })
);

export const courseContentStyles = (theme: Theme) =>
  createStyles({
    addChapterButton: {
      background: '#FFF',
      border: '2px solid #F2F2F2',
      color: theme.palette.secondary.main,
      position: 'absolute',
      right: '20px',
      top: '-25px',

      '&:hover': {
        background: '#FFF'
      }
    },
    courseHeading: {
      fontWeight: 500,
      fontSize: '18.2px',
      lineHeight: '21px',
      color: '#10182F'
    },
    helperText: {
      fontSize: '14px',
      color: '#979797',
      margin: '15px 0'
    },
    chapterItem: {
      background: 'rgba(241, 243, 247, 0.2)',
      border: '1px solid rgba(151, 151, 151, 0.2)',
      borderRadius: '3px',
      cursor: 'pointer',
      fontWeight: 500,
      margin: '5px 0',
      padding: '21px 20px 24px 20px',
      wordBreak: 'break-word',
      fontSize: '16px',
      lineHeight: '19px',
      color: '#242E4C'
    },
    isActive: {
      background: '#00B9F5',
      border: '1px solid #00B9F5'
    },
    courseHeadingText: {
      margin: '0px',
      marginBottom: '6px',
      fontWeight: 500,
      color: '#666666'
    },
    saveBtn: {
      '& button': {
        fontWeight: 'bold',
        fontSize: '24px',
        lineHeight: '28px',
        padding: '14px 25px'
      }
    }
  });

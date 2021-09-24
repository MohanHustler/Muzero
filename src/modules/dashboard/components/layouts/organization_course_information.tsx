import React, { FunctionComponent, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Organization } from '../../../common/contracts/user';
import { updateOrganization } from '../../../common/api/organization';
import Subject from '../../../../assets/images/course-book.png';
import Button from '../../../common/components/form_elements/button';
import { exceptionTracker } from '../../../common/helpers';
import { profilePageStyles } from '../../../common/styles';
import Layout from '../organization_layout';
import OrganizationCourseInformationModal from '../modals/organization_course_information_modal';
import { BoardClassSubjectsMap } from '../../../academics/contracts/board_class_subjects_map';
import { Redirect } from 'react-router-dom';

interface Props extends WithStyles<typeof profilePageStyles> {
  profile: Organization;
  profileUpdated: (user: Organization) => any;
}

const OrganizationCourseInformation: FunctionComponent<Props> = ({
  classes,
  profile,
  profileUpdated
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const saveSubjectInformation = async (data: Organization) => {
    const user = Object.assign({}, profile, data);

    try {
      await updateOrganization(user);
      profileUpdated(user);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      } else {
        //profileUpdated(profile);
      }
    }
  };

  const courses = [...profile.courseDetails];

  const boardClassSubjectsMap: BoardClassSubjectsMap[] = [];

  for (let i = 0; i < courses.length; ++i) {
    const subject = courses[i];

    let boardClassSubjectIndex = boardClassSubjectsMap.findIndex(
      (boardClassSubject) =>
        boardClassSubject.boardname.toLowerCase() ===
          subject.board.toLowerCase() &&
        boardClassSubject.classname.toString().toLowerCase() ===
          subject.className.toString().toLowerCase()
    );

    if (boardClassSubjectIndex === -1) {
      boardClassSubjectsMap.push({
        boardname: subject.board,
        classname: subject.className,
        subjects: []
      });

      boardClassSubjectIndex = boardClassSubjectsMap.length - 1;
    }

    boardClassSubjectsMap[boardClassSubjectIndex].subjects.push(
      subject.subject
    );
  }

  const boards = Array.from(new Set(courses.map((course) => course.board)));

  return (
    <Layout profile={profile as Organization}>
      <OrganizationCourseInformationModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        saveUser={saveSubjectInformation}
        user={profile as Organization}
      />

      <Box className={classes.profileContainer}>
        <Box className={classes.profileSection}>
          <Grid container alignItems="center">
            <Grid item>
              <Box display="flex" alignItems="center" marginBottom="20px">
                <img src={Subject} alt="Course Details" />

                <Box marginLeft="15px">
                  <Typography component="span" color="primary">
                    <Box component="h2" className={classes.profileheading}>
                      Course Details
                    </Box>
                  </Typography>

                  <Typography className={classes.helperText}>
                    View &amp; Edit Your Class &amp; Subjects
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box padding="20px 0px 20px 40px">
          <Box
            marginBottom="20px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.subHeading}>Courses</Box>
            <Box className={classes.yellowBtn}>
              <Button variant="outlined" onClick={() => setOpenModal(true)}>
                <Box display="flex" alignItems="center">
                  <Box component="span" display="flex" marginRight="10px">
                    <AddIcon fontSize="small" />
                  </Box>
                  Add
                </Box>
              </Button>
            </Box>
          </Box>
          {boards &&
            boards.length > 0 &&
            boards.map((board, boardIndex) => (
              <Box marginBottom="20px" key={boardIndex}>
                <Typography
                  variant="h5"
                  color="primary"
                  className={classes.courseHeading}
                >
                  {board}
                </Typography>

                <TableContainer>
                  <Table className={classes.tableContainer}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.courseSubHeading}>
                          Classes
                        </TableCell>
                        <TableCell className={classes.courseSubHeading}>
                          Subjects
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {boardClassSubjectsMap
                        .filter(
                          (boardClassSubjectMap) =>
                            boardClassSubjectMap.boardname === board
                        )
                        .map((boardClassSubjectMap, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              className={classes.standard}
                            >
                              {boardClassSubjectMap.classname}
                            </TableCell>
                            <TableCell className={classes.subjects}>
                              {boardClassSubjectMap.subjects.join(', ')}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default withStyles(profilePageStyles)(OrganizationCourseInformation);

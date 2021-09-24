import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import {
  createStyles,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles';
import { ChevronRight as ChevronRightIcon } from '@material-ui/icons';
import { Organization } from '../../../common/contracts/user';
import MainLayoutBBB from '../bbb_mainLayout';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import Button from '../../../common/components/form_elements/button';
import {
  fetchBatchesList,
  fetchSchedulesList
} from '../../../common/api/academics';
import {
  getRecordingbyId,
  deleteRecordingbyId,
  createMeeting,
  joinMeeting
} from '../../helper/api';
import {
  createNewMeeting,
  getRecordingInfoById,
  joinMeetingById
} from '../../store/actions';
import { Batch } from '../../../academics/contracts/batch';
import { AppointmentSchedule } from '../../../academics/contracts/schedule';
import { generateSchedulerSchema } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { xml2js } from 'xml-js';
import BatchIcon from '../../../../assets/svgs/student-with-monitor-light.svg';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = createStyles({
  grid_layout: {
    color: 'secondary'
  },
  box: {
    padding: '12px'
  },
  head_1: {
    width: '220px',
    background:
      'linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)',
    color: 'white',
    border:
      '1px solid linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)',
    marginRight: '10px',
    fontSize: '16px',
    textAlign: 'center'
  },
  sideIcons3: {
    width: '220px',
    background:
      'linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)',
    borderRadius: '25px',
    color: 'white',
    border:
      '1px solid linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)',
    marginRight: '10px',
    fontSize: '16px'
  },
  sideIcons4: {
    width: '220px',
    background:
      'linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)',
    borderRadius: '25px',
    color: 'white',
    border:
      '1px solid linear-gradient(90deg, rgb(251, 188, 5) 2.53%, rgb(232, 172, 0) 100%)',
    marginRight: '10px',
    fontSize: '16px'
  }
});
interface Props extends WithStyles<typeof styles> {
  profile: Organization;
}

const OrgMeetingDashboard: FunctionComponent<Props> = ({classes, profile}) => {
  return (
    <MainLayoutBBB>
      <Container>
        <Box bgcolor="#fff">
          <Box padding="20px 30px" display="flex" alignItems="center">
            <img src={BatchIcon} alt="Create Batch" />

            <Box marginLeft="15px">
              <Typography component="span" color="secondary">
                <Box component="h3" fontWeight="600" margin="0">
                  Meeting Dashoard
                </Box>
              </Typography>
            </Box>
          </Box>

          <Divider />
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Box bgcolor="#fff" className={classes.grid_layout}>
                <Typography className={classes.box} variant="h6">
                  Host Custom Meeting
                </Typography>
                <Divider />
                {/* <BatchBlock /> */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainLayoutBBB>
  )
}

export default withStyles(styles)(OrgMeetingDashboard)

import React, { FunctionComponent } from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import GroupWorkIcon from '../../../assets/images/group-icon.png';
import GroupIcon from '../../../assets/images/students.png';
import EventIcon from '../../../assets/images/calendar.png';
import RemoveCircleIcon from '../../../assets/images/remove-circle-gray.png';
import { batchListStyles } from '../../common/styles';
import moment from 'moment';
import { Batch } from '../contracts/batch';

interface Props extends WithStyles<typeof batchListStyles> {
  item: Batch;
  editItem: () => any;
  removeItem: () => any;
}

const OrgBatchListItem: FunctionComponent<Props> = ({
  item,
  editItem,
  removeItem,
  classes
}) => {
  return (
    <Box
      bgcolor="#C1E3F2"
      border="1px solid rgba(0, 0, 0, 0.08)"
      borderRadius="2px"
      color="#333333"
      marginTop="10px"
    >
      <Box padding="15px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
        <Box display="flex" justifyContent="space-between" marginBottom="15px">
          <Typography className={classes.course}>
            {item.classname} | {item.subjectname} | {item.tutorId?.tutorName}
          </Typography>

          <Box flex="1" textAlign="right">
            <IconButton
              size="small"
              onClick={editItem}
              className={classes.rightSpacing}
            >
              <EditIcon className={classes.removeIcon} />
            </IconButton>
            <IconButton size="small" onClick={removeItem}>
              <img src={RemoveCircleIcon} alt="Remove Icon" />
            </IconButton>
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          marginTop="5px"
          justifyContent="space-between"
        >
          <Box
            component="span"
            display="flex"
            alignItems="center"
            marginRight="10px"
          >
            <img src={GroupWorkIcon} alt="Batch Icon" />

            <Box component="span" marginLeft="5px">
              {item.batchfriendlyname}
            </Box>
          </Box>
          <Box component="span" display="flex" alignItems="center">
            <img src={GroupIcon} alt="Students Icon" />

            <Box component="span" marginLeft="5px">
              {item.students.length} Students
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" padding="15px">
        <img src={EventIcon} alt="Event Icon" />

        <Box marginLeft="15px">
          <Typography className={classes.batchDateLabel}>
            Batch Start
          </Typography>
          <Typography className={classes.batchDate}>
            {moment(item.batchstartdate).format('DD-MM-YYYY')}
          </Typography>
        </Box>

        <Box marginLeft="15px">
          <Typography className={classes.batchDateLabel}>Batch End</Typography>
          <Typography className={classes.batchDate}>
            {moment(item.batchenddate).format('DD-MM-YYYY')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default withStyles(batchListStyles)(OrgBatchListItem);

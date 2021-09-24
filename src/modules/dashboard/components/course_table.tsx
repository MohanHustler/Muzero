import React, { FunctionComponent } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import { RemoveCircleOutline as RemoveCircleIcon } from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { BoardClassSubjectsMap } from '../../academics/contracts/board_class_subjects_map';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    courseHeading: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '1px',
      textTransform: 'capitalize',
      color: '#4C8BF5'
    },
    courseContent: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '1px',
      textTransform: 'capitalize',
      color: '#000000'
    },
    removeIcon: {
      fill: '#000000'
    }
  })
);

interface BoardClassSubjectRowProps {
  item: BoardClassSubjectsMap;
  handleRemoveItem: () => any;
}

const BoardClassSubjectsRow: FunctionComponent<BoardClassSubjectRowProps> = ({
  item,
  handleRemoveItem
}) => {
  const classes = useStyles();
  return (
    <Box marginTop="5px">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <Box className={classes.courseContent}>{item.boardname}</Box>
        </Grid>

        <Grid item xs={3}>
          <Box className={classes.courseContent}>{item.classname}</Box>
        </Grid>

        <Grid item xs={4}>
          <Box className={classes.courseContent}>
            {item.subjects.join(', ')}
          </Box>
        </Grid>

        <Grid item xs={2}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={handleRemoveItem}>
              <RemoveCircleIcon className={classes.removeIcon} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

interface Props {
  boardClassSubjectsMap: BoardClassSubjectsMap[];
  handleRemoveItem: (map: BoardClassSubjectsMap) => any;
}

const CourseTable: FunctionComponent<Props> = ({
  boardClassSubjectsMap,
  handleRemoveItem
}) => {
  const classes = useStyles();
  return (
    <Box
      borderBottom="1px dashed #EAE9E4"
      borderTop="1px dashed #EAE9E4"
      marginY="15px"
      paddingTop="18px"
      paddingBottom="18px"
    >
      <Box marginBottom="10px">
        <Grid container>
          <Grid item xs={3}>
            <Box className={classes.courseHeading}>BOARD</Box>
          </Grid>

          <Grid item xs={3}>
            <Box className={classes.courseHeading}>CLASS</Box>
          </Grid>

          <Grid item xs={6}>
            <Box className={classes.courseHeading}>SUBJECTS</Box>
          </Grid>
        </Grid>
      </Box>

      {boardClassSubjectsMap.map((map, index) => (
        <BoardClassSubjectsRow
          key={index}
          item={map}
          handleRemoveItem={() => handleRemoveItem(map)}
        />
      ))}
    </Box>
  );
};

export default CourseTable;

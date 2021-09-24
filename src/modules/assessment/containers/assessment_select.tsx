import React, { FunctionComponent, useState, useEffect } from 'react';
import { Link as RouterLink, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  makeStyles,
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import {
  Box,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Checkbox,
  IconButton,
  InputAdornment,
  FormControl,
  Input,
  Tooltip
} from '@material-ui/core';
import {
  Search as SearchIcon,
  SortSharp as SortSharpIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ListAlt as ListAltIcon,
  AssignmentInd as AssignmentIndIcon
} from '@material-ui/icons';
import AssessmentIcon from '../../../assets/images/assessment-checklist.png';
import Button from '../../common/components/form_elements/button';
import Navbar from '../../common/components/navbar';
import { exceptionTracker } from '../../common/helpers';
import { RootState } from '../../../store';
import { User } from '../../common/contracts/user';
import { Redirect } from 'react-router-dom';
import {
  deleteAssessment,
  getAssessmentsForTutor,
  getAssignedAssessmentData,
  createAssessmentCopy
} from '../helper/api';
import { Assessment } from '../contracts/assessment_interface';
import { isOrganization } from '../../common/helpers';
import { assessmentStyles } from '../../common/styles';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  })
);

type Order = 'asc' | 'desc';

function stableSort<T>(
  array: T[],
  comparator: (a: T, b: T) => number,
  order: Order
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const ordered = comparator(a[0], b[0]);
    if (ordered === 0) return ordered;
    if (order === 'asc') {
      return a[1] - b[1];
    } else {
      return b[1] - a[1];
    }
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Assessment;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'assessmentname', numeric: false, disablePadding: true, label: 'Name' },
  {
    id: 'boardname',
    numeric: false,
    disablePadding: false,
    label: 'Board'
  },
  {
    id: 'classname',
    numeric: false,
    disablePadding: false,
    label: 'Class'
  },
  {
    id: 'subjectname',
    numeric: false,
    disablePadding: false,
    label: 'Subject'
  },
  {
    id: 'totalMarks',
    numeric: false,
    disablePadding: false,
    label: 'Marks'
  },
  {
    id: 'duration',
    numeric: false,
    disablePadding: false,
    label: 'Duration(Mins)'
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Assessment
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const classes = useStyles();

  const createSortHandler = (property: keyof Assessment) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all students' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell key="actions" align="left" padding="default">
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface Props
  extends RouteComponentProps<{ username: string }>,
    WithStyles<typeof assessmentStyles> {
  authUser: User;
}

const Assessment_selection: FunctionComponent<Props> = ({
  authUser,
  history,
  classes
}) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Assessment>(
    'assessmentname'
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Assessment[]>([]);
  const [redirectTo, setRedirectTo] = useState('');
  const [searchText, setSearchText] = useState<string>('');
  const [sourceData, setSourceData] = useState<Assessment[]>([]);
  const [myAssessmentFilter, setMyAsssessmentFilter] = useState<boolean>(false);
  const [assignedAssessments, setAssignedAssessments] = useState<string[]>([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    getassessments(myAssessmentFilter);
  }, [setMyAsssessmentFilter]);

  useEffect(() => {
    if (searchText.trim() !== '') {
      setRows(search(sourceData, searchText));
      return;
    } else {
      setRows(sourceData);
    }
  }, [searchText, sourceData]);

  useEffect(() => {
    getAssignedAssessments();
  }, []);

  const getAssignedAssessments = async () => {
    try {
      const response = await getAssignedAssessmentData();
      setAssignedAssessments(response);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const search = (sourceData: Assessment[], text: string): Assessment[] => {
    const lowerText = text.toLowerCase();
    return sourceData.filter((row: Assessment) => {
      if (row.boardname.toLowerCase().indexOf(lowerText) != -1) {
        return true;
      }
      if (row.assessmentname.toLowerCase().indexOf(lowerText) != -1) {
        return true;
      }
      if (row.subjectname.toLowerCase().indexOf(lowerText) != -1) {
        return true;
      }
      if (row.classname.toLowerCase().indexOf(lowerText) != -1) {
        return true;
      }
      return false;
    });
  };

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const getassessments = async (privateBool: boolean) => {
    try {
      const response = await getAssessmentsForTutor(privateBool);
      setSourceData(response);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const getComparator = <Key extends keyof any>(
    a: Assessment,
    b: Assessment
  ): number => {
    return ascendingComparator(a, b, orderBy);
  };

  function ascendingComparator<Assessment>(
    a: Assessment,
    b: Assessment,
    orderBy: keyof Assessment
  ) {
    if (b[orderBy] < a[orderBy]) {
      return 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return -1;
    }
    return 0;
  }

  const createAssessmentDuplicate = async (
    ev: React.MouseEvent<unknown>,
    assessmentData: Assessment
  ) => {
    try {
      const response = await createAssessmentCopy(assessmentData);
      setSourceData((prev) => {
        return [...prev, response];
      });
      handleClick(ev, assessmentData.assessmentname);
    } catch (err) {
      exceptionTracker(err.response?.data.message);
      if (err.response?.status === 401)
        // setRedirectTo('/login')
        enqueueSnackbar('Error creating duplicate.Please try again', {
          variant: 'info'
        });
    }
  };

  const SnackbarAction = (key: number, assessmentData: Assessment) => {
    return (
      <React.Fragment>
        <Button
          onClick={(ev: React.MouseEvent<unknown>) => {
            createAssessmentDuplicate(ev, assessmentData);
            closeSnackbar(key);
          }}
        >
          Create Copy
        </Button>
        <Button
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          Cancel
        </Button>
      </React.Fragment>
    );
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Assessment
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.assessmentname);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleDeleteAction = (data: Assessment) => {
    if (assignedAssessments.includes(data._id)) {
      enqueueSnackbar(
        'Assessment has been assigned to some students. Cannot be Deleted',
        { variant: 'warning' }
      );
    } else {
      deleteAssessment('?assessmentId=' + encodeURI(data._id)).then(() => {
        getassessments(myAssessmentFilter);
      });
    }
  };

  const handleQuestionEditAction = (data: Assessment) => {
    if (assignedAssessments.includes(data._id)) {
      enqueueSnackbar(
        'Assessment has been assigned to some students. Cannot be Edited',
        { variant: 'warning' }
      );
      enqueueSnackbar('Would you like to create an Editable copy?', {
        variant: 'info',
        persist: true,
        action: (key) => {
          return SnackbarAction(key as number, data);
        }
      });
    } else {
      history.push(
        '/profile/assessment_questions?assessmentId=' + encodeURI(data._id)
      );
    }
  };

  const handleEditAction = (data: Assessment) => {
    if (assignedAssessments.includes(data._id)) {
      enqueueSnackbar(
        'Assessment has been assigned to some students. Cannot be Edited',
        { variant: 'warning' }
      );
    } else {
      history.push(
        '/profile/assessment/edit?assessmentId=' + encodeURI(data._id)
      );
    }
  };

  const handleAssignAction = (data: Assessment) => {
    history.push(
      '/profile/assessment_assign?assessmentId=' + encodeURI(data._id)
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const buttonData = [
    {
      title: 'Edit Details',
      class: classes.sideIcons,
      padClass: classes.zeroPadGray,
      action: handleEditAction,
      icon: <EditIcon />
    },
    {
      title: 'Assign to Students',
      class: classes.sideIcons,
      padClass: classes.zeroPadGray,
      action: handleAssignAction,
      icon: <AssignmentIndIcon />
    },
    {
      title: 'Edit Questions',
      class: classes.sideIcons,
      padClass: classes.zeroPadGray,
      action: handleQuestionEditAction,
      icon: <ListAltIcon />
    },
    {
      title: 'Delete Assessment',
      class: classes.sideIcons,
      padClass: classes.zeroPadGray,
      action: handleDeleteAction,
      icon: <DeleteIcon />
    }
  ];

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box bgcolor="white" marginY="20px">
          <Grid container>
            <Grid item xs={12} md={7} lg={7}>
              <Box padding="20px 30px" display="flex" alignItems="center">
                <img src={AssessmentIcon} alt="Person with Book" />

                <Box marginLeft="15px" display="flex" alignItems="center">
                  <Typography component="span" color="secondary">
                    <Box component="h3" className={classes.heading}>
                      Assessments
                    </Box>
                  </Typography>

                  <Box marginLeft="25px" className={classes.addBtn}>
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      component={RouterLink}
                      startIcon={<AddIcon />}
                      to={`/profile/assessment/create`}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid container item lg={5} md={5}>
              <Grid item lg={5} md={5}>
                {!isOrganization(authUser) && (
                  <React.Fragment>
                    <Box margin="25px 10px 10px 25px">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={myAssessmentFilter}
                            onChange={(
                              ev: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const checked = ev.target.checked;
                              setMyAsssessmentFilter(checked);
                            }}
                            name="myAssessmentFilter"
                            color="primary"
                          />
                        }
                        label="Private"
                      />
                    </Box>
                  </React.Fragment>
                )}
              </Grid>
              <Grid item lg={7} md={7}>
                <Box display="flex" alignItems="right">
                  <Box margin="15px 10px 10px 25px">
                    <FormControl fullWidth margin="normal">
                      <Input
                        name="search"
                        inputProps={{ inputMode: 'search' }}
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                        }}
                        endAdornment={
                          searchText.trim() !== '' ? (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setSearchText('')}
                              >
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              <IconButton disabled size="small">
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      />
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Divider />

          <Box>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort<Assessment>(rows, getComparator, order)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.assessmentname);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            handleClick(event, row.assessmentname)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.assessmentname}
                          </TableCell>
                          <TableCell>{row.boardname}</TableCell>
                          <TableCell>{row.classname}</TableCell>
                          <TableCell>{row.subjectname}</TableCell>
                          <TableCell>{row.totalMarks}</TableCell>
                          <TableCell>{row.duration}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {buttonData.map((button, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <Tooltip title={button.title}>
                                      <Box
                                        className={button.class}
                                        boxShadow={3}
                                      >
                                        <IconButton
                                          classes={{ root: button.padClass }}
                                          onClick={() => {
                                            button.action(row);
                                          }}
                                          size="small"
                                        >
                                          {button.icon}
                                        </IconButton>
                                      </Box>
                                    </Tooltip>
                                  </React.Fragment>
                                );
                              })}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              className={classes.tablePagination}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              labelDisplayedRows={({ from, to, count }) =>
                `Showing ${from}-${to} of ${count}`
              }
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(
  withStyles(assessmentStyles)(Assessment_selection)
);

import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Link as RouterLink,
  Redirect,
  RouteComponentProps
} from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@material-ui/icons';
import PersonWithBook from '../../../assets/images/study.png';
import Button from '../../common/components/form_elements/button';
import Navbar from '../../common/components/navbar';
import {
  isOrganization,
  isAdminTutor,
  exceptionTracker
} from '../../common/helpers';
import { RootState } from '../../../store';
import { User, Student } from '../../common/contracts/user';
import {
  fetchTutorStudentsList,
  fetchBatchesList
} from '../../common/api/academics';
import { deleteStudents } from '../../common/api/profile';
import {
  getOrgStudentsList,
  deleteStudentsOfOrganization
} from '../../common/api/organization';
import { isTutor } from '../../common/helpers';
import { enrollmentStyles } from '../../common/styles';
import { setCurrentStudent } from '../store/actions';
import { CurrentStudent } from '../contracts/student';
import { Batch } from '../../../modules/academics/contracts/batch';
import BatchListItem from '../../../modules/academics/components/batch_list_item';

interface Data {
  mobileNo: string;
  name: string;
  board: string;
  classname: string;
  schoolname: string;
}

function createData(
  name: string,
  enrollmentId: string,
  mobileNo: string,
  parentMobileNo: string,
  email: string,
  pincode: string,
  city: string,
  state: string,
  board: string,
  classname: string,
  schoolname: string
): CurrentStudent {
  return {
    name,
    enrollmentId,
    mobileNo,
    parentMobileNo,
    email,
    pincode,
    city,
    state,
    board,
    classname,
    schoolname
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'mobileNo',
    numeric: false,
    disablePadding: true,
    label: 'Phone Number'
  },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'board', numeric: false, disablePadding: false, label: 'Board' },
  { id: 'classname', numeric: false, disablePadding: false, label: 'Class' },
  {
    id: 'schoolname',
    numeric: false,
    disablePadding: false,
    label: 'School name'
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
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

  const classes = useToolbarStyles();

  const createSortHandler = (property: keyof Data) => (
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

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      height: '100%'
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: '1 1 100%'
    },
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  removeItem: () => any;
}

const EnhancedTableToolbar: FunctionComponent<EnhancedTableToolbarProps> = ({
  numSelected,
  removeItem
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const classes = useToolbarStyles();
  //const { numSelected } = props;

  return (
    <Toolbar>
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
                    <IconButton size="small" onClick={() => setSearchText('')}>
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
      {numSelected > 0 ? (
        <Box
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0
          })}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginLeft="auto"
        >
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>

          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={removeItem}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null}
    </Toolbar>
  );
};

interface Props
  extends RouteComponentProps<{}>,
    WithStyles<typeof enrollmentStyles> {
  authUser: User;
}

// interface Props {
//   authUser: User;
// }

const Students: FunctionComponent<Props> = ({ authUser, history, classes }) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [students, setStudents] = useState<Student[]>([]);
  const [list, setList] = useState('student');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        var studentsList: Student[] = [];
        if (isTutor(authUser)) {
          const batchesList = await fetchBatchesList();
          studentsList = await fetchTutorStudentsList();

          // update batches by student mobile number
          batchesList.forEach((batch) => {
            batch.students.forEach((studentId) => {
              studentsList.forEach((student, index) => {
                if (studentId === student._id) {
                  batch.students.splice(index, 1, student.mobileNo);
                }
              });
            });
          });

          setBatches(batchesList);
        } else {
          studentsList = await getOrgStudentsList();
        }
        setStudents(studentsList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [authUser]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const rows = students.map((student) =>
    createData(
      student.studentName,
      student.enrollmentId ? student.enrollmentId : '',
      student.mobileNo,
      student.parentMobileNo,
      student.emailId,
      student.pinCode,
      student.cityName,
      student.stateName,
      student.boardName,
      student.className,
      student.schoolName
    )
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.mobileNo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, mobileNo: string) => {
    const selectedIndex = selected.indexOf(mobileNo);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, mobileNo);
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

  const removeStudents = async () => {
    try {
      const updatedStudents = students.filter(
        (el) => !selected.includes(el.mobileNo.toString())
      );
      if (isTutor(authUser)) {
        await deleteStudents(selected);
      } else {
        await deleteStudentsOfOrganization(selected);
      }
      setStudents(updatedStudents);
      setSelected([]);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (mobileNo: string) => selected.indexOf(mobileNo) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleEditTutor = (row: CurrentStudent) => {
    dispatch(setCurrentStudent(row));
    history.push('/profile/students/edit');
  };
  const handleViewTutor = (row: CurrentStudent) => {
    dispatch(setCurrentStudent(row));
    history.push('/profile/students/view');
  };

  const buttonData = [
    {
      title: 'Edit Details',
      class: classes.sideIcons,
      padClass: classes.zeroPadWhite,
      action: handleEditTutor,
      icon: <EditIcon />
    },
    {
      title: 'View Details',
      class: classes.sideIcons,
      padClass: classes.zeroPadWhite,
      action: handleViewTutor,
      icon: <ViewIcon />
    },
    {
      title: 'Delete Details',
      class: classes.sideIcons,
      padClass: classes.zeroPadWhite,
      action: () => {},
      icon: <DeleteIcon />
    }
  ];

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box bgcolor="white" marginY="20px">
          <Grid container>
            <Grid item xs={12} md={7}>
              <Box padding="20px 30px" display="flex" alignItems="center">
                <img src={PersonWithBook} alt="Person with Book" />

                <Box marginLeft="15px" display="flex" alignItems="center">
                  <Typography component="span" color="secondary">
                    <Box component="h3" className={classes.heading}>
                      All Students
                    </Box>
                  </Typography>

                  <Box marginLeft="10px" display="flex">
                    <Box marginLeft="20px">
                      <Button
                        disableElevation
                        color="primary"
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/profile/students/create`}
                        className={classes.btn}
                      >
                        Add Student
                      </Button>
                    </Box>
                    <Box marginLeft="20px">
                      <Button
                        disableElevation
                        color="primary"
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={
                          isOrganization(authUser)
                            ? `/profile/org/batches/create`
                            : isAdminTutor(authUser)
                            ? `/profile/tutor/batches/create`
                            : ''
                        }
                        className={classes.btn}
                      >
                        Create Batch
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                removeItem={() => removeStudents()}
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" padding="10px 20px">
            <Box
              marginRight="20px"
              className={
                list === 'student' ? classes.selectedList : classes.listItem
              }
              onClick={() => setList('student')}
            >
              List
            </Box>
            <Box
              className={
                list === 'batch' ? classes.selectedList : classes.listItem
              }
              onClick={() => setList('batch')}
            >
              Batch
            </Box>
          </Box>

          <Divider />
          {list === 'student' ? (
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
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.mobileNo);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) =>
                              handleClick(event, row.mobileNo)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.mobileNo}
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
                              {row.mobileNo}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.board}</TableCell>
                            <TableCell>{row.classname}</TableCell>
                            <TableCell>{row.schoolname}</TableCell>
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
                      <TableRow
                        style={{ height: (dense ? 33 : 53) * emptyRows }}
                      >
                        <TableCell colSpan={6} />
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
          ) : (
            <Box
              padding="20px 30px"
              maxHeight="450px"
              display="flex"
              flexWrap="wrap"
              style={{ overflowY: 'auto' }}
            >
              {batches.map((item, index) => (
                <BatchListItem
                  key={index}
                  item={item}
                  editItem={() => {}}
                  removeItem={() => {}}
                  width="500px"
                  marginRight="30px"
                />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  authUser: state.authReducer.authUser as User
});

export default connect(mapStateToProps)(withStyles(enrollmentStyles)(Students));

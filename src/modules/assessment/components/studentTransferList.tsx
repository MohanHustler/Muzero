import React,{FunctionComponent} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import Box from "@material-ui/core/Box"
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {Student} from "../contracts/student_interface"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 200,
      height: 230,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }),
);

function not(a: Student[], b: Student[]) {
  return a.filter((value) => b.findIndex(el=>el._id===value._id) === -1);
}

function intersection(a: Student[], b: Student[]) {
  return a.filter((value) => b.findIndex(el=>el._id===value._id) !== -1);
}

function union(a: Student[], b: Student[]) {
  return [...a, ...not(b, a)];
}

interface Props {
    left : Student[],
    setLeft : React.Dispatch<React.SetStateAction<Student[]>>
    right : Student[],
    setRight : React.Dispatch<React.SetStateAction<Student[]>>
}

export const TransferList : FunctionComponent<Props> = ({left,setLeft,right,setRight}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<Student[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: Student) => () => {
    const currentIndex = checked.findIndex(el=>el._id===value._id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: Student[]) => intersection(checked, items).length;

  const handleToggleAll = (items: Student[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: Student[]) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value: Student) => {
          const labelId = `transfer-list-all-item-${value.studentName}-label`;

          return (
            <ListItem key={value._id} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.findIndex(el=>el._id===value._id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.studentName} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      {(left.length===0 && right.length===0)?<Box></Box>:<React.Fragment>
        <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
        </React.Fragment>
      }
      
    </Grid>
  );
};

export default TransferList
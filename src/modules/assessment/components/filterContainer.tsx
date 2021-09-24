import React, { FunctionComponent, Dispatch } from "react";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    Typography,
  } from "@material-ui/core";
import lodash from "lodash"
import {createStyles, makeStyles,Theme} from "@material-ui/core/styles"
import {Topic} from "../contracts/topics_interface"
import {QuestionBody} from "../contracts/qustions_interface"

const useStyles = makeStyles((theme:Theme)=>
    createStyles({
        listSelected: {
            background: "linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)",
            color: "white",
            borderColor: "linear-gradient(90deg, rgb(6, 88, 224) 2.53%, rgb(66, 133, 244) 100%)",
            borderRadius: "10px"
          },
          listOption: {
            background: "#0000",
            borderColor: "#0000",
            borderRadius: "10px"
          },
    })
)



interface Props {
    complexity : string;
    setComplexity: Dispatch<React.SetStateAction<string>>;
    topics: Topic[]
    currentTopic: number;
    setCurrentTopic: Dispatch<React.SetStateAction<number>>;
    setPage:Dispatch<React.SetStateAction<number>>
  }

const FilterContainer: FunctionComponent<Props> = ({
    complexity,
    setComplexity,
    topics,
    currentTopic,
    setCurrentTopic,
    setPage
  }) => {
      const classes = useStyles()
      return (
        <Grid item xs={4} md={4} sm={3} lg={3}>
        <Paper elevation={3}>
          <Box padding="20px">
            <Typography component="span" color="textPrimary">
              <Box component="h4" fontWeight="500" margin="0" >
                Filters
              </Box>
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel shrink={true}>Complexity</InputLabel>
              <Select
                margin="none"
                required
                value={complexity}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>{
                  setComplexity(e.target.value as string)
                  setPage(0)
                }
                }
                displayEmpty
              > 
              <MenuItem key="universal" value="All">All</MenuItem>
                {
                  topics[currentTopic].questionSet!==undefined && topics[currentTopic].questionSet.map(el=><MenuItem key={el[0]} value={el[0]}>{lodash.startCase(el[0])}</MenuItem>)
                }
              </Select>
            </FormControl>
            <Box marginTop="20px">
              <Box component="h4" fontWeight="300" margin="0">
                Topics
              </Box>
              <List
                component="nav"
              >
                {topics?.map((topic: Topic, i: number) => {
                  return (
                    <Box marginBottom="8px" key={i}>
                      <ListItem
                        disableGutters
                        dense
                        divider
                        selected
                        button
                        classes={{ root: topics?.find((val, index) => index === currentTopic)?.title === topic.title ? classes.listSelected : classes.listOption }}
                        onClick={() => {

                          setCurrentTopic(i)
                          setComplexity(topics[i].questionSet[0][0])
                          setPage(0)
                        }} 
                        key={i}>
                        <Grid container>
                          <Grid item xs={12} sm={11} md={11} lg={11}>
                            <Box margin="5px 10px">

                              <Typography variant="body1">
                                {topic.title}
                              </Typography>

                            </Box>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </Box>
                  )
                })}
              </List>

            </Box>
          </Box>

        </Paper>
      </Grid>
      )
  }

export default FilterContainer
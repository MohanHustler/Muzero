import React, { FunctionComponent, useEffect, useState } from 'react';
import FileDownload from 'js-file-download';
import {
  Box,
  Button as MuButton,
  Container,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import {
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon
} from '@material-ui/icons';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import {
  getStudentChapters,
  fetchStudentContentDownloadUrl,
  downloadFile
} from '../../../common/api/academics';
import { Student } from '../../../common/contracts/user';
import { BatchChapter } from '../../../common/contracts/academic';
import Button from '../../../common/components/form_elements/button';
import Navbar from '../../../common/components/navbar';
import { exceptionTracker } from '../../../common/helpers';
import { Redirect } from 'react-router-dom';

const styles = createStyles({
  boyWavingHard: {
    maxHeight: '145px',
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

interface ChapterBlockProps {
  item: BatchChapter;
}

const ChapterBlock: FunctionComponent<ChapterBlockProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  const downloadContent = async (index: number) => {
    try {
      const content = item.chapter.contents[index];
      const serverBucket = await fetchStudentContentDownloadUrl({
        boardname: item.chapter.boardname,
        chaptername: item.chapter.chaptername,
        classname: item.chapter.classname,
        subjectname: item.chapter.subjectname,
        uuid: content.uuid,
        tutorId: content.ownerId
      });

      const file = await downloadFile(serverBucket.url);
      FileDownload(file, content.contentname);
    } catch (error) {
      exceptionTracker(error.response?.data.message);
      if (error.response?.status === 401) {
        setRedirectTo('/login');
      }
    }
  };

  return (
    <Box bgcolor="white" marginTop="10px" padding="30px">
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Box>
            <Typography variant="subtitle2">
              {item.chapter.subjectname}
            </Typography>
            <Typography variant="subtitle1">
              <Box fontWeight="fontWeightBold">{item.chapter.chaptername}</Box>
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box component="span" marginLeft="10px">
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        bgcolor="#f2d795"
        marginTop="15px"
        style={{ display: isExpanded ? 'block' : 'none' }}
      >
        <Box padding="15px" display="flex" alignItems="center">
          <Box marginLeft="15px">
            <Box>
              {item.chapter.contents.map((content, index) => (
                <Grid>
                  <Box>{content.contentname}</Box>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => downloadContent(index)}
                  >
                    Download
                  </Button>
                </Grid>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface Props extends WithStyles<typeof styles> {
  profile: Student;
}

const StudentNotes: FunctionComponent<Props> = ({ classes, profile }) => {
  //const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState<BatchChapter[]>([]);
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const chapterList = await getStudentChapters();
        setChapters(chapterList);
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        if (error.response?.status === 401) {
          setRedirectTo('/login');
        }
      }
    })();
  }, [profile.mobileNo]);

  if (redirectTo.length > 0) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <div>
      <Navbar />

      <Box marginY="50px">
        <Container>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box paddingX="15px">
                <Typography variant="h6">Notes</Typography>

                <Box display="flex" marginTop="30px">
                  <Box marginRight="10px">
                    <MuButton
                      color="secondary"
                      size="small"
                      // onClick={() => setSubject('')}
                    >
                      All Courses
                    </MuButton>
                  </Box>
                </Box>

                <Box>
                  {chapters.map((item, index) => (
                    <ChapterBlock key={index} item={item} />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default withStyles(styles)(StudentNotes);

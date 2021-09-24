import React, { FunctionComponent, useState } from 'react';
import { Box, FormControl, Grid, Input, Typography } from '@material-ui/core';
import Button from '../../common/components/form_elements/button';
import Modal from '../../common/components/modal';

interface Props {
  openModal: boolean;
  handleClose: () => any;
  handleEditChapter: (chapterName: string) => any;
  chaptername: string;
}

const EditChapterModal: FunctionComponent<Props> = ({
  openModal,
  handleClose,
  handleEditChapter,
  chaptername
}) => {
  const [chapterName, setChapterName] = useState(chaptername);

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    handleEditChapter(chapterName);
    setChapterName('');
  };

  return (
    <Modal
      open={openModal}
      handleClose={() => {
        handleClose();
        setChapterName(chaptername);
      }}
      header={
        <Box display="flex" alignItems="center">
          <Box marginLeft="15px">
            <Typography component="span" color="secondary">
              <Box component="h3" color="white" fontWeight="400" margin="0">
                Edit Chapter
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <form
        onSubmit={(e) => {
          handleFormSubmission(e);
          setChapterName(chapterName);
        }}
      >
        <Grid container>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <Box fontWeight="bold" marginTop="5px">
                Chapter Name
              </Box>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <Input
                placeholder="Enter Chapter Name"
                inputProps={{ maxLength: 50 }}
                onChange={(e) => setChapterName(e.target.value)}
                value={chapterName}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" marginTop="10px">
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            type="submit"
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default EditChapterModal;

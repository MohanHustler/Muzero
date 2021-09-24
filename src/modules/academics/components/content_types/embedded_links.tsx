import React, { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import EditIcon from '../../../../assets/images/edit-shadow.png';
import DeleteIcon from '../../../../assets/images/delete-shadow.png';
import { StackActionType } from '../../../common/enums/stack_action_type';
import { ContentType } from '../../enums/content_type';
import { ChapterContent } from '../../contracts/chapter_content';
import { StackActionItem } from '../../../common/contracts/stack_action';
import { generateEmbedLink } from '../../../common/helpers';
import Button from '../../../common/components/form_elements/button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addBtn: {
      '& button': {
        padding: '8px 16px',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '1px',
        color: '#FFFFFF',
        borderRadius: '5px',

        '& svg': {
          fontSize: '20px',
          marginRight: '5px'
        }
      }
    },

    linkList: {
      background: '#EEF2FD',
      border: '1px solid #ECEEFB',
      borderRadius: '2px',
      padding: '10px 20px',
      fontSize: '16px',
      lineHeight: '19px',
      color: '#5D698D',
      opacity: '0.9',
      marginTop: '6px'
    }
  })
);

interface Props {
  data: ChapterContent[];
  emitStackAction: (action: StackActionItem) => any;
}

interface FormData {
  embedLink: string;
}

const ValidationSchema = yup.object().shape({
  embedLink: yup
    .string()
    .required('embed link is a required field')
    .url('embed link must be a valid URL')
});

export const EmbeddedLinks: FunctionComponent<Props> = ({
  data,
  emitStackAction
}) => {
  const { handleSubmit, register, errors, getValues, setValue } = useForm<
    FormData
  >({
    mode: 'onBlur',
    validationSchema: ValidationSchema
  });

  const classes = useStyles();

  const createEmbedLink = ({ embedLink }: FormData) => {
    const embedLinkIndex = data.findIndex(
      (content) => content.uuid === embedLink
    );

    // We won't add the embed link if the link already exists in the
    // array.
    if (embedLinkIndex !== -1) return;

    emitStackAction({
      type: StackActionType.CREATE,
      payload: {
        data: embedLink,
        type: ContentType.EMBED_LINK
      }
    });

    setValue('embedLink', '');
  };

  const deleteEmbedLink = ({ embedLink }: FormData) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: embedLink,
        type: ContentType.EMBED_LINK
      }
    });
  };

  const updateEmbedLink = ({ embedLink }: FormData) => {
    emitStackAction({
      type: StackActionType.DELETE,
      payload: {
        data: embedLink,
        type: ContentType.EMBED_LINK
      }
    });

    setValue('embedLink', embedLink);
  };

  const embedLinks = data.map((content) => content.uuid);

  const embedLink = getValues('embedLink');

  return (
    <Box>
      <Box
        component="h3"
        fontWeight="500"
        font-size="18.2px"
        line-height="21px"
        color="#666666"
        margin="20px 0"
      >
        Step 2: Embed Link
      </Box>

      <form onSubmit={handleSubmit(createEmbedLink)}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={8}>
            <FormControl fullWidth margin="none">
              <Input
                name="embedLink"
                placeholder="Enter YouTube Video Link"
                inputRef={register}
              />

              {errors.embedLink && (
                <FormHelperText error>
                  {errors.embedLink.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Box className={classes.addBtn}>
              <Button
                disableElevation
                color="primary"
                type="submit"
                size="small"
                variant="contained"
              >
                <AddIcon /> Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {embedLink && embedLink.length > 0 && errors.embedLink === undefined && (
        <Box marginY="20px">
          <iframe
            title="link"
            width="565"
            height="315"
            frameBorder="0"
            src={generateEmbedLink(embedLink)}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        </Box>
      )}

      <Box>
        {embedLinks.map((link) => (
          <Box marginY="10px">
            <Grid key={link} container spacing={2}>
              <Grid item xs={8}>
                <Box className={classes.linkList}>{link}</Box>
              </Grid>

              <Grid item xs={4}>
                <IconButton
                  size="small"
                  onClick={() => updateEmbedLink({ embedLink: link as string })}
                  style={{ marginRight: '5px' }}
                >
                  <img src={EditIcon} alt="Edit Icon" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => deleteEmbedLink({ embedLink: link as string })}
                >
                  <img src={DeleteIcon} alt="Delete Icon" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default EmbeddedLinks;

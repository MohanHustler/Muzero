import React, { FunctionComponent, useEffect, useState } from 'react';
import { Theme, Avatar, IconButton, Grid } from '@material-ui/core';
import {
  updateParent,
  updateStudent,
  updateTutor
} from '../../common/api/profile';
import { updateOrganization } from '../../common/api/organization';
import { User } from '../../common/contracts/user';
import {
  isTutor,
  isStudent,
  isOrganization,
  isParent
} from '../../common/helpers';
import { exceptionTracker } from '../../common/helpers';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { PhotoCamera, Delete, AccountCircle } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import BoyWavingHand from '../../../assets/svgs/boy-waving-hand.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: 'none'
    },

    avatarSmall: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      color: theme.palette.getContrastText(theme.palette.primary.light),
      // backgroundColor: theme.palette.primary.light,
      fontSize: '15px'
    },

    avatar: {
      width: theme.spacing(9.5),
      height: theme.spacing(9.5),
      color: theme.palette.getContrastText(theme.palette.primary.light),
      // backgroundColor: theme.palette.primary.light,
      fontSize: '35px'
    },

    boyWavingHard: {
      maxHeight: '145px',
      position: 'absolute',
      bottom: 0,
      right: 0
    }
  })
);

interface Props {
  profile: User;
  profileUpdated: (user: User) => any;
  name: string;
  size?: string;
}

const ProfileImage: FunctionComponent<Props> = ({
  profile,
  profileUpdated,
  name,
  size
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [avatarChild, setAvatarChild] = useState('');

  if (!name) name = '';
  const nameArr = name.split(' ');
  const nameShort: string[] = [];

  useEffect(() => {
    //To set avatar child
    nameArr.forEach((name) => {
      if (name === nameArr[0] || name === nameArr[nameArr.length - 1])
        nameShort.push(name.charAt(0));
    });
    setAvatarChild(nameShort.join(''));
  }, [nameArr, nameShort]);

  if (name === '' && size === 'small') {
    return <AccountCircle />;
  }

  if (name === '') {
    return (
      <img
        className={classes.boyWavingHard}
        src={BoyWavingHand}
        alt={`Hello`}
      />
    );
  }
  const updateUser = async (user: User) => {
    if (isTutor(user)) {
      profileUpdated(user);
      await updateTutor(user).catch((err) => {
        exceptionTracker(err.response?.data.message);
        enqueueSnackbar(err);
      });
    }

    if (isStudent(user)) {
      profileUpdated(user);
      await updateStudent(user).catch((err) => {
        exceptionTracker(err.response?.data.message);
        enqueueSnackbar(err);
      });
    }

    if (isOrganization(user)) {
      profileUpdated(user);
      await updateOrganization(user).catch((err) => {
        exceptionTracker(err.response?.data.message);
        enqueueSnackbar(err);
      });
    }

    if (isParent(user)) {
      profileUpdated(user);
      await updateParent(user).catch((err) => {
        exceptionTracker(err.response?.data.message);
        enqueueSnackbar(err);
      });
    }
  };

  const onFileChange = (e: any) => {
    if (e.target.files.length) {
      //Restricting image file size
      const fsize = e.target.files[0].size;
      const file = Math.round(fsize / 1024);
      if (file >= 100) {
        enqueueSnackbar('File too Big, please select a file less than 100kb', {
          variant: 'error'
        });
        return;
      }
      const img = new Image();
      img.onload = async () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set width and height
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image
        if (ctx instanceof CanvasRenderingContext2D) {
          ctx.drawImage(img, 0, 0);
        }
        const user = Object.assign({}, profile, {
          image: canvas.toDataURL('image/jpeg', 0.1)
        });
        await updateUser(user);
      };
      img.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const deleteImage = async () => {
    const user = Object.assign({}, profile, { image: '' });
    await updateUser(user);
  };

  if (size === 'small') {
    return (
      <div>
        <Avatar
          // children={avatarChild}
          src={profile.image}
          className={classes.avatarSmall}
        />
      </div>
    );
  }

  return (
    <Grid container justify="center" flex-direction="column">
      <Grid item>
        <Avatar
          // children={avatarChild}
          src={profile.image}
          className={classes.avatar}
        />
      </Grid>
      <input
        className={classes.input}
        type="file"
        accept=".jpg, .jpeg, .png"
        id="upload-button"
        onChange={onFileChange}
      />
      <Grid item container justify="center">
        <label htmlFor="upload-button">
          <IconButton aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>

        <IconButton aria-label="delete picture" onClick={deleteImage}>
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ProfileImage;

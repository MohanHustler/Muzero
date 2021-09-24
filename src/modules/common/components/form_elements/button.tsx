import React, { FunctionComponent } from 'react';
import {
  Button as BaseButton,
  ButtonProps,
  createStyles,
  Theme
} from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const getButtonColor = (
  color: string | undefined,
  variant: string | undefined,
  theme: Theme
) => {
  if (color === 'error') {
    return theme.palette.error.main;
  }

  if (variant !== 'contained') {
    return color;
  }

  switch (color) {
    case 'primary':
      return `${theme.palette.primary.main}`;
    case 'secondary':
      return `${theme.palette.secondary.main}`;
    default:
      return '#00000000';
  }
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: ({ color, variant }: ButtonProps) =>
        getButtonColor(color, variant, theme),
      borderRadius: '4px',
      textTransform: 'capitalize',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '18px',
      letterSpacing: '1.25px',
      padding: '12px 16px'
    }
  });

interface Props
  extends WithStyles<typeof styles>,
    Omit<ButtonProps, 'classes'> {
  component?: React.ReactNode;
  to?: string;
}

const Button: FunctionComponent<Props> = ({ classes, ...props }) => {
  return (
    <BaseButton {...props} className={`${classes.root} ${props.className}`} />
  );
};

export default withStyles(styles)(Button);

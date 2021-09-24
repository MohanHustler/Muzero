import React, { FunctionComponent } from 'react';
import { Tooltip as TooltipBase, TooltipProps } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tooltipArrow: {
      color: theme.palette.common.black,
    },

    tooltip: {
      backgroundColor: theme.palette.common.black,
      fontSize: '14px',
    },
  })
);

const Tooltip: FunctionComponent<TooltipProps> = ({
  children,
  arrow = true,
  placement = 'left',
  ...props
}) => {
  const classes = useStyles();

  return (
    <TooltipBase
      {...props}
      arrow={arrow}
      placement={placement}
      classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
      }}
    >
      {children}
    </TooltipBase>
  );
};

export default Tooltip;

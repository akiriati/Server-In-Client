import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function LinearProgressWithLabel(props) {

  if (props.tasksToDo == props.tasksDone || props.tasksToDo == 0)
    return (<div></div>); 

  const precantage = (props.tasksDone*100)/(props.tasksToDo + props.tasksDone)

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={5}>
        <LinearProgress variant="determinate" {...props} value={precantage} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          precantage
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

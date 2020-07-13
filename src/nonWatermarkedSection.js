import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffButton from '@material-ui/icons/HighlightOff';



const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
});

class NonWatermarkedSection extends React.Component {

  constructor(props){
    super(props)
  }

  render() { 
    const { classes } = this.props;
    return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={7}>
        {this.props.withoutWatermark.map((picId) => (
          <GridListTile key={picId}>
            <img src={"/files" + picId} alt={"/files" + picId}></img>
            <GridListTileBar
              title={picId.replace("/withoutWatermark/", "")}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <IconButton>
                  <HighlightOffButton className={classes.title} />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div> 
  )
}
}

export default withStyles(useStyles)(NonWatermarkedSection)

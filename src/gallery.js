import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffButton from '@material-ui/icons/HighlightOff';
import GetAppIcon from '@material-ui/icons/GetApp';
import Link from '@material-ui/core/Link';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
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

class Gallery extends React.Component {

  constructor(props){
    super(props)
  }

  render() { 
    const { classes } = this.props;
    const imagePath = (picId) => "/files" + picId
    return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={Math.min(this.props.picsIds.length,7)}>
        {this.props.picsIds.map((picId) => (
          <GridListTile key={picId}>
            <img src={imagePath(picId)} alt={imagePath(picId)}></img>
            <GridListTileBar
              title={picId.replace(this.props.path, "")}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <div>
                  <IconButton>
                    <HighlightOffButton className={classes.title} />
                  </IconButton>
                  <IconButton>
                  <Link href={imagePath(picId)} download={picId} target="_blank">
                    <GetAppIcon className={classes.title} >                      
                    </GetAppIcon>
                  </Link>
                  </IconButton>
                </div>
              }
              
            />
          </GridListTile>
        ))}
      </GridList>
    </div> 
  )
}
}

export default withStyles(useStyles)(Gallery)

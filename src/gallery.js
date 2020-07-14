import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffButton from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 800,
        height: 800,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

export default function Gallery(props) {
    const classes = useStyles();
    const imagePath = (picId) => "/files" + picId

    return (
        <div className={classes.root}>
            <GridList cellHeight={250} className={classes.gridList}>
                {props.picsIds.map((picId) => (
                    <GridListTile key={picId}>
                        <img src={imagePath(picId)} alt={picId} />
                        <GridListTileBar
                            title={picId.replace(props.path, "")}
                            actionIcon={
                                <IconButton onClick={(e) => props.handleDeleteFile("/files" + picId)}>
                                    <HighlightOffButton className={classes.title} />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
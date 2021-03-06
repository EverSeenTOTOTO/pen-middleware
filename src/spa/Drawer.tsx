import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Folder, TextFields } from '@material-ui/icons';

import { PenDirInfo } from './common';

const useStyles = makeStyles({
  drawerPaper: {
    width: 320,
  },
});

type DrawerProps = {
  open: boolean,
  toggleDrawer: (value?: boolean)=> (e: React.KeyboardEvent | React.MouseEvent) => void,
  files: PenDirInfo[],
  onClick: (info: PenDirInfo) => void
};

const Drawer = ({
  open, toggleDrawer, files, onClick,
}: DrawerProps) => {
  const classes = useStyles();

  const items = files.map((each: PenDirInfo) => {
    const currentItemClassName = each.current ? 'list-item--current' : '';

    return (
      <ListItem
        className={`list-item ripple ${currentItemClassName}`}
        onClick={() => onClick(each)}
      >
        <ListItemAvatar>
          <Avatar>
            { each.type === 'markdown' ? <TextFields /> : <Folder />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={each.filename} />
      </ListItem>
    );
  });

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {items}
      </List>
    </SwipeableDrawer>
  );
};

export default Drawer;

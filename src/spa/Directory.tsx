/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import { Folder, TextFields } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Socket } from 'socket.io-client';

export type PenInfo = {
  filename: string,
  relative: string,
  type: 'dir' | 'markdown'
};

const useStyles = makeStyles({
  root: {
    height: '100%',
    overflowY: 'scroll',
  },
});

const Directory = ({ dirs, socket }: { dirs: PenInfo[], socket: Socket }) => {
  const [current, setCurrent] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stack, setStack] = useState<PenInfo[]>([{ relative: '', filename: '', type: 'dir' }]);
  const classes = useStyles();

  const onClick = useCallback(
    (info: PenInfo) => {
      if (info.type === 'markdown') {
        window.history.pushState(info, info.filename, '');
        setStack((stk) => [...stk, info]);
      }

      socket.emit('peninit', info.relative);
      setCurrent(info.relative);
    },
    [socket],
  );

  useEffect(() => {
    const onPopState = () => {
      let last: PenInfo|undefined;

      setStack((stk) => {
        stk.pop();
        last = stk.pop();
        console.log(last, stk);
        return [...stk];
      });

      if (last) {
        onClick(last);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [onClick]);

  const items = dirs.map((each: PenInfo) => {
    const currentItemClassName = current && current === each.relative ? 'list-item--current' : '';

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
    <List
      classes={{
        root: classes.root,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {items}
    </List>
  );
};

export default Directory;

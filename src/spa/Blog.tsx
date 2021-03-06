/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { io } from 'socket.io-client';
import mermaid from 'mermaid';

import Markdown from './Markdown';
import Drawer from './Drawer';
import BottomNavigation from './BottomNavigation';
import BreadCrumbRoutes from './Breadcrumbs';
import {
  reducer, initialState, PenEvents, PenDirInfo,
} from './common';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  markdown: {
    flexGrow: 1,
  },
}));

const initMermaid = () => {
  requestAnimationFrame(() => {
    mermaid.initialize({
      // startOnLoad: true,
      theme: 'default',
      gantt: {
        axisFormatter: [
          ['%Y-%m-%d', (d) => {
            return d.getDay() === 1;
          }],
        ],
      },
    });
    mermaid.init();
  });
};

const Blog = () => {
  const classes = useStyles();
  const [state, dispatch] = React.useReducer<typeof reducer>(reducer, initialState);
  const {
    files, content, socket,
  } = state;
  const [stack, setStack] = React.useState<PenDirInfo[]>([]);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (value?: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event
      && event.type === 'keydown'
      && ((event as React.KeyboardEvent).key === 'Tab'
        || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    if (typeof value === 'boolean') {
      setOpen(value);
    } else {
      setOpen((op) => !op);
    }
  };

  const onClick = React.useCallback(
    (info: PenDirInfo) => {
      if (info.current || !socket) return;
      window.history.pushState(info, info.filename, '');
      socket.emit('peninit', info.relative);
      setStack((stk) => [...stk, info]);
    },
    [socket],
  );

  React.useEffect(() => {
    // init with root
    onClick({
      relative: './', filename: '', type: 'dir', current: false,
    });
  }, [onClick]);

  React.useEffect(() => {
    const sock = io(`${location.origin}${location.pathname}`, {
      path: '/pensocket.io',
    });

    sock.on(PenEvents.UpdateData, (data) => {
      dispatch({
        type: PenEvents.UpdateData,
        payload: JSON.parse(data),
      });
      initMermaid();
    });

    sock.on(PenEvents.ErrorOccured, (data) => {
      dispatch({
        type: PenEvents.ErrorOccured,
        payload: JSON.parse(data),
      });
    });

    dispatch({
      type: PenEvents.CreateSocket,
      payload: sock,
    });

    return () => {
      sock.close();
    };
  }, []);

  React.useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (e.state !== null) {
        let last: PenDirInfo|undefined;

        setStack((stk) => {
          stk.pop();
          last = stk.pop();
          return stk;
        });

        if (last) {
          onClick(last);
        }
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [onClick]);

  return (
    <div className={classes.root}>
      <Drawer open={open} toggleDrawer={toggleDrawer} onClick={onClick} files={files} />
      <main className={classes.markdown}>
        <BreadCrumbRoutes onClick={onClick} files={files} stack={stack} />
        <Markdown html={content} />
      </main>
      <BottomNavigation
        toggleMenu={toggleDrawer}
        backHome={() => {
          onClick({
            relative: './', filename: '', type: 'dir', current: false,
          });
        }}
      />
    </div>
  );
};

export default Blog;

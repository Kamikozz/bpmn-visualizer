import React, { useState, useRef, useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import { selectBPRelations } from '../../store/bpRelations/bpRelationsSlice';

interface RoleAction  {
  id: string;
  actionId: string;
  actionName: string;
};
interface PhoneSimulatorProps {
  roleName: string;
  roleActions: Array<RoleAction>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    colorPrimary: {
      color: '#333333',
      backgroundColor: '',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
    },
    listItem: {
      border: '1px solid black',
    }
  }),
);

export default function PhoneSimulator({ roleName, roleActions }: PhoneSimulatorProps) {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const bpRelations = useAppSelector(selectBPRelations);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">
            Sales App ({roleName})
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {
          roleActions.map(({ id, actionName }) => (
            <ListItem key={id} className={classes.listItem} button>
              <ListItemText primary={actionName} />
            </ListItem>
          ))
        }
      </List>
    </div>
  );
}

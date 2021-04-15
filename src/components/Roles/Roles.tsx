import React, { FormEvent, Fragment, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { addRole, selectRoles, Role } from '../../features/roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    list: {
      overflow: 'auto',
    },
    // root: {
    //   '& .MuiTextField-root': {
    //     margin: theme.spacing(1),
    //     width: '25ch',
    //   },
    // },
  }),
);

export default function Roles() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const dispatch = useAppDispatch();

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const { elements } = event.target as HTMLFormElement;
    const { inputField }: any = elements;
    const { value } = inputField;
    dispatch(addRole(value));
  };

  return (
    <div className={classes.root}>
      <form noValidate autoComplete="off" onSubmit={handleAdd}>
        <TextField name="inputField" label="Новая роль" type="search" variant="outlined" fullWidth />
      </form>
      <List className={classes.list}>
        {Object.entries(roles).map(([ id, { name }]: [string, Role]) => {
          return (
            <ListItem key={id} dense button divider>
              <ListItemText primary={name} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

import React, { FormEvent, Fragment, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addMessage, removeMessage, selectMessages, Message } from '../../features/messages/messagesSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    form: {
      display: 'flex',
    },
    addButton: {
      marginLeft: theme.spacing(1),
    },
    iconButton: {
      padding: 10,
    },
    list: {
      marginTop: theme.spacing(1),
      overflow: 'auto',
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default function Messages() {
  const classes = useStyles();
  const messages = useAppSelector(selectMessages);
  const dispatch = useAppDispatch();

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const { elements } = event.target as HTMLFormElement;
    const { inputField }: any = elements;
    const trimmedValue = (inputField as HTMLInputElement).value.trim();
    if (trimmedValue.length) {
      inputField.value = '';
      dispatch(addMessage(trimmedValue));
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleAdd}>
        <TextField name="inputField" label="Новое сообщение" type="search" variant="outlined" fullWidth />
        <Button
          className={classes.addButton}
          type="submit"
          variant="contained"
          color="primary"
        >
          <AddIcon />
        </Button>
      </form>
      <List className={classes.list}>
        {Object.entries(messages).map(([ id, { message }]: [string, Message]) => {
          const handleRemove = () => dispatch(removeMessage(id));
          return (
            <ListItem key={id} dense divider>
              <ListItemText primary={message} />
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton color="primary" size="small" aria-label="remove" onClick={handleRemove}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
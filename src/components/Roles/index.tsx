import { FormEvent, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  TextField, List, ListItem, ListItemText, Button, IconButton, Divider,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addRole, removeRole, selectRoles, Role } from '../../store/roles/rolesSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    form: {
      display: 'flex',
    },
    addButton: {
      marginLeft: theme.spacing(1),
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

export default function Roles() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState('');

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.length) {
      setInputValue('');
      dispatch(addRole(inputValue.trim()));
    }
  };

  const handleChange = (event: any) => {
    const value: string = event.target.value;
    setInputValue(value);
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleAdd}>
        <TextField
          value={inputValue}
          label="Новая роль"
          type="search"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
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
        {Object.entries(roles).map(([ id, { name }]: [string, Role]) => {
          const handleRemove = () => dispatch(removeRole(id));
          return (
            <ListItem key={id} dense divider>
              <ListItemText primary={name} />
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

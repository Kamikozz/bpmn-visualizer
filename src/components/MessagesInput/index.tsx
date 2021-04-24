import { FormEvent, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { useAppDispatch } from '../../store/hooks';
import {
  initNewDocument,
} from '../../store/roleActionMap/roleActionMapSlice';

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
  }),
);

export default function MessagesInput() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState('');

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.length) {
      setInputValue('');
      dispatch(initNewDocument(inputValue.trim()));
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
          label="Новое сообщение"
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
    </div>
  );
}

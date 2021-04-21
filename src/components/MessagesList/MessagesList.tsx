import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeMessage, selectMessages, Message } from '../../store/messages/messagesSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
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

export default function MessagesList() {
  const classes = useStyles();
  const messages = useAppSelector(selectMessages);
  const dispatch = useAppDispatch();

  return (
    <div className={classes.root}>
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

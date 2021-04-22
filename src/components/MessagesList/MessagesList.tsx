import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  List, ListItem, ListItemText, IconButton, Divider,
  Grow, // animations
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

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

export default function MessagesList({ onClick }: {
  onClick: any
}) {
  const classes = useStyles();
  const messages = useAppSelector(selectMessages);
  const dispatch = useAppDispatch();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          Object
            .entries(messages)
            .map(([ id, message]: [string, Message], index) => {
            const handleRemove = () => dispatch(removeMessage(id));
            const handleSelected = () => {
              onClick(message);
            };
            return (
              <Grow key={id} in timeout={250 * (index + 1)}>
                <ListItem dense divider button onClick={handleSelected}>
                  <ListItemText primary={message.message} />
                  <Divider className={classes.divider} orientation="vertical" />
                  <IconButton color="primary" size="small" aria-label="remove" onClick={handleRemove}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItem>
              </Grow>
            );
          })
        }
      </List>
    </div>
  );
}

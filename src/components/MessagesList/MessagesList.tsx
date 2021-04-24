import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  List, ListItem, ListItemText, IconButton, Divider,
  Grow, // animations
} from '@material-ui/core';
// import { Delete as DeleteIcon } from '@material-ui/icons';

// import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  DocumentWithMessages
} from '../../store/roleActionMap/roleActionMapSlice';

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

export default function MessagesList({ items, onSelected }: {
  items: Array<DocumentWithMessages>;
  onSelected: any;
}) {
  const classes = useStyles();
  // const dispatch = useAppDispatch();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {
          items
            .map((document, index) => {
            // const handleRemove = () => dispatch(removeMessage(id));
            const handleSelected = () => {
              onSelected(document);
            };
            const incrementedIndex = index + 1;
            const animationTimeout = 250 * incrementedIndex;
            return (
              <Grow key={document.id} in timeout={animationTimeout}>
                <ListItem divider button onClick={handleSelected}>
                  <ListItemText primary={`Документ ${incrementedIndex}`} />
                  {/* <Divider className={classes.divider} orientation="vertical" />
                  <IconButton color="primary" size="small" aria-label="remove" onClick={handleRemove}>
                    <DeleteIcon color="error" />
                  </IconButton> */}
                </ListItem>
              </Grow>
            );
          })
        }
      </List>
    </div>
  );
}

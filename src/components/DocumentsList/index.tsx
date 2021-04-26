import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  List, ListItem, Breadcrumbs, Typography,
  Grow, // animations
} from '@material-ui/core';
import {
  DocumentWithMessages
} from '../../store/configs/configsSlice';

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

export default function DocumentsList({ items, onSelected }: {
  items: Array<DocumentWithMessages>;
  onSelected: any;
}) {
  const classes = useStyles();

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
                  {/* <ListItemText primary={`Документ ${incrementedIndex}`} /> */}
                  {/* <Divider className={classes.divider} orientation="vertical" />
                  <IconButton color="primary" size="small" aria-label="remove" onClick={handleRemove}>
                    <DeleteIcon color="error" />
                  </IconButton> */}
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    {
                      Object
                        .values(document.statements)
                        .map(({ id, message }) => {
                          const { text } = message;
                          return (<Typography key={id} color="textPrimary">{text}</Typography>);
                      })
                    }
                  </Breadcrumbs>
                </ListItem>
              </Grow>
            );
          })
        }
      </List>
    </div>
  );
}

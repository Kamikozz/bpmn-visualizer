import { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, List, ListItem, ListItemText, Badge, IconButton, TextField, Button,
  Grow, Zoom, Slide, Collapse, // animations
} from '@material-ui/core';
import {
  ArrowBack as BackIcon,
  Send as SendIcon,
} from '@material-ui/icons';

import MessagesList from '../MessagesList/MessagesList';

// import { useAppSelector } from '../../store/hooks';
// import { selectRoles } from '../../store/roles/rolesSlice';
// import { selectActions } from '../../store/actions/actionsSlice';
// import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import { Message } from '../../store/messages/messagesSlice';

interface RoleAction  {
  id: string;
  actionId: string;
  actionName: string;
  messages: number | null;
};
interface PhoneSimulatorProps {
  roleName: string;
  roleActions: Array<RoleAction>;
};

enum Pages {
  MAIN,
  MESSAGES,
  FORM,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    toolbar: {
      overflow: 'hidden',
    },
    title: {
      margin: '0 auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      overflow: 'auto',
    },
    formFieldset: {
      height: '100%',
      padding: 0,
      overflow: 'auto',
      border: 'none',
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    formReadonlyTextfield: {
      resize: 'vertical',
    },
    formSendResponse: {
    },
    listItem: {
      border: '1px solid black',
    },
    badge: {
      zIndex: 0,
    },
  }),
);

export default function PhoneSimulator({ roleName, roleActions }: PhoneSimulatorProps) {
  const classes = useStyles();
  // const roles = useAppSelector(selectRoles);
  // const actions = useAppSelector(selectActions);
  // const roleActionMap = useAppSelector(selectRoleActionMap);
  // const bpRelations = useAppSelector(selectBPRelations);

  const [page, setPage] = useState(Pages.MAIN);
  const [selectedMessage, setSelectedMessage]: [Message | undefined, any] = useState();
  const [responseOnMessage, setResponseOnMessage] = useState('');

  const showBackButton = page !== Pages.MAIN;

  const handleOpenMessages = () => {
    setPage(Pages.MESSAGES);
  };
  const handleBackButton = () => {
    if (page === Pages.FORM) {
      setPage(Pages.MESSAGES);
    } else if (page === Pages.MESSAGES) {
      setPage(Pages.MAIN);
    }
  };
  const handleOpenForm = (selected: Message) => {
    console.log(selected);
    setSelectedMessage(selected);
    setPage(Pages.FORM);
  };

  const renderCurrentPage = () => {
    switch (page) {
      case Pages.MESSAGES:
        return (
          <MessagesList onClick={handleOpenForm} />
        );
      case Pages.FORM: {
        const handleChange = (event: any) => {
          const value: string = event.target.value;
          setResponseOnMessage(value);
        };
        return (
          <form className={classes.form}>
            <fieldset className={classes.formFieldset}>
              <TextField
                className={classes.margin}
                inputProps={{ className: classes.formReadonlyTextfield }}
                label="Заказ"
                multiline
                rows={4}
                defaultValue={selectedMessage?.message}
                variant="outlined"
                fullWidth
                disabled
              />
              <TextField
                className={classes.margin}
                inputProps={{ className: classes.formReadonlyTextfield }}
                label="Ответ заказчику"
                multiline
                rows={4}
                value={responseOnMessage}
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </fieldset>
            <Button
              className={[classes.formSendResponse, classes.margin].join(' ')}
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
            >
              Отправить
            </Button>
          </form>
        );
      }
      case Pages.MAIN:
      default:
        return (
          <List>
            {
              roleActions.map(({ id, actionName, messages }, index) => {
                return (
                  <Grow key={id} in timeout={250 * (index + 1)}>
                    <ListItem
                      className={classes.listItem}
                      button
                      onClick={handleOpenMessages}
                    >
                      <ListItemText primary={actionName} />
                      {
                        messages !== null  && (
                          <Badge
                            className={classes.badge}
                            badgeContent={messages}
                            color="primary"
                          />
                        )
                      }
                    </ListItem>
                  </Grow>
                );
              })
            }
          </List>
        );
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          {
            <Slide direction="right" in={showBackButton} mountOnEnter unmountOnExit>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="back"
                onClick={handleBackButton}
              >
                <BackIcon />
              </IconButton>
            </Slide>
          }
          <Typography className={classes.title} variant="h6">
            Sales App ({roleName})
          </Typography>
        </Toolbar>
      </AppBar>
      {
        renderCurrentPage()
      }
    </div>
  );
}

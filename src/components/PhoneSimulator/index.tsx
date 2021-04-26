import { useState, FormEvent } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, List, ListItem, ListItemText, Badge, IconButton, TextField, Button,
  Grow, Zoom, Slide, Collapse, // animations
} from '@material-ui/core';
import {
  ArrowBack as BackIcon,
  Send as SendIcon,
} from '@material-ui/icons';

import DocumentsList from '../DocumentsList';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActions } from '../../store/actions/actionsSlice';
import {
  addNewStatementToDocumentAndMoveDocumentNext,
  selectConfig,
  DocumentWithMessages,
} from '../../store/configs/configsSlice';

interface RoleAction  {
  id: string;
  actionId: string;
  actionName: string;
  documentsCount: number;
};
interface PhoneSimulatorProps {
  roleName: string;
  roleActions: Array<RoleAction>;
};

enum Pages {
  MAIN,
  DOCUMENTS,
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
    formTextfield: {
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
  const actions = useAppSelector(selectActions);
  const { roleActionMap } = useAppSelector(selectConfig)!;
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(Pages.MAIN);
  const [
    selectedRoleActionRelationId, setSelectedRoleActionRelationId,
  ]: [string | undefined, any] = useState();
  const [
    selectedDocument, setSelectedDocument,
  ]: [DocumentWithMessages | undefined, any] = useState();
  const [responseMessage, setResponseMessage] = useState('');

  const showBackButton = page !== Pages.MAIN;

  const handleOpenDocuments = (selectedRoleActionRelationId: string) => {
    setSelectedRoleActionRelationId(selectedRoleActionRelationId);
    setPage(Pages.DOCUMENTS);
  };
  const handleBackButton = () => {
    if (page === Pages.FORM) {
      setPage(Pages.DOCUMENTS);
    } else if (page === Pages.DOCUMENTS) {
      setPage(Pages.MAIN);
    }
  };
  const handleOpenForm = (selected: DocumentWithMessages) => {
    setSelectedDocument(selected);
    setPage(Pages.FORM);
  };

  const renderCurrentPage = () => {
    switch (page) {
      case Pages.DOCUMENTS: {
        const documents = roleActionMap[selectedRoleActionRelationId!].documents;
        const hasDocuments = Boolean(documents.length);
        if (!hasDocuments) handleBackButton();
        return (
          <DocumentsList items={documents} onSelected={handleOpenForm} />
        );
      }
      case Pages.FORM: {
        const handleChange = (event: any) => {
          const value: string = event.target.value;
          setResponseMessage(value);
        };
        const handleSubmit = (event: FormEvent) => {
          event.preventDefault();
          if (responseMessage.length) {
            setResponseMessage('');
            handleBackButton();
            dispatch(addNewStatementToDocumentAndMoveDocumentNext(
              responseMessage.trim(),
              selectedRoleActionRelationId!,
              selectedDocument!,
            ));
          }
        };
        const currentActionId = roleActionMap[selectedRoleActionRelationId!].actionId;
        const responseFieldLabel = actions[currentActionId].formFieldName;
        const { statements } = selectedDocument!;
        const statementsArray = Object.values(statements);
        return (
          <form className={classes.form} onSubmit={handleSubmit}>
            <fieldset className={classes.formFieldset}>
              {
                statementsArray
                  .map(({ id, message, roleActionRelationId }) => {
                    const roleActionRelation = roleActionMap[roleActionRelationId];
                    let fieldLabel = 'Заказ';
                    if (roleActionRelation) {
                      const { actionId } = roleActionRelation;
                      fieldLabel = actions[actionId].formFieldName;
                    }
                    return (
                      <TextField
                        key={id}
                        className={classes.margin}
                        inputProps={{ className: classes.formTextfield }}
                        label={fieldLabel}
                        multiline
                        rows={4}
                        defaultValue={message.text}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    );
                  })
              }
              <TextField
                className={classes.margin}
                inputProps={{ className: classes.formTextfield }}
                label={responseFieldLabel}
                multiline
                rows={4}
                value={responseMessage}
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
              disabled={!Boolean(responseMessage.length)}
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
              roleActions.map(({ id, actionName, documentsCount }, index) => {
                const handleSelectRoleActionItem = () => {
                  handleOpenDocuments(id);
                };
                return (
                  <Grow key={id} in timeout={250 * (index + 1)}>
                    <ListItem
                      className={classes.listItem}
                      button
                      onClick={handleSelectRoleActionItem}
                    >
                      <ListItemText primary={actionName} />
                        <Badge
                          className={classes.badge}
                          badgeContent={documentsCount}
                          color="primary"
                        />
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

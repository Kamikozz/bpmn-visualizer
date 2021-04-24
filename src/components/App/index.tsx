import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, Fab } from '@material-ui/core';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import { selectStartBPRelation } from '../../store/bpRelations/bpRelationsSlice';

import Roles from '../Roles';
import RoleActionMapper from '../RoleActionMapper';
import RelationsCreator from '../RelationsCreator';
import Graph from '../Graph';
import PhoneSimulator from '../PhoneSimulator';
import MessagesInput from '../MessagesInput';

import styles from './App.module.css';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  mainGrid: {
  },
  separateScreen: {
  },
  paper: {
    padding: theme.spacing(2),
    height: 240,
  },
  paperMessagesInput: {
    padding: theme.spacing(2),
  },
  paperGraph: {
    padding: theme.spacing(2),
  },
  paperSimulator: {
    padding: theme.spacing(2),
    height: 600,
  },
  fab: {
    position: 'fixed',
    right: 30,
    bottom: 15,
  },
}));

function App() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const bpEntryNodeId = useAppSelector(selectStartBPRelation);

  const roleActionMapEntries = Object.values(roleActionMap);

  const rolesWithActionsMap: Record<string, boolean> = roleActionMapEntries
    .reduce((accumulator: Record<string, boolean>, { roleId }) => {
      accumulator[roleId] = true;
      return accumulator;
  }, {});

  const hasAnyRole = Boolean(Object.keys(roles).length);
  const hasAnyRoleActionPair = Boolean(roleActionMapEntries.length);

  const [isGenerated, setIsGenerated] = useState(false);
  const hasEntryNodeFound = Boolean(bpEntryNodeId);
  const phonesVisible = isGenerated && hasEntryNodeFound;

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  return (
    <div className={styles.root}>
      <main className={styles.content}>
        <Container className={classes.container} maxWidth={false}>
          <Grid className={classes.mainGrid} container direction="column" spacing={3}>
            <Grid className={classes.separateScreen} item container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.paper}>
                  <Roles />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.paper}>
                  <RoleActionMapper />
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                  <RelationsCreator />
                </Paper>
              </Grid>

              {
                hasAnyRole && hasAnyRoleActionPair && (
                  <Grid item xs={12}>
                    <Paper className={classes.paperGraph}>
                      <Graph />
                    </Paper>
                  </Grid>
                )
              }
              {
                phonesVisible && (
                  <Grid item xs={12}>
                    <Paper className={classes.paperMessagesInput}>
                      <MessagesInput />
                    </Paper>
                  </Grid>
                )
              }
            </Grid>

            {
              phonesVisible && (
                <Grid item container spacing={3}>
                  {
                    Object
                      .entries(roles)
                      .map(([roleId, { name }]) => {
                        const roleHasActions = rolesWithActionsMap[roleId];
                        if (!roleHasActions) return undefined;

                        const currentRoleActions = roleActionMapEntries
                          .filter(({ roleId: innerRoleId }) => innerRoleId === roleId)
                          .map(({ id: roleActionRelationId, actionId, documents }) => {
                            const { name: actionName } = actions[actionId];
                            return {
                              id: roleActionRelationId,
                              actionId,
                              actionName,
                              documentsCount: documents.length,
                            };
                          });
                        return (
                          <Grid key={roleId} item xs={12} sm={6}>
                            <Paper className={classes.paperSimulator}>
                              <PhoneSimulator roleName={name} roleActions={currentRoleActions} />
                            </Paper>
                          </Grid>
                        );
                    })
                  }
                </Grid>
              )
            }
          </Grid>

          <Fab
            className={classes.fab}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="generate"
            disabled={!hasEntryNodeFound}
            onClick={handleGenerate}
          >
            Сгенерировать
          </Fab>
        </Container>
      </main>
    </div>
  );
}

export default App;

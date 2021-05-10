import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, Fab, AppBar, Tabs, Tab } from '@material-ui/core';
import {
  Settings as SettingsIcon,
  DesktopWindows as WindowsIcon,
} from '@material-ui/icons';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import { selectStartBPRelation } from '../../store/bpRelations/bpRelationsSlice';
import { addConfig, selectConfig } from '../../store/configs/configsSlice';

import Roles from '../Roles';
import RoleActionMapper from '../RoleActionMapper';
import RelationsCreator from '../RelationsCreator';
import Graph from '../Graph';
import PhoneSimulator from '../PhoneSimulator';
import MessagesInput from '../MessagesInput';

const useStyles = makeStyles((theme) => {
  const appBarHeight = '72px';
  return {
    root: {},
    appBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: theme.spacing(3),
    },
    tabIndicator: {
      display: 'flex',
      '& > span': {
        backgroundColor: 'white',
        width: '100%',
      },
    },
    tab: {
      height: appBarHeight,
      '& > .MuiTab-wrapper': {
        flexDirection: 'row',
      },
    },
    tabIcon: {
      marginRight: '10px',
    },
    content: {
      display: 'flex',
      flexGrow: 1,
      marginTop: appBarHeight,
      height: `calc(100vh - ${appBarHeight})`,
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
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
      // position: 'fixed',
      // top: 15,
      // right: 30,
      // zIndex: 1200,
    },
  };
});

function App() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const bpEntryNodeId = useAppSelector(selectStartBPRelation);

  const config = useAppSelector(selectConfig);

  const dispatch = useAppDispatch();

  const roleActionMapEntries = Object.values(roleActionMap);

  const configRoleActionMapEntries = config ? Object.values(config.roleActionMap) : [];
  const configRolesWithActionsMap: Record<string, boolean> = configRoleActionMapEntries
    .reduce((accumulator: Record<string, boolean>, { roleId }) => {
      accumulator[roleId] = true;
      return accumulator;
  }, {});

  const hasAnyRole = Boolean(Object.keys(roles).length);
  const hasAnyRoleActionPair = Boolean(roleActionMapEntries.length);

  const hasEntryNodeFound = Boolean(bpEntryNodeId);

  const [screen, setScreen] = useState(0);
  const [, setGraphDirty] = useState({}); // workaround to trigger Graph's render

  // This is workaround of refs rendering the last state of the DOM elements
  const handleDirtyGraph = () => {
    setTimeout(() => setGraphDirty({}), 0);
  };

  const handleGenerate = () => {
    dispatch(addConfig());
    setScreen(1);
  };

  const handleSwitchScreens = (event: any, screenIndex: number) => {
    if (screenIndex === screen) return;
    if (!screenIndex) handleDirtyGraph(); // if goes back to the first main screen -> render relations
    setScreen(screenIndex);
  };

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Tabs value={screen} TabIndicatorProps={{
          className: classes.tabIndicator,
          children: <span />
        }} aria-label="tabs" onChange={handleSwitchScreens}>
          <Tab
            className={classes.tab}
            icon={<SettingsIcon className={classes.tabIcon} />}
            label="Конфиги"
          />
          <Tab
            className={classes.tab}
            icon={<WindowsIcon className={classes.tabIcon} />}
            label="Симуляция"
            disabled={!config}
          />
        </Tabs>
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
      </AppBar>
      <main className={classes.content}>
        <Container className={classes.container} maxWidth={false}>
          <Grid container direction="column" spacing={3}>
            {
              !Boolean(screen) && (
                <Grid item container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className={classes.paper}>
                      <Roles />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Paper className={classes.paper}>
                      <RoleActionMapper onChange={handleDirtyGraph} />
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
                </Grid>
              )
            }
            {
              Boolean(screen) && config && (
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Paper className={classes.paperMessagesInput}>
                      <MessagesInput />
                    </Paper>
                  </Grid>
                  {
                    Object
                      .entries(config.roles)
                      .map(([roleId, { name }]) => {
                        const roleHasActions = configRolesWithActionsMap[roleId];
                        if (!roleHasActions) return undefined;

                        const currentRoleActions = configRoleActionMapEntries
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
        </Container>
      </main>
    </div>
  );
}

export default App;

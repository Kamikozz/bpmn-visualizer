import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRoles } from '../../features/roles/rolesSlice';
// import { selectActions } from '../../features/actions/actionsSlice';
// import { selectRoleActionMap } from '../../features/roleActionMap/roleActionMapSlice';
// import { selectBPRelations } from '../../features/bpRelations/bpRelationsSlice';

import logo from '../../assets/logo.svg';
import Counter from '../Counter/Counter';
import Swag from '../Swag/Swag';
import Roles from '../Roles/Roles';
import RoleActionMapper from '../RoleActionMapper/RoleActionMapper';
import RelationsCreator from '../RelationsCreator/RelationsCreator';
import Graph from '../Graph/Graph';

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
  paperGraph: {
    padding: theme.spacing(2),
    minHeight: 240,
  },
  paperSimulator: {
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

  const [phonesVisible, setPhonesVisible] = useState(false);

  const handleClick = () => {
    setPhonesVisible(true);
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

              <Grid item xs={12}>
                <Paper className={classes.paperGraph}>
                  <Graph />
                </Paper>
              </Grid>
            </Grid>

            {
              phonesVisible && (
                <Grid item container spacing={3}>
                  {
                    Object.entries(roles).map(([roleId, { name }]) => {
                      return (
                        <Grid key={roleId} item xs={6}>
                          <Paper className={classes.paperSimulator}>
                            <div>{name}</div>
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
            onClick={handleClick}
          >
            Сгенерировать
          </Fab>
        </Container>
      </main>
    </div>
  );
}

export default App;

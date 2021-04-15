import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import logo from '../../assets/logo.svg';
import Counter from '../Counter/Counter';
import Swag from '../Swag/Swag';
import Roles from '../Roles/Roles';

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
  paperSimulator: {
    height: 600,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={styles.root}>
      <main className={styles.content}>
        <Container className={classes.container} maxWidth={false}>
          <Grid className={classes.mainGrid} container direction="column" spacing={3}>
            <Grid className={classes.separateScreen} item container spacing={3}>
              <Grid item xs={6} md={4} lg={2}>
                <Paper className={classes.paper}>
                  <Roles />
                </Paper>
              </Grid>

              <Grid item xs={6} md={4} lg={3}>
                <Paper className={classes.paper}>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <Paper className={classes.paper}>
                </Paper>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <Paper className={classes.paper}>
                </Paper>
              </Grid>
            </Grid>

            <Grid item container spacing={3}>
              <Grid item xs={6}>
                <Paper className={classes.paperSimulator}>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paperSimulator}>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <Counter />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <span>
    //       <span>Learn </span>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux-toolkit.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux Toolkit
    //       </a>
    //       ,<span> and </span>
    //       <a
    //         className="App-link"
    //         href="https://react-redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React Redux
    //       </a>
    //     </span>
    //   </header>
    // </div>
  );
}

export default App;

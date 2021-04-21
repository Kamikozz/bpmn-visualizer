import React, { FormEvent, Fragment, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles, Role } from '../../store/roles/rolesSlice';
import { selectActions, Action } from '../../store/actions/actionsSlice';
import { addRelation, removeRelation, changeRelation, selectRoleActionMap, RoleActionRelation } from '../../store/roleActionMap/roleActionMapSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    margin: {
      margin: theme.spacing(1),
    },
    form: {
      display: 'flex',
    },
    roleInput: {
    },
    addButton: {
      marginLeft: theme.spacing(1),
    },
    iconButton: {
      padding: 10,
    },
    list: {
      marginTop: theme.spacing(1),
      overflow: 'auto',
    },
    listItem: {
    },
    select: {
      maxHeight: 300,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default function RoleActionMapper() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const dispatch = useAppDispatch();

  const rolesEntries = Object.entries(roles);
  const actionsEntries = Object.entries(actions);

  const hasRoleActionPair = Boolean(rolesEntries.length && actionsEntries.length);

  const handleAdd = () => {
    console.log(roles, actions);
    const [[ roleId ]] = rolesEntries;
    const [[ actionId ]] = actionsEntries;

    if (hasRoleActionPair) {
      dispatch(addRelation({
        roleId,
        actionId,
      }));
    }
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        disabled={!hasRoleActionPair}
        onClick={handleAdd}
      >
        Добавить пару 'Роль-Функция'
      </Button>
      <List className={classes.list}>
        {
          Object
            .entries(roleActionMap)
            .map(([ id, { roleId, actionId }]: [string, RoleActionRelation]) => {
              const handleRemove = () => dispatch(removeRelation(id));
              const handleChange = ({newRoleId, newActionId }: {
                newRoleId?: string;
                newActionId?: string;
              }) => {
                dispatch(changeRelation({
                  id,
                  roleId: newRoleId,
                  actionId: newActionId,
                }));
              };
              const selectRole = (event: any) => {
                const { value }: { value: string } = event.target;
                handleChange({ newRoleId: value });
              };
              const selectAction = (event: any) => {
                const { value }: { value: string } = event.target;
                handleChange({ newActionId: value });
              };

              return (
                <ListItem key={id} className={classes.listItem} dense divider>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <Select
                      value={roleId}
                      MenuProps={MenuProps}
                      onChange={selectRole}
                    >
                      {
                        Object
                          .entries(roles)
                          .map(
                            ([myRoleId, { name: roleName }]) => (
                              <MenuItem key={myRoleId} value={myRoleId}>{roleName}</MenuItem>
                            )
                          )
                      }
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <Select
                      value={actionId}
                      MenuProps={MenuProps}
                      onChange={selectAction}
                    >
                      {
                        Object
                          .entries(actions)
                          .map(
                            ([myActionId, { name: actionName }]) => (
                              <MenuItem key={myActionId} value={myActionId}>{actionName}</MenuItem>
                            )
                          )
                      }
                    </Select>
                  </FormControl>
                  <Divider className={classes.divider} orientation="vertical" />
                  <IconButton
                    color="primary"
                    size="small"
                    aria-label="remove"
                    onClick={handleRemove}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItem>
              );
            })
        }
      </List>
    </div>
  );
}

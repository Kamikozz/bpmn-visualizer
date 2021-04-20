import React, { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ArrowRightAltRounded from '@material-ui/icons/ArrowRightAltRounded';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import ChipSelector from '../ChipSelector/ChipSelector';
import { addBPRelation, changeBPRelation, removeBPRelation, selectBPRelations, BPRelation } from '../../store/bpRelations/bpRelationsSlice';

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
    chip: {
      maxWidth: '100%',
    },
    divider: {
      height: 28,
      margin: 4,
    },
    formControlContainer: {
      position: 'relative',
      maxWidth: '50%',
      overflow: 'hidden',
    },
    formControl: {
      position: 'absolute',
      left: '0',
      visibility: 'hidden',
    },
  }),
);

export default function RelationsCreator() {
  const classes = useStyles();
  const roles = useAppSelector(selectRoles);
  const actions = useAppSelector(selectActions);
  const roleActionMap = useAppSelector(selectRoleActionMap);
  const bpRelations = useAppSelector(selectBPRelations);
  const dispatch = useAppDispatch();

  const roleActionMapArrayIds = Object.keys(roleActionMap);

  const handleAdd = () => {
    const [relationFrom, relationTo] = roleActionMapArrayIds;
    dispatch(addBPRelation([relationFrom, relationTo]));
  };

  const isDisabledAddRelationButton = roleActionMapArrayIds.length < 2;

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        disabled={isDisabledAddRelationButton}
        onClick={handleAdd}
      >
        Связь бизнес-процессов
      </Button>
      <List className={classes.list}>
        {
          Object
            .entries(bpRelations)
            .map(([ id, { relation }]: [string, BPRelation]) => {
              const handleRemove = () => dispatch(removeBPRelation(id));
              const handleChange = ({ from, to }: { from?: string; to?: string; }) => {
                dispatch(changeBPRelation({
                  id,
                  from,
                  to,
                }));
              };
              const selectRelationFrom = (event: any) => {
                const { value }: { value: string } = event.target;
                handleChange({ from: value });
              };
              const selectRelationTo = (event: any) => {
                const { value }: { value: string } = event.target;
                handleChange({ to: value });
              };

              const [relationFromId, relationToId] = relation;

              const relationFrom = roleActionMap[relationFromId];
              const relationFromRoleName = roles[relationFrom.roleId].name;
              const relationFromActionName = actions[relationFrom.actionId].name;
              const relationFromDisplayValue =
                `${relationFromRoleName} | ${relationFromActionName}`;

              const relationTo = roleActionMap[relationToId];
              const relationToRoleName = roles[relationTo.roleId].name;
              const relationToActionName = actions[relationTo.actionId].name;
              const relationToDisplayValue =
                `${relationToRoleName} | ${relationToActionName}`;

              // const roleActionMapEntriesArray = Object.entries(roleActionMap);

              // const relationFromMenuItems = roleActionMapEntriesArray.map(() => {

              // });

              const menuItems = Object
                .entries(roleActionMap)
                .map(([menuItemRoleActionId, { roleId, actionId }]) => {
                  const roleName = roles[roleId].name;
                  const actionName = actions[actionId].name;
                  return [menuItemRoleActionId, `${roleName} | ${actionName}`];
                });

              return (
                <ListItem key={id} className={classes.listItem} dense divider>
                  <ChipSelector
                    displayValue={relationFromDisplayValue}
                    selectedValue={relationFromId}
                    menuItems={menuItems}
                    color="primary"
                    onChange={selectRelationFrom}
                  />
                  <ArrowRightAltRounded color="primary" />
                  <ChipSelector
                    displayValue={relationToDisplayValue}
                    selectedValue={relationToId}
                    menuItems={menuItems}
                    color="secondary"
                    onChange={selectRelationTo}
                  />

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

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  List, ListItem, Button, IconButton, Divider,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowRightAltRounded as ArrowRight,
} from '@material-ui/icons';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import { selectRoleActionMap } from '../../store/roleActionMap/roleActionMapSlice';
import ChipSelector from '../ChipSelector';
import {
  addBPRelation,
  changeBPRelation,
  removeBPRelation,
  selectBPRelations,
  BPRelation,
} from '../../store/bpRelations/bpRelationsSlice';

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
    listItem: {
    },
    divider: {
      height: 28,
      margin: 4,
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
                  <ArrowRight color="primary" />
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

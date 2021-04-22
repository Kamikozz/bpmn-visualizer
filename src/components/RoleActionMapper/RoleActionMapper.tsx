import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  List, ListItem, Button, IconButton, Divider, FormControl, Select, MenuItem,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectRoles } from '../../store/roles/rolesSlice';
import { selectActions } from '../../store/actions/actionsSlice';
import {
  addRelation,
  removeRelation,
  changeRelation,
  selectRoleActionMap,
  RoleActionRelation,
} from '../../store/roleActionMap/roleActionMapSlice';

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

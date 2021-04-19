import React, { FormEvent, Fragment, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { selectRoles, Role } from '../../features/roles/rolesSlice';
// import { selectActions, Action } from '../../features/actions/actionsSlice';
// import { addRelation, removeRelation, changeRelation, selectRoleActionMap, RoleActionRelation } from '../../features/roleActionMap/roleActionMapSlice';

type ChipSelectorProps = {
  onChange: ((event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
  }>, child: React.ReactNode) => void) | undefined;
  menuItems: Array<Array<string>>;
  displayValue: string;
  selectedValue: string;
  color: "default" | "primary" | "secondary" | undefined;
};

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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
    },
  },
};

export default function ChipSelector(
  { onChange, menuItems, displayValue, selectedValue, color }: ChipSelectorProps,
) {
  const classes = useStyles();
  // const roles = useAppSelector(selectRoles);
  // const actions = useAppSelector(selectActions);
  // const roleActionMap = useAppSelector(selectRoleActionMap);
  // const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  // const handleAdd = () => {
  //   dispatch(addRelation({
  //     roleId: 'role0',
  //     actionId: 'action0',
  //   }));
  // };

  return (
    <div className={classes.formControlContainer}>
      <Chip
        className={classes.chip}
        label={displayValue}
        color={color}
        variant="outlined"
        onClick={handleOpen}
      />
      <FormControl className={classes.formControl} size="small" fullWidth>
        <Select
          value={selectedValue}
          MenuProps={MenuProps}
          open={isOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          onChange={onChange}
        >
          {
            menuItems.map(([id, value]) => <MenuItem key={id} value={id}>{value}</MenuItem>)
          }
          {/* {
            Object
              .entries(roles)
              .map(
                ([myRoleId, { name: roleName }]) => (
                  <MenuItem key={myRoleId} value={myRoleId}>
                    {roleName} | {actionName}
                  </MenuItem>
                )
              )
          } */}
        </Select>
      </FormControl>
    </div>
  );
};

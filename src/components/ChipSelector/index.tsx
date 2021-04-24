import { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, Chip } from '@material-ui/core';

import { ReactChangeEvent } from '../../utils';

interface ChipSelectorProps {
  onChange: ReactChangeEvent;
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

export default function ChipSelector({
  onChange,
  menuItems,
  displayValue,
  selectedValue,
  color,
}: ChipSelectorProps) {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

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
        </Select>
      </FormControl>
    </div>
  );
};

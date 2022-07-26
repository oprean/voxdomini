import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import UserRoleSelection from './UserRoleSelection';
import TextField from '@mui/material/TextField';
import {Avatar} from '@mui/material';
import Chip from '@mui/material/Chip';

export default function UserInput(props) {
    const { name, label, value, error=null, onChange, options, extdata, setval, values } = props;
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState({});

    function handleRole(value,e) {
        setOpen(true)
        setUser(value);
    }

    function handleClose(role) {
      console.log(values.participants.find(p => p.userId == user.userId));
      values.participants.find(p => p.userId == user.userId).roleId = role.id;
      values.participants.find(p => p.userId == user.userId).role = role.name;
      console.log(values.participants.find(p => p.userId == user.userId));
      setOpen(false);
      setval(values);

    }

  return (
    <>

      <Autocomplete
        multiple
        id="user-input"
        options={options}
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option.userId === value.userId}
        getOptionLabel={(option) => option.name}
        value={value}
        name={name}
        onChange={onChange.bind(null, name)}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" avatar={<Avatar>{option.role?option.role[0].toUpperCase():''}</Avatar>} 
              onClick={handleRole.bind(null, option)} label={option.name} {...getTagProps({ index })} />
            ))
          }
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            variant="standard"
            label={label}
          />
        )}
      />
        <UserRoleSelection
            selectedValue={extdata}
            data={user}
            open={open}
            onClose={handleClose}
        />
      </>
  );
}
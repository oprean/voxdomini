import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import UserRoleSelection from './UserRoleSelection';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default function UserInput(props) {
    const { name, label, value, error=null, onChange, options, extdata } = props;
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState({});

//    console.log(extdata, value);
//console.log(options);
//console.log(value);
    function handleRole(value,e) {
        setOpen(true)
        setUser(value);
        console.log(value.id, extdata);
    }

    function handleClose(role) {
      console.log(user, role, extdata);
      user.roleId = role.id;
      setUser(user);
      console.log(user);
      setOpen(false);
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
              <Chip size="small"  onClick={handleRole.bind(null, option)} label={option.name} {...getTagProps({ index })} />
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
import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
export default function AutoComplete(props) {

    const { name, label, value,error=null, onChange, options } = props;
    console.log(options);
    const defaultProps = {
        options: options,
        //getOptionLabel: (option) => {console.log(option); return option.title;},
      };
    return (
        <FormControl fullWidth variant="standard"
        {...(error && {error:true})}>

            <Autocomplete
                //{...defaultProps}
                getOptionLabel = {(option) => {
                    //console.log(option); 
                    return option.title;}}
                id="controlled-demo"
                name={name}
                value={value}
                options={options}
                onChange={(event, newValue) => {
                    console.log(event, newValue);
                    onChange(event,newValue);
                    //setValue(newValue);
                }}
                renderInput={(params) => (
                    <TextField {...params} label={label} variant="standard" />
                )}
            />

            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}

import React from 'react'
import { TextField } from '@mui/material';

export default function Input(props) {

    const { name, label, value,error=null, onChange } = props;
    return (
        <TextField
            variant="standard"
            label={label}
            name={name}
            value={value}
            fullWidth 
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}

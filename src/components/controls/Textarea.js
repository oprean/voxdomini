import React from 'react'
import { TextField } from '@mui/material';

export default function Input(props) {

    const { name, label, value,error=null, onChange, variant } = props;
    return (
        <TextField
            variant={variant||"standard"}
            label={label}
            name={name}
            value={value}
            fullWidth 
            multiline
            maxRows={4}
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}

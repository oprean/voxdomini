import React, { useState } from 'react'

export function useForm(initialFValues, validateOnChange = false, validate) {


    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleMultipleInputChange = (name,e,value) => {
        //const { name, value } = e.target;
        //console.log(name, value);
/*        const name = '1';
        const value = 'v';
        console.log(e);
        console.log(v);
        console.log(f);
        console.log(g);
        console.log(h);
        console.log(i);*/
        setValues({
            ...values,
            [name]: value
        })
        if (validateOnChange)
            validate({ [name]: value })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        if (validateOnChange)
            validate({ [name]: value })
    }

    const resetForm = () => {
        setValues(initialFValues);
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        handleMultipleInputChange, 
        resetForm

    }
}


export function Form(props) {


    const { children, ...other } = props;
    return (
        <form autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}


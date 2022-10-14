import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import QRCard from "../components/QRCard";
import { Grid, } from '@mui/material';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Controls from "./controls/Controls";
import { useForm, Form } from './useForm';
import {API_ROOT_URL} from '../utils/constants';
import {DATE_FORMAT} from '../utils/constants';
import {useStateValue} from '../utils/state';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let initialFValues = {
  id: 0,
  name: '',
  description:'',
  permlink: '',
  groupOnly: false,
  parentId: 0
}

export default function FullScreenDialog(props) {
  const [state, dispatch ] = useStateValue();
  const [open, setOpen] = React.useState(props.open);
  const [data, setData] = React.useState({resources:[{id:0, title:''}]});

  const handleClose = () => {
    props.onClose();
    setOpen(false);
  };
  
  async function fetchData() {
    let resource = {}
    let response = await axios.get(API_ROOT_URL + 'resource/' + props.data.id + '/none');
    if (props.data.id) {
      resource = response.data.resource;
      console.log(resource);
      resource.description = resource.description===null?'':resource.description;
      resource.name = resource.name===null?'':resource.name;
      resource.permlink = resource.permlink===null?resource.id:resource.permlink;
      resource.parentId = resource.parentId===null?0:resource.parentId;
      resource.groupOnly = resource.groupOnly!=='1'?false:resource.groupOnly;
    } else {
      resource = initialFValues;
    }

    setValues(resource);

    setData({
      resources:response.data.resources 
    })

    //console.log(data);
  };

  async function saveData(event) {
    if (event.id) {
        await axios.put(API_ROOT_URL + 'resource', event).then(function (response) {
            props.onClose();
        });
    } else {
        await axios.post(API_ROOT_URL + 'resource', event).then(function (response) {
            props.onClose();
        });
    }
  }

  useEffect(() => {
    setOpen(props.open)
    if(props.open === true) fetchData();
  },[props]);


  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('title' in fieldValues)
        temp.name = fieldValues.name ? "" : "This field is required."
    setErrors({
        ...temp
    })

    if (fieldValues == values)
        return Object.values(temp).every(x => x == "")
  }

    let {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);
  

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (validate()){
            saveData(values);
        }
    }

    //console.log(data);

    return (

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {values.title}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              save
            </Button>
            <Button color="inherit" onClick={resetForm}>
              reset
            </Button>
          </Toolbar>
        </AppBar>

        <Form onSubmit={handleSubmit}>
            <Grid container style={{padding:10}}>
                <Grid item xs={12}>
                    <Controls.Input
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <Controls.Textarea
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleInputChange}
                        error={errors.description}
                    />

                    <Controls.Textarea
                        name="permlink"
                        label="Permlink"
                        value={values.permlink}
                        onChange={handleInputChange}
                        error={errors.permlink}
                    />

                    <Controls.Select
                        name="parentId"
                        label="Parent"
                        value={values.parentId}
                        onChange={handleInputChange}
                        options={data.resources}
                        error={errors.parentId}
                    />
                    <br/>
                    <Controls.Checkbox
                        name="groupOnly"
                        label="Group only"
                        value={values.groupOnly}
                        onChange={handleInputChange}
                    />
                    <br/>
                    <QRCard content={values}/>
                    <div>Current header image</div>
                    <img style={{marginTop: 10, marginBottom: 10}} width={"500px"} src={'resources/'+ props.data.id + '.jpg'} />
                    <Controls.ImageUpload data={values} />
                </Grid>
            </Grid>
        </Form>
      </Dialog>
  );
}

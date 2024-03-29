import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Grid, } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Controls from "./controls/Controls";
import { useForm, Form } from './useForm';
import {API_ROOT_URL} from '../utils/constants'
import axios from 'axios';
import {PERMISSIONS} from '../utils/permissions';
import { useHasPermissions } from "../hooks/useHasPermissions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let initialFValues = {
  id: 0,
  title: '',
  start: '',
  end: '',
  resourceId: 0,
  bgColor: '',
  showPopover: false,
  resizable: true,
  movable: true,
  startResizable:true,
  endResizable:true,
  rrule:'',
  groupId:0,
  type:0
}

export default function FullScreenDialog(props) {
  const [open, setOpen] = React.useState(props.open);
  const [data, setData] = React.useState({resources:[{id:0, title:''}], groups:[{id:0, title:''}], types:[{id:0, title:''}], users:[{name:''}]});
  
  function handleClose() {
    props.closeHandler();
    setOpen(false);
  };
  
  async function fetchData() {
    let response = await axios.get(API_ROOT_URL + 'event/' + props.eventId);
    let event = response.data.event;
    event.showPopover = event.showPopover==='1'?true:false;
    event.resizable = event.resizable === '1'?true:false;
    event.movable = event.movable === '1'?true:false;
    event.startResizable = event.startResizable === '1'?true:false;
    event.endResizable = event.endResizable === '1'?true:false;
    event.groupId = event.groupId===null?0:event.groupId;
    event.type = event.type===null?0:event.type;
    setValues(event);
    setData({
      resources:response.data.resources.map(res => { res.title=res.name; return res}), 
      groups:response.data.groups.map(res => { res.title=res.name; return res}), 
      types:response.data.types.map(res => { res.title=res.name; return res}),
      users:response.data.users
    })

    //console.log(data);
  };

  async function saveData(event) {
    await axios.put(API_ROOT_URL + 'event', event).then(function (response) {
      props.closeHandler();
    });

  }

  useEffect(() => {
    setOpen(props.open)
    if(props.open === true) fetchData();
  },[props]);


  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('title' in fieldValues)
        temp.title = fieldValues.title ? "" : "This field is required."
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
    handleMultipleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);
  

const handleSubmit = e => {
    e.preventDefault()
    if (validate()){
        saveData(values);
    }
}

  const canEdit = useHasPermissions(PERMISSIONS.EDIT_EVENTS, {event:values})

  return (

      <Dialog

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
            {canEdit && <Button autoFocus color="inherit" onClick={handleSubmit}>
              save
            </Button>}
            {canEdit && <Button color="inherit" onClick={resetForm}>
              reset
            </Button>}
          </Toolbar>
        </AppBar>

        <Form onSubmit={handleSubmit}>
            <Grid container style={{padding:10}}>
                <Grid item xs={12}>
                    <Controls.Input
                        name="title"
                        label="Title"
                        value={values.title}
                        onChange={handleInputChange}
                        error={errors.title}
                    />
                    <Grid container>
                      <Grid item xs={6}>
                        <Controls.DatePicker
                            name="start"
                            label="Start time"
                            value={values.start}
                            onChange={handleInputChange}
                        /></Grid>
                      <Grid item xs={6}>
                        <Controls.DatePicker
                            name="end"
                            label="End time"
                            value={values.end}
                            onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                    <Controls.Textarea
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleInputChange}
                        error={errors.description}
                    />

                    <Controls.Select
                        name="resourceId"
                        label="Resource"
                        value={values.resourceId}
                        onChange={handleInputChange}
                        options={data.resources}
                        error={errors.resourceId}
                    />
                    {false && <><Controls.Select
                        name="groupId"
                        label="Group"
                        value={values.groupId}
                        onChange={handleInputChange}
                        options={data.groups}
                        error={errors.groupId}
                    />
                    <Controls.Select
                        name="type"
                        label="Type"
                        value={values.type}
                        onChange={handleInputChange}
                        options={data.types}
                        error={errors.type}
                    /></>}
                    {true && <><Controls.UserInput 
                        name="participants"
                        label="Participants"
                        value={values.participants}
                        extdata={values.id}
                        options={data.users}
                        values={values}
                        setval={setValues}
                        onChange={handleMultipleInputChange}
                    /></>}
                    
                    {false && <><Controls.Checkbox
                        name="movable"
                        label="Movable"
                        value={values.movable}
                        onChange={handleInputChange}
                    />
                    <Controls.Checkbox
                        name="resizable"
                        label="Resizable"
                        value={values.resizable}
                        onChange={handleInputChange}
                    />
                    <Controls.Checkbox
                        name="startResizable"
                        label="Start resizable"
                        value={values.startResizable}
                        onChange={handleInputChange}
                    />
                  <Controls.Checkbox
                        name="endResizable"
                        label="End resizable"
                        value={values.endResizable}
                        onChange={handleInputChange}
                    /> </>}
                </Grid>
            </Grid>
        </Form>


      </Dialog>
  );
}

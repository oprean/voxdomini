import React, { Fragment, useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Avatar, CardActionArea, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import DuplicateIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import {API_ROOT_URL} from '../utils/constants'
import axios from 'axios';
import {useStateValue} from '../utils/state';
import {DATE_FORMAT} from '../utils/constants';
import {PERMISSIONS} from '../utils/permissions';
import { useHasPermissions } from "../hooks/useHasPermissions";

const EventCard = (props) => { 
    const [state, dispatch ] = useStateValue();
    const canEdit = useHasPermissions([PERMISSIONS.EDIT_EVENTS])
    const canDelete = useHasPermissions([PERMISSIONS.DELETE_EVENTS])
    const canCreate = useHasPermissions([PERMISSIONS.CREATE_EVENTS])
    const event = props.data;
    //console.log(props);

    function handleEditEvent() {
        dispatch({
            type:'init.dialog',
            payload: {
              dialog: {
                  open:true,
                  type:'dlg.event.edit',
                  data: event,
                  onClose: props.onClose
              },
            }
        });
    }

    async function handleDeleteEvent() {
        // delete 
        if (window.confirm('Are you sure you want to delete?')) {
            let response = await axios.delete(API_ROOT_URL + 'event/'+ event.id)
            props.onClose();
        }
    }

    async function handleDduplicateEvent() {
      let ev = JSON.parse(JSON.stringify(event))
      ev.id = undefined;
      dispatch({
        type:'init.dialog',
        payload: {
          dialog: {
              open:true,
              type:'dlg.event.edit',
              data: ev,
              onClose: props.onClose
          },
        }
    });
    }

    const style = {
        center: {display: 'flex',alignItems: 'center',flexWrap: 'wrap'}
    };
//console.log(event.sharedUser);
    return (
        <Card style={{marginBottom:10}}>
          <CardActionArea onClick={handleEditEvent}>
            <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
                {event.title}
            </Typography>    
            <Typography variant="body2" color="text.secondary" component="div" gutterBottom>
                {event.description}
            </Typography>    
            <Typography variant="body1" component="div" style={style.center}>
                <CalendarMonthIcon fontSize="small"/>
                {moment(event.start).isSame(event.end, 'day')
                  ?moment(event.start).format('D MMM YYYY') +' '+ moment(event.start).format('HH:mm') +' - '+ moment(event.end).format('HH:mm')
                  :moment(event.start).format(DATE_FORMAT) +' - '+ moment(event.end).format(DATE_FORMAT)}
                
            </Typography>    
            {true && <Typography variant="body1" component="div" style={style.center}>
                <PeopleIcon fontSize="small"/>       
                {event.ownEventUser && event.ownEventUser.map((user) => {
                  return (
                    <Chip avatar={<Avatar>{user.role?user.role[0].toUpperCase():''}</Avatar>}
                    key={user.id} label={user.name} size="small" />
                  )
                })}
            </Typography>}
            </CardContent>
          </CardActionArea>
          <CardActions style={{float:'right'}}>
            {canEdit && <IconButton onClick={handleEditEvent} aria-label="Edit event">
              <EditIcon />
            </IconButton>}
            {canDelete && <IconButton  onClick={handleDeleteEvent} aria-label="Delete event">
              <DeleteIcon />
            </IconButton>}
            {canCreate && <IconButton  onClick={handleDduplicateEvent} aria-label="Duplicate event">
              <DuplicateIcon />
            </IconButton>}
          </CardActions>
        </Card>
      );
}

export default EventCard;
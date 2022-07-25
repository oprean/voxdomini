import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import {API_ROOT_URL} from '../../utils/constants'
import axios from 'axios';

let roles;/* = [
  { id: 1,
    name:'owner'}, 'guest', 'responsible', 'organizer', 'participant'];*/

export default function UserRoleSelection(props) {
    const { onClose, selectedValue, open, data } = props;
    const [roles, setRoles] = React.useState([{id:0, name:''}]);

    useEffect(() => {
      fetchData();
    },[]);

    async function fetchData() {
      let response = await axios.get(API_ROOT_URL + 'roles');
      setRoles(response.data);
    }

    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
  
//console.log(roles);

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{data.name}</DialogTitle>
        <List sx={{ pt: 0 }}>
          {roles.map((role) => (
            <ListItem button onClick={() => handleListItemClick(role)} key={role.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={role.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
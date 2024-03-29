import React, { Fragment, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {QRCodeSVG, QRCodeCanvas} from 'qrcode.react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {API_ROOT_URL} from '../utils/constants'
import axios from 'axios';
import {useParams} from "react-router-dom";
import EventCard from '../components/EventCard';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardActions } from '@mui/material';
import { useHistory } from "react-router-dom";
import {useStateValue} from '../utils/state';
import {PERMISSIONS} from '../utils/permissions';
import { useHasPermissions } from "../hooks/useHasPermissions";

const ResourceAgenda = () => { 
  const [state, dispatch ] = useStateValue();
  const [resource, setResource] = React.useState([]);
  const [filter, setFilter] = React.useState("all");
  const [notFound, setNotFound] = React.useState(false);

  let { id } = useParams();
  let history = useHistory();
  const qrcode = {
    url:"https://voxdomini.bitalb.ro/resource/" + id,
    text: resource.name
}
  const canCreate = useHasPermissions(PERMISSIONS.CREATE_EVENTS)
  const canEdit = useHasPermissions(PERMISSIONS.EDIT_RESOURCES)
  const canDelete = useHasPermissions(PERMISSIONS.DELETE_RESOURCES)
  const canView = useHasPermissions(PERMISSIONS.READ_EVENTS)
    useEffect(() => {
    fetchData(filter);
  },[]);


  async function fetchData(f) {
  // console.log(f);
    f = f === undefined?'all':f;
    if (id) {
      let response = await axios.get(API_ROOT_URL + 'resource/' + id + '/' + f)
        .then(response => {
          setResource(response.data.resource);
          setNotFound(false);
        })
        .catch(response => {
          setNotFound(true);
      });

    }
  };
  

  function handleAddEvent() {
    console.log(id);
    dispatch({
      type:'init.dialog',
      payload: {
        dialog: {
            open:true,
            type:'dlg.event.edit',
            data: {resourceId: id, groupId:0, type:0},
            onClose: fetchData
        },
      }
  });
  }

  function filterHR(filter) {
    let hr = filter;
    switch(filter) {
      case 'all': hr = 'Future'; break;
      case 'week': hr = 'This week'; break;
      case 'past': hr = 'Past events'; break;
      case 'today': hr = 'Today'; break;
    }
    return hr;
  }

  function handleClick(event) {
    event.preventDefault();
    history.push(`/planner`);
  }

  function handleFilterEvents(filter) {
    fetchData(filter);
  }

  return (
    
<Container maxWidth="xxl">
    {notFound && <Redirect to={{pathname:"/404",state:history.location.pathname}} />}
     <Card>
     <CardActionArea  onClick={handleClick}>
        <CardMedia
          component="img"
          height="40"
          image={'/resources/' + resource.id + '.jpg'}
          alt={resource.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {resource.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resource.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{float:'right'}}>     
      {canCreate && <Button onClick={handleAddEvent} variant="text">Add event</Button>}
      </CardActions>
    </Card>
<br/>
    { false && <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/planner">
        Planner
      </Link>
      <Typography color="text.primary">{resource.name}</Typography>
      <Typography color="text.primary">{filterHR(filter)}</Typography>
    </Breadcrumbs> }

    {resource.ownEvent && resource.ownEvent.map((event) => {
      return (<div key={event.id}><EventCard data={event} onClose={fetchData.bind(null, filter)} /></div>)
    })}
  <Box sx={{ flexGrow: 1, height:55 }} />
  {canView && <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={filter}
          onChange={(event, newValue) => {
            setFilter(newValue);
            handleFilterEvents(newValue)
          }}
        >
          <BottomNavigationAction label="Future" value={"all"} style={{backgroundColor:filter=='all'?"#CCC":"#FFF"}} icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Past events" value={"past"} style={{backgroundColor:filter=='past'?"#CCC":"#FFF"}} icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Today" value={"today"} style={{backgroundColor:filter=='today'?"#CCC":"#FFF"}} icon={<ArchiveIcon />} />
          <BottomNavigationAction label="This week" value={"week"} style={{backgroundColor:filter=='week'?"#CCC":"#FFF"}} icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>}

</Container> 
)};

export default ResourceAgenda;

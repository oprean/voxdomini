import React, { Fragment, useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ResourceCard from '../components/ResourceCard';

import Typography from '@mui/material/Typography';
import {API_ROOT_URL} from '../utils/constants'
import { useTheme, useMediaQuery } from '@material-ui/core';
import axios from 'axios';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useAuth0 } from "@auth0/auth0-react";
import Paper from '@mui/material/Paper';

const Resources = (props) => { 
  const [resources, setResources] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [filter, setFilter] = React.useState(0);
  const {user} = useAuth0();
  useEffect(() => {
    fetchData();
    },[]);

  async function fetchData(f) {
    const type = (user === undefined)?'0':'1';
    f = f === undefined?'0':f;
    f += '/'+type
    let response = await axios.get(API_ROOT_URL + 'resources/'+ f);
    setResources(response.data.resources);
    setGroups(response.data.groups);
  };
  
  function handleFilterResources(filter) {
    fetchData(filter);
  }

  return (
<Container maxWidth="xxl" sx={{paddingTop:1}}>
    {resources.map((resourse) => {
        return (<ResourceCard key={resourse.id} data={resourse}  onClose={fetchData}/>)
    })}
    <Box sx={{ flexGrow: 1, height:55 }} />
    {true && <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={filter}
          onChange={(event, newValue) => {
            setFilter(newValue);
            handleFilterResources(newValue)
          }}
        >
          <BottomNavigationAction 
              key={0} 
              value={0} 
              label={'All'} 
              icon={<ArchiveIcon />} 
              style={{backgroundColor:filter==0?"#CCC":"#FFF"}}
            />
          {groups.map((group) => { return (
            <BottomNavigationAction 
              key={group.id} 
              value={group.id} 
              label={group.name} 
              icon={<ArchiveIcon />} 
              style={{backgroundColor:filter==group.id?"#CCC":"#FFF"}}
            />
          )})}
        </BottomNavigation>
      </Paper>}
</Container> 
)};

export default Resources;

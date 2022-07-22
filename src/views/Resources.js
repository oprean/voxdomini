import React, { Fragment, useState, useEffect, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import ResourceCard from '../components/ResourceCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {API_ROOT_URL} from '../utils/constants'
import { useTheme, useMediaQuery } from '@material-ui/core';
import axios from 'axios';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';

const Resources = (props) => { 
  const [resources, setResources] = React.useState([]);
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    fetchData();
    },[]);

  async function fetchData() {
    let response = await axios.get(API_ROOT_URL + 'resources');
    setResources(response.data);
  };
  
  return (
<Container maxWidth="xxl" sx={{paddingTop:1}}>
    {resources.map((resourse) => {
        return (<ResourceCard key={resourse.id} data={resourse}  onClose={fetchData}/>)
    })}
    {false && <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Demisol" icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Parter" icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Etaj" icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Mansarda" icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>}
</Container> 
)};

export default Resources;

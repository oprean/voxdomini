import React, { Fragment, useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {API_ROOT_URL} from '../utils/constants'
import axios from 'axios';
import {useParams} from "react-router-dom";
import {QRCodeSVG, QRCodeCanvas} from 'qrcode.react';
import EventCard from '../components/EventCard';
import {Box} from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';


const ResourceAgenda = () => { 
  const [resource, setResource] = React.useState([]);
  const [value, setValue] = React.useState(0);
  let { id } = useParams();

  useEffect(() => {
    fetchData();
  },[]);


  async function fetchData() {
    let response = await axios.get(API_ROOT_URL + 'resource/' + id);
    console.log(response.data);
    setResource(response.data);
  };
  
  return (
<Container maxWidth="xl" sx={{paddingTop:1}}>
<Grid container spacing={2}>
  <Grid item xs={3}>
      <QRCodeSVG value="http://localhost:3000/resource/26" 
      size={256}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={false}
      imageSettings={{
        src: "https://voxdomini.bitalb.ro/vox3.png",
        x: undefined,
        y: undefined,
        height: 68,
        width: 68,
        excavate: true,
      }}/>
  <Typography variant="h5" component="div" gutterBottom>
      {resource.name}
    </Typography>
  </Grid>
  <Grid item xs={8}>
    <Box
        component="img"
        sx={{
          height: 256,
//          width: 350,
//          maxHeight: { xs: 233, md: 167 },
//          maxWidth: { xs: 350, md: 250 },
        }}
        alt={resource.name}
        src={'/resources/' + id + '.jpg'}
      />
  </Grid>
  <Grid item xs={1}>
    <div style={{float:'right'}}>
    <Tooltip title={"Add events to " + resource.name}>
    <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      </Tooltip>
      </div>
  </Grid>
  <Grid item xs={12}>
    {resource.ownEvent && resource.ownEvent.map((event) => {
      return (<EventCard key={event.id} data={event} />)
    })}
  </Grid>
</Grid>
<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
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
      </Paper>
</Container> 
)};

export default ResourceAgenda;

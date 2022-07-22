import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
//import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import {useStateValue} from '../utils/state';
import { Link, useHistory } from "react-router-dom";
import {PERMISSIONS} from '../utils/permissions';
import { useHasPermissions } from "../hooks/useHasPermissions";

export default function ResourceCard(props) {
  const [state, dispatch ] = useStateValue();

  const canEdit = useHasPermissions([PERMISSIONS.EDIT_RESOURCES])
  const canDelete = useHasPermissions([PERMISSIONS.DELETE_RESOURCES])

  const resource = props.data;
  let history = useHistory();

  function handleClick(event) {
    event.preventDefault();
    history.push(`/resource/${resource.id}`);
  }

  function handleEditResource() {
    dispatch({
        type:'init.dialog',
        payload: {
          dialog: {
              open:true,
              type:'dlg.resource.edit',
              data: resource,
              onClose: props.onClose
          },
        }
    });
}

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={'/resources/' + resource.id + '.jpg'}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {resource.name} 
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resource.description} 
            ({Array.isArray(resource.ownEvent)?resource.ownEvent.length:0}) event/s
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{float:'right'}}>
        {canEdit && <IconButton aria-label="Edit resource" onClick={handleEditResource}>
          <EditIcon />
        </IconButton>}
        {canDelete && <IconButton aria-label="Delete resource">
          <DeleteIcon />
        </IconButton>}
      </CardActions>
    </Card>
  );
}

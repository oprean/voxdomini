import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useStateValue} from '../utils/state';
import EventDlg from './EventDlg';
import ResourceDlg from './ResourceDlg';
import {PERMISSIONS} from '../utils/permissions';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  section: {
    padding: 10,
    margin: 10
  },
  downloadLink: {
    textDecoration:'none',
    color:'#FFF'
  }
}));

export default function(props) {

    const data = props.data;// || {company:'', tier:'-1', allowed:'19.0', licid:'btal'}
    const { onClose, ...other } = props;
    const [state, dispatch ] = useStateValue();

    const classes = useStyles();

    function handleClose() {
        dispatch({
            type:'init.dialog',
            payload: {
              dialog: {
                  open:false,
                  type:'none',
                  data:{},
                  onClose: null
              },
            }
        });
        if (state.dialog.onClose) state.dialog.onClose();
    };

    switch(state.dialog.type) {
        case 'dlg.event.edit':
            return <EventDlg open={state.dialog.open} onClose={handleClose} data={state.dialog.data}/>
        case 'dlg.event.view':
            return <EventDlg open={state.dialog.open} onClose={handleClose} data={state.dialog.data}/>
        case 'dlg.resource.edit':
            return <ResourceDlg open={state.dialog.open} onClose={handleClose} data={state.dialog.data}/>
        default:
            return <div></div>
    }
}

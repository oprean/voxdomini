import React, {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios";
import {vapidDetails,SERVER} from '../utils/constants'
import {useStateValue} from '../utils/state';
const Home = (props) => {
    const [state, dispatch ] = useStateValue();
    const [registration, setRegistration] = React.useState('');
    const [subscription, setSubscription] = React.useState('');

    useEffect(() => {
        registerServiceWorker()
      },[]);

    async function registerServiceWorker() {
        await navigator.serviceWorker.ready.register('./service-worker.js').then((reg) => {
            console.log(reg);
            reg.pushManager.getSubscription().then((sub) => {
                setRegistration(reg);
                if (sub === null) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlB64ToUint8Array(vapidDetails.publicKey)
                      }).then((s) => {
                        setSubscription(s);
                      });
                } else {
                    setSubscription(sub);
                }
            });
        });
      };
      
      async function unregisterServiceWorker() {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration.unregister();
      }
      
      // Convert a base64 string to Uint8Array.
      // Must do this so the server can understand the VAPID_PUBLIC_KEY.
      function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray; 
      };
      
      async function subscribeToPush() {
        const registration = await navigator.serviceWorker.getRegistration();
        //console.log(vapidDetails.publicKey);
        /*const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(vapidDetails.publicKey)
        });*/

        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        const data = { 
            subscription:sub,
            user:state.user
        }
        postToServer('/add-subscription', data);
      }
      
      async function unsubscribeFromPush() {
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        const data = { 
            subscription:sub,
            user:state.user
        }
        postToServer('/remove-subscription', data);
        await subscription.unsubscribe();
      }
      
      async function notifyMe() {
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        const data = { 
            subscription:sub,
            user:state.user
        }
        postToServer('/notify-me', data);
      }
      
      async function notifyAll() {
        const response = await fetch('/notify-all', {
          method: 'POST'
        });
        if (response.status === 409) {
          document.getElementById('notification-status-message').textContent =
              'There are no subscribed endpoints to send messages to, yet.';
        }
      }
      
      /* Utility functions. */
      
      async function postToServer(url, data) {
        url = SERVER+url;
        let response = await axios.post(url, data);
      }

      console.log(registration);
      console.log(subscription);
      return (
        <Container sx={{height:'10vh', paddingY:'10px'}}>
            <Typography variant="h6">Push notification testing ...</Typography>

            <TextField
                id="service-worker-scope"
                label="Scope"
                multiline
                fullWidth
                maxRows={4}
                value={registration?registration.scope:'not registered yet'}
                />
            <Button onClick={registerServiceWorker}>register sw</Button>
            <Button onClick={unregisterServiceWorker}>unregister sw</Button>
            
            <TextField
                id="subscription-info"
                label="subscription"
                multiline
                fullWidth
                maxRows={4}
                value={subscription?subscription.endpoint:'no subscription yet'}
                />
            <Button onClick={subscribeToPush}>subscribe</Button>
            <Button onClick={unsubscribeFromPush}>unsubscribe</Button>
            
            <TextField
                id="notification-info"
                label="notification"
                multiline
                fullWidth
                maxRows={4}
                value={'some notification indo'}
                />
            <Button onClick={notifyMe}>notify me</Button>
            <Button onClick={notifyAll}>notify all</Button>
        </Container>
    )
};

export default Home;

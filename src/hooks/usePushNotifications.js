import { useState, useEffect } from "react";
import moment from 'moment';
import {SERVER_HOST, DATE_FORMAT} from '../utils/constants';
import {useStateValue} from '../utils/state';
import { browserName, browserVersion } from "react-device-detect";
import axios from "axios";
import http from "../utils/http";

//the function to call the push server: https://github.com/Spyna/push-notification-demo/blob/master/front-end-react/src/utils/http.js

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  removeNotificationSubscription,
  getUserSubscription
} from "../utils/push-notifications";
//import all the function created to manage the push notifications

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

export default function usePushNotifications() {
  const [state, dispatch ] = useStateValue();
  const [userConsent, setSuserConsent] = useState(Notification.permission);
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState(null);
  //to manage the use push notification subscription
  //to manage the push server subscription
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        console.log('registerServiceWorker DONE~!')
        setLoading(false);
      });
    }
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render
  
  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPermission().then(consent => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0
        });
      }
      setLoading(false);
    });
  };
  //

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
    +
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSubsribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    createNotificationSubscription()
      .then(function(subscrition) {
        setUserSubscription(subscrition);
        setLoading(false);
        const data = { 
          subscription:subscrition,
          user:state.user
        }
        console.log(data);
        http
          .post("/add-subscription", data)
          .then(function(response) {
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
            setError(err);
          });
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };

  const onClickUnsubsribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    removeNotificationSubscription()
      .then(function (res) {
        setLoading(false);
        const data = { 
        subscription:userSubscription,
          user:state.user
        }
        console.log(data);
        setUserSubscription(null);
        http
          .post("/remove-subscription", data)
          .then(function(response) {
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
            setError(err);
          });
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };


  /**
   * define a click handler that request the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendTestNotification = async () => {
    setLoading(true);
    setError(false);
    const body = `Notification text from ${browserName} ${browserVersion} on ${moment().format(DATE_FORMAT)}`; 
    const data = {
      title: 'New Robot Available',
      userId: state.user.profile.id,
      body: body,
      now:true,
      icon: '/robot.png',
      badge: '/robot.png',
      image: '/robot.png',
      tag: 'new-product',
      url: '/new-robot'
    };
    await axios.post(SERVER_HOST+"/notify", data).catch(err => {
      setLoading(false);
      setError(err);
    });
    setLoading(false);
  };

  const onClickSendNotification = async (data) => {
    setLoading(true);
    setError(false);
    console.log(data);
    await http.post("/notify",data).catch(err => {
      setLoading(false);
      setError(err);
    });
    setLoading(false);
  };


  /**
   * returns all the stuff needed by a Component
   */
  return {
    onClickAskUserPermission,
    onClickSubsribeToPushNotification,
    onClickUnsubsribeToPushNotification,
    onClickSendTestNotification,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading
  };
}

import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Button from '@mui/material/Button';
import { Grid, } from '@mui/material';
import Typography from '@mui/material/Typography';
import Controls from "../components/controls/Controls";
import { browserName, browserVersion } from "react-device-detect";
import {DATE_FORMAT, API_ROOT_URL} from '../utils/constants';
import { useForm, Form } from '../components/useForm';
import usePushNotifications from "../hooks/usePushNotifications";
import {useStateValue} from '../utils/state';
import axios from 'axios';

const Loading = ({ loading }) => (loading ? <div className="app-loader">Please wait, we are loading something...</div> : null);
const Error = ({ error }) =>
  error ? (
    <section className="app-error">
      <h2>{error.name}</h2>
      <p>Error message : {error.message}</p>
      <p>Error code : {error.code}</p>
    </section>
  ) : null;

  let initialFValues = {
   
    title: 'Title',
    body: `Notification text from ${browserName} ${browserVersion} on ${moment().format(DATE_FORMAT)}`,
    userId:0,
    show: moment().format(DATE_FORMAT),
    now:true
   
  }

export default function PushNotificationDemo(props) {
  const [state, dispatch ] = useStateValue();
  const [data, setData] = React.useState({
    users:[{name:'',userId:''}]
  });

  async function fetchData() {
    let response = await axios.get(API_ROOT_URL + 'event/0');
    initialFValues.userId = state.user.profile.id;
    setData({
      users:response.data.users
    })
  };

  useEffect(() => {
    fetchData();
    setValues(initialFValues);
  },[props]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('title' in fieldValues)
        temp.title = fieldValues.title ? "" : "This field is required."
    if ('body' in fieldValues)
        temp.title = fieldValues.title ? "" : "This field is required."

        setErrors({
        ...temp
    })

    if (fieldValues == values)
        return Object.values(temp).every(x => x == "")
  }

    let {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);
  

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()){
          onClickSendNotification(values);
        }
    }

  const {
    userConsent,
    pushNotificationSupported,
    userSubscription,
    onClickAskUserPermission,
    onClickSubsribeToPushNotification,
    onClickSendTestNotification,
    onClickSendNotification,
    error,
    loading
  } = usePushNotifications();


  const isConsentGranted = userConsent === "granted";
console.log(userSubscription);
  return (
    <Grid container style={{padding:10}}>
                <Grid item xs={12}>
      <Loading loading={loading} />

      <p>Push notification are {!pushNotificationSupported && "NOT"} supported by your device.</p>

      <p>
        User consent to recevie push notificaitons is <strong>{userConsent}</strong>.
      </p>

      <Error error={error} />

      <Button size="small" variant="outlined" disabled={!pushNotificationSupported || isConsentGranted} onClick={onClickAskUserPermission}>
        {isConsentGranted ? "Consent granted" : " Ask user permission"}
      </Button>
&nbsp;&nbsp;
      <Button size="small" variant="outlined" disabled={!pushNotificationSupported || !isConsentGranted || userSubscription!==null} onClick={onClickSubsribeToPushNotification}>
        {userSubscription ? "Push subscription created" : "Create Notification subscription"}
      </Button>
      {isConsentGranted && (
        <div>
          <p>The server accepted the push subscrption!</p>

        <Controls.Textarea
            variant="outlined"
            name="body"
            label="Your notification subscription details"
            value={JSON.stringify(userSubscription, null, " ")}
        />
      <br/><br/>
      <Button variant="outlined" onClick={onClickSendTestNotification}>Send test notification</Button>
      <br/><br/>
      <Controls.Input
                        name="title"
                        label="Title"
                        value={values.title}
                        onChange={handleInputChange}
                        error={errors.title}
                    />
      <Controls.Textarea
                        name="body"
                        label="Text"
                        value={values.body}
                        onChange={handleInputChange}
                        error={errors.body}
                    />
      <Controls.DatePicker
                            name="show"
                            label="Start time"
                            value={values.show}
                            onChange={handleInputChange}
                        />     
      <Controls.Select 
          name="userId"
          label="User"
          value={values.userId}
          options={data.users.map(u => {
            u.id = u.userId; 
            u.title = u.name; 
            u.label = u.name; 
            return u})}
          onChange={handleInputChange}
      />     
      <br/><br/>
      <Button variant="outlined" onClick={handleSubmit}>Send configured notification</Button>
      &nbsp;&nbsp;
      <Controls.Checkbox
                        name="now"
                        label="Now"
                        value={values.now}
                        onChange={handleInputChange}
                    />
        </div>
      )}
      </Grid>
    </Grid>
  );
}

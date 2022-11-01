import React, {useState, useEffect} from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StateProvider} from './utils/state';
import Loading from "./components/Loading";
import AppBar from "./components/AppBar";
import { Box } from "@mui/system";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import Planner  from "./views/Planner";
import Calendar  from "./views/Calendar";
import Resource from "./views/Resource"
import GenericNotFound from "./views/NotFound"
import history from "./utils/history";
//import { Button } from '@mui/material';
import DlgFactory from "./components/DlgFactory";
import { useAuth0 } from "@auth0/auth0-react";
//import { fetchToken, onMessageListener } from './utils/firebase';
// styles
import "./App.css";

const theme = createTheme({
  palette: {
    //mode: 'dark',
    primary: {
        main: '#3C4664',
        contrastText: '#fff',
    },
    secondary: {
      main: '#eb6b08',
      contrastText: '#fff',
    },
  },
  components: {
    // Name of the component ??
    MuiButtonBase: {
      defaultProps: {
        // The default props to change
        //disableRipple: true, // No more ripple, on the whole application ??!
      },
    },
  },
});
// https://github.com/auth0-blog/react-rbac
const App = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();  
  /*const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);

  fetchToken(setTokenFound);

  onMessageListener().then(payload => {
    setNotification({title: payload.notification.title, body: payload.notification.body})
    setShow(true);
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    setNotification({title: "Notification", body: "This is a test notification"})
    setShow(true);
  }*/

  const state = {
    user: user,
    dialog:{
      open:false, 
      data:{}
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'init.dialog':
        return {
          ...state,
          dialog:action.payload.dialog
        } 
        default:
          return state;
      }
    }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
    <StateProvider initialState={state} reducer={reducer}>
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <AppBar />
          <Box sx={{ display: { xs: 'block', md:'block' } }}>
            <br/><br/><br/>
          </Box>
          <Box sx={{ display: { xs: 'none', md:'block' } }}>
            <br/>
          </Box>
          <Switch>
            <Route path="/" exact>
              {isAuthenticated ? <Redirect to="/planner" /> : <Home />}
            </Route>
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/planner" component={Planner} />
            <Route path="/resource/:id" component={Resource} />
            <Route path="/calendar" component={Calendar} />
            <Route path='/404' component={GenericNotFound} />
            <Route path='*' component={GenericNotFound} />
          </Switch>

          {/*1==2 && <header className="App-header">
        {isTokenFound && <h1> Notification permission enabled ???? </h1>}
        {!isTokenFound && <h1> Need notification permission ?? </h1>}
        <Button onClick={() => onShowNotificationClicked()}>Show Toast</Button>
  </header>*/}


      </div>
    </Router>
    <DlgFactory/>
    </StateProvider>
    </ThemeProvider>
  );
};

export default App;

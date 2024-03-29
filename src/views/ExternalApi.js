import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { API_ROOT_URL } from "../utils/constants";
// use this instead: ... NOT WORKING WELL to ME
//https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production
export const ExternalApiComponent = () => {
  const { apiOrigin = "http://localhost:3001", audience} = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const [token, setToken] = useState('')
  
  useEffect(() => {
    async function fetchData() {
      let result = await axios.get(API_ROOT_URL+'auth/token');
      setToken(result.data);
    }
    fetchData();
  },[]);

  const {
    user,
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      //console.log(token);
      //var decoded = jwt_decode(token);
      //console.log(decoded);
      const response = await fetch(`https://localhost:8443/voxdomini/api/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  function getUsers() {
  
var options = {
  method: 'GET',
  url: 'https://bitalb.eu.auth0.com/api/v2/users',
  //params: {q: 'email:"jane@exampleco.com"', search_engine: 'v3'},
  headers: {authorization: 'Bearer '+token}
};

axios.request(options).then(function (response) {
  console.log(response.data);
  setState({
    ...state,
    showResult: true,
    apiMessage: response.data,
  });
  axios.post(API_ROOT_URL+'users', response.data).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
  
}).catch(function (error) {
  console.error(error);
});
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{paddingRight:50, paddingLeft:50}}>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>Admin</h1>

        <Button
          color="primary"
          className="mt-5"
          onClick={getUsers}
          disabled={!audience}
        >
          Sync with Auth0 users
        </Button>
      </div>

      <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Succesfully, results: </h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
      </Grid>
    </Grid>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});

import React, { Fragment, useState, useEffect } from "react";
import VoxScheduler from "../components/VoxScheduler";
import Resources from "./Resources";
import { useTheme, useMediaQuery } from '@material-ui/core';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";

function Planner() { 
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));
  return (

  <Fragment>
    {desktop && <VoxScheduler/>}
    {!desktop && <Resources/>}
  </Fragment>
)};

export default Planner;
/*export default withAuthenticationRequired(Planner, {
  onRedirecting: () => <Loading />,
});*/

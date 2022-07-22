import React, { Fragment } from "react";
import Container from '@mui/material/Container';
import Hero from "../components/Hero";

const Home = () => (
  <Container sx={{height:'10vh', paddingY:'10px'}}>
    <Hero />
  </Container>
);

export default Home;

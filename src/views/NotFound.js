import React, { Fragment } from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import {PERMLINK_ROOT_URL} from '../utils/constants';

const NotFound = (props) => (
  <Container sx={{height:'10vh', paddingY:'10px'}}>
        <img style={{
            maxWidth: '100%',
            height: 'auto',
            padding: 0,
            margin: 0
        }} src="404-not-found.png" />
        {/*props.location.state*/}
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
        >
        <Link href={PERMLINK_ROOT_URL}>go home</Link>
        </Box>
  </Container>
);

export default NotFound;

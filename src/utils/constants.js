export const API_ROOT_URL = process.env.NODE_ENV==='production'
            ?'https://voxdomini.bitalb.com/api/'
            :'https://localhost:8443/voxdomini/api/';

export const PERMLINK_ROOT_URL = process.env.NODE_ENV==='production'
            ?'https://voxdomini.bitalb.com/'
            :'http://localhost:3000/';
            
export const DATE_FORMAT = 'D MMM YYYY HH:mm';

export const SERVER_URL = process.env.NODE_ENV==='production'
            ?'voxdomini.bitalb.com'
            :'http://localhost';

export const SERVER_PORT = process.env.NODE_ENV==='production'
            ?8443
            :7777;

export const SOCKETIO_SERVER_PORT = process.env.NODE_ENV==='production'
            ?4000
            :4000;

export const SERVER_HOST = SERVER_URL+':'+SERVER_PORT;
export const SOCKETIO_SERVER_HOST = SERVER_URL+':'+SOCKETIO_SERVER_PORT;

const VAPID_PUBLIC_KEY = 'BOtHAUcXI9rp3ra9NFnbebt1BDl78oblSfEjRLXsJJCi1p6inmsnfrc3ZmNySvPInU81VGndibLD5QYd-rCeb50';
const VAPID_PRIVATE_KEY = '03yd8_-sLd4bS826QB-HjJg7Iwcijw_2mN8Y1YLhUBU';
const VAPID_SUBJECT = '';

export const vapidDetails = {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
    subject: VAPID_SUBJECT
  };
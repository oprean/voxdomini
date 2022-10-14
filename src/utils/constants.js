export const API_ROOT_URL = process.env.NODE_ENV==='production'
            ?'https://voxdomini.bitalb.ro/api/'
            :'https://localhost:8443/voxdomini/api/';

export const PERMLINK_ROOT_URL = process.env.NODE_ENV==='production'
            ?'https://voxdomini.bitalb.ro/'
            :'http://localhost:3000/';
            
export const DATE_FORMAT = 'D MMM YYYY HH:mm'
import * as handlers from './handlers';

let routes = [
  {
    method: 'GET',
    path: '/loop',
    handler: handlers.loop
  },
  //use field name 'file' while testing.
  {
  	method: 'POST',
    path: '/csv2json',
    handler: handlers.csvToJSON
  }
];

export default routes;

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
  },
  /*
  Each time a client make a req, this will send res (First res: 2, Sec res: 4, Third res: 8.....) after a certain delay
  (First req: 1s delay, Second req: 3s delay,
  Third req: 5s delay.....).
  Using client IP and saving it in redis as key after converting it to long int.
  Saving total number of reqs made from a particular IP as value of key.
  Each IP saved as key would auto expire after 5 min since the first req made to that IP.
  We can also get number of hits came from a particular IP, using IP add.

  Suppose if at exact same time two or more req is send to server from a particular IP, then the responses would not send back to 
  client at the same time, responses would send one after another since we are performing atomic operation on redis (i.e client.incr)
  key increment.

  It should work normally whether it is called by 10 clients or thousand of clients since nodejs is single threaded and code written 
  for this is non blocking, asynchronous.
  */
  {
    method: 'GET',
    path: '/dynamicdelay',
    handler: handlers.dynamicDelay
  }
];

export default routes;

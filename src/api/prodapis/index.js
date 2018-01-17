import * as handlers from './handlers';

let routes = [{
  method: 'GET',
  path: '/loop',
  handler: handlers.loop
}, {
  method: 'POST',
  path: '/csv2json',
  config: {
    payload: {
      output: "stream",
      parse: true,
      allow: 'multipart/form-data' // important
    },
    pre: [
      [{
        method: handlers.getTime,
        assign: 'timer'
      }, {
        method: handlers.doWork,
        assign: 'm1'
      }]
    ]
  },
  handler: handlers.csv2jsonHandler
}];

export default routes;

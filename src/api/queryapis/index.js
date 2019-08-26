import * as handlers from './handlers';

let routes = [
  {
  	method: 'POST',
  	path: '/savetodb',
  	handler: handlers.save
  },
  /* Since using compound indexes to reduce performance cost, fields in find query must be in a certain order
  (i.e "has_depositted", "wallet_balance", "number_of_deposits") to make indexes effective during find query. */
  {
  	method: 'GET',
  	path: '/fetchfromdb',
  	handler: handlers.fetch
  },
  {
    method: 'PUT',
    path: '/updatedb',
    handler: handlers.updateById
  },
  {
    method: 'DELETE',
    path: '/deletefromdb',
    handler: handlers.deleteById
  }
];

export default routes;


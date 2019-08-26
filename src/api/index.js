import testRoutes from './testapis'; 
import prodRoutes from './prodapis';
import queryRoutes from './queryapis'; 

let routes = [];
routes.push(testRoutes);
routes.push(prodRoutes);
routes.push(queryRoutes);

export default routes;
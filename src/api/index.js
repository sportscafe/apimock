import testRoutes from './testapis';
import prodRoutes from './prodapis';

let routes = [];
routes.push(testRoutes);

for (let i = 0; i < prodRoutes.length; i++) {
  routes.push(prodRoutes[i]);
}

export default routes;

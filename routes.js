const requireDirectory = require('require-directory');

module.exports = () => {
  const controller = requireDirectory(module, './controllers');
  // Array of routes for Hapi
  const routeTable = [{
    method: 'POST',
    path: '/guide/new',
    config: controller.guide.index,
  }, {
    method: 'GET',
    path: '/guides',
    config: controller.guides.index,
  }];
  return routeTable;
};

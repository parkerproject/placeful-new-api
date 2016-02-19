var requireDirectory = require('require-directory')

module.exports = function (server) {
  var controller = requireDirectory(module, './controllers')

  // Array of routes for Hapi
  var routeTable = [{
    method: 'GET',
    path: '/images/{path*}',
    config: controller.assets.images
  }, {
    method: 'GET',
    path: '/css/{path*}',
    config: controller.assets.css
  }, {
    method: 'GET',
    path: '/js/{path*}',
    config: controller.assets.js
  }, {
    method: 'GET',
    path: '/video/{path*}',
    config: controller.assets.video
  }, {
    method: 'GET',
    path: '/promotions',
    config: controller.promotions.index
  }]
  return routeTable
}
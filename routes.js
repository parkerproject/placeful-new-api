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
  }, {
    method: 'POST',
    path: '/guide/like/add',
    config: controller.guide_like.index,
  }, {
    method: 'POST',
    path: '/guide/like/remove',
    config: controller.guide_unlike.index,
  },
    {
      method: 'GET',
      path: '/user/guides',
      config: controller.user_guides.index,
    }, {
      method: 'GET',
      path: '/user/likes',
      config: controller.user_likes.index,
    }];
  return routeTable;
};

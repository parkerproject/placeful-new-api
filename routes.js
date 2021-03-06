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
    method: 'GET',
    path: '/guides/new',
    config: controller.new_guides.index,
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
    }, {
      method: 'POST',
      path: '/guide/delete',
      config: controller.guide_delete.index,
    }, {
      method: 'POST',
      path: '/guide/update',
      config: controller.guide_update.index,
    }, {
      method: 'GET',
      path: '/fb',
      config: controller.facebook_places.index,
    }, {
      method: 'GET',
      path: '/yelp/phone',
      config: controller.yelp.index,
    }, {
      method: 'GET',
      path: '/week/places',
      config: controller.places_of_week.index,
    }];
  return routeTable;
};

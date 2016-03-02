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
  }, {
        method: 'GET',
        path: '/promotion',
        config: controller.promotion.index
  }, {
        method: 'PUT',
        path: '/promotion/like',
        config: controller.promotion_like.index
  }, {
        method: 'GET',
        path: '/places',
        config: controller.places.index
  }, {
        method: 'GET',
        path: '/place',
        config: controller.place.index
  }, {
        method: 'GET',
        path: '/place/promotions',
        config: controller.place_promotions.index
  }, {
        method: 'PUT',
        path: '/place/follow',
        config: controller.follow.index
  }, {
        method: 'DELETE',
        path: '/place/unfollow',
        config: controller.unfollow.index
  }, {
        method: 'GET',
        path: '/interests',
        config: controller.interests.index
  }, {
        method: 'PUT',
        path: '/interests/user',
        config: controller.interests_user.index
  }, {
        method: 'GET',
        path: '/user/places',
        config: controller.user_places.index
  }, {
        method: 'GET',
        path: '/user/likes',
        config: controller.user_likes.index
  }]
    return routeTable
}
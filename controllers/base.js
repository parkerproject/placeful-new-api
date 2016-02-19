require('dotenv').load()

module.exports = {
  index: {
    handler: function (request, reply) {
      reply.view('index', {})
    },
    app: {
      name: 'homepage'
    }

  }

}
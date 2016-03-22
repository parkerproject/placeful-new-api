'use strict'
require('dotenv').load()
const sendEmail = require('./send_email')
const swig = require('swig')
const Joi = require('joi')

module.exports = {
  welcome: {
    handler: (request, reply) => {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      let subject = 'Welcome to Placeful'
      let email = request.payload.email

      swig.renderFile(appRoot + '/views/welcome_email.html', {
        name: request.payload.name,
        email: email
      },
        function (err, content) {
          if (err) {
            throw err
          }
          sendEmail(email, subject, content)
          reply('Email sent')
        })

    },
    description: 'welcome email',
    notes: 'welcome email',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        name: Joi.string().required().description('name of user'),
        email: Joi.string().required().description('email of user')
      }
    }
  }
}

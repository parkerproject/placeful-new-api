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
      }, function (err, content) {
        if (err) {
          throw err
        }
        sendEmail(email, subject, content)
        reply({
          message: 'Email sent'
        })
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
  },
  ticket: {
    handler: (request, reply) => {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }
      let subject = 'You joined a ticket'
      let email = request.payload.email
      console.log(request.payload)
      swig.renderFile(appRoot + '/views/ticket.html', {
        data: request.payload
      }, function (err, content) {
        if (err) {
          throw err
        }
        sendEmail(email, subject, content)
        reply({
          message: 'Email sent'
        })
      })
    },
    description: 'ticket email',
    notes: 'ticket email',
    tags: ['api'],
    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        email: Joi.string().required().description('email of user'),
        ticket_id: Joi.string().required().description('id of ticket'),
        title: Joi.string().required().description('title of ticket'),
        name: Joi.string().required().description('name of user on ticket'),
        date: Joi.string().required().description('date on ticket'),
        address: Joi.string().required().description('address on ticket'),
        fine_print: Joi.string().required().description('fine details on ticket')
      }
    }
  }
}

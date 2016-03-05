'use strict'
require('dotenv').load()

const Yelp = require('yelp')
const yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
})

module.exports = (phone, cb) => {
  let cleanPhone = phone.replace(/[^A-Z0-9]/ig, '')

  new Promise((resolve) => {

    yelp.phoneSearch({
      phone: cleanPhone
    }, (error, data) => {
      if (error) console.log(error)
      if (data.businesses[0] != null) {
        yelp.business(data.businesses[0].id, (err, data) => {
          if (err) console.log(error)
          resolve(data.reviews[0])
        })
      }
    })

  }).then((res) => {
    cb(res)
  })

}
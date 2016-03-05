'use strict'
require('dotenv').load()

const qs = require('querystring')
const request = require('request')
const baseUrl = 'https://api.foursquare.com/v2/venues/search?'

module.exports = function (merchant, cb) {
  let url = baseUrl + qs.stringify({
    client_id: process.env.FOURSQUARE_CLIENTIDKEY,
    client_secret: process.env.FOURSQUARE_CLIENTSECRETKEY,
    v: '20140806',
    intent: 'global',
    query: merchant
  })

  new Promise((resolve) => {

    request(url, (error, response, body) => {
      if (error) console.log(error)
      if (!error && response.statusCode == 200) {
        if (JSON.parse(body).response.venues[0] != null) {
          let venueId = JSON.parse(body).response.venues[0].id

          let tipsUrl = `https://api.foursquare.com/v2/venues/${venueId}/tips?`

          tipsUrl = tipsUrl + qs.stringify({
            client_id: process.env.FOURSQUARE_CLIENTIDKEY,
            client_secret: process.env.FOURSQUARE_CLIENTSECRETKEY,
            v: '20140806',
            sort: 'popular',
            limit: '5'
          })

          request(tipsUrl, (error, response, body) => {
            if (error) console.log(error)
            if (!error && response.statusCode == 200) {
              let tips = JSON.parse(body).response.tips.items
              resolve(tips) // Show the HTML for the Google homepage.
            }
          })

        } else {
          resolve()
        }

      }
    })

  }).then((res) => {
    cb(res)
  })

}
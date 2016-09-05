const zomato = require('zomato')
const client = zomato.createClient({
  userKey: process.env.ZOMATO_API_TOKEN
})

exports.search = function (obj, callback) {
  client.search({
    city_id: obj.id,
    lat: obj.lat,
    lon: obj.lon
  }, function (err, result) {
    if (!err) {
      callback(result)
    }else {
      console.log(err)
    }
  })
}

const axios = require('axios')

const BASE_URL = 'https://developers.zomato.com/api/v2.1/search?';
const KEY = process.env.ZOMATO_API_TOKEN;

exports.search = function (obj, callback) {

    axios.get(`${BASE_URL}lon=${obj.lon}&lat=${obj.lat}`, { headers: {'user-key': KEY} })
    .then(response => {
      callback(response.data);
    })
    .catch(err => console.log(err));
}

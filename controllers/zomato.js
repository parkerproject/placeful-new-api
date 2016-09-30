const axios = require('axios');

const BASE_URL = 'https://developers.zomato.com/api/v2.1';
const KEY = process.env.ZOMATO_API_TOKEN;

exports.search = (obj, callback) => {
  axios.get(`${BASE_URL}/search?lon=${obj.lon}&lat=${obj.lat}`,
  { headers: { 'user-key': KEY } })
    .then(response => {
      callback(response.data);
    })
    .catch(err => console.log(err));
};

exports.collection = (obj, callback) => {
  axios.get(`${BASE_URL}/collections?lon=${obj.lon}&lat=${obj.lat}`,
  { headers: { 'user-key': KEY } })
    .then(response => {
      callback(response.data);
    })
    .catch(err => console.log(err));
};

exports.collectionSearch = (obj, callback) => {
  const { count, lat, lon, cId } = obj;
  axios.get(`${BASE_URL}/search?collection_id=${cId}&count=${count}&lon=${lon}&lat=${lat}`,
  { headers: { 'user-key': KEY } })
    .then(response => {
      callback(response.data);
    })
    .catch(err => console.log(err));
};

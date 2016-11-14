require('dotenv').load();
const mongojs = require('mongojs');

const collections = ['merchants',
'promotions',
'redeemed_promotions',
'followers_promotions',
'interests',
'notifications',
'tickets',
'treck',
];

const db = mongojs(process.env.MONGODB_URL, collections);

module.exports = db;

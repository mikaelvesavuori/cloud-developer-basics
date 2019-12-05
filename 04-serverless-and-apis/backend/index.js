'use strict';

const server = require('./api/api');

const functions = require('firebase-functions');
const f = functions.region('europe-west1').https;
const api = f.onRequest(server);

module.exports = { api };

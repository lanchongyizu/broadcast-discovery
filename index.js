'use strict';

var Server = require('./lib/server.js');
var express = require('express');
var config = require('./config.js');
var cache = require('./lib/cache.js');

var udpPort = config.udpPort || 5000;
var server = new Server(udpPort, config.sharedKey);
server.start();
console.log("server started at port " + udpPort);

var app = express();
app.get('/', function(req, res) {
    res.send(cache.getAll());
});

var httpPort = config.httpPort || 3000;
app.listen(httpPort);
console.log('app started at port ' + httpPort);

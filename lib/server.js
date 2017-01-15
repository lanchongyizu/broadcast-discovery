'use strict';

var dgram = require('dgram');
var os = require('os');
var _ = require('lodash');
var util = require('./util.js');
var messageHandler = require('./message-handler.js');
var encrytption = require('./encryption.js');

function Server(port, key) {
    this.server = dgram.createSocket('udp4');
    this.port = port;
    this.key = key;
}

Server.prototype._getIpv4LL = function() {
    var self = this;
    var ipv4ll = undefined;
    var nics = os.networkInterfaces();
    _.forEach(nics, function(nic) {
        _.forEach(nic, function(ipv) {
            if(util.isIpv4LL(ipv.address)) {
                ipv4ll = ipv;
            }
        });
    });
    return ipv4ll;
};

Server.prototype.broadcast = function(msg) {
    var self = this;
    var encrypted = encrytption.encrypt(msg, self.key);
    self.server.send(encrypted, 0, encrypted.length,
                     self.port,'169.254.255.255', function(err) {
                         if(err) {
                             console.log('Error sending message: ' + err);
                         }
                     });
};

Server.prototype.start = function() {
    var self = this;

    self.server.on('message', function(msg, rinfo) {
        var decrypted = encrytption.decrypt(msg.toString(), self.key);
        var ipv = self._getIpv4LL();
        if( ipv && util.isIpv4LL(rinfo.address)) {
            console.log('Received %d bytes message from %s:%d.',
                        msg.length, rinfo.address, rinfo.port);
            if(_.isEqual(ipv.address, rinfo.address)) {
                messageHandler.handleLocalMsg(decrypted, self.broadcast.bind(self), ipv);
            } else {
                messageHandler.handleRemoteMsg(decrypted, self.broadcast.bind(self), ipv);
            }
        }
    });

    self.server.on('error', function(err) {
        console.log(err);
        process.nextTick(function() {
            process.exit(1);
        });
    });

    self.server.bind(self.port, '0.0.0.0', function() {
        self.server.setBroadcast(true);
    });
};

Server.prototype.stop = function() {
    this.server.close();
    this.server.removeAllListeners();
};

module.exports = Server;

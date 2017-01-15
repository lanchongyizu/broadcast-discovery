'use strict';

var _ = require('lodash');
var util = require('./util.js');
var cache = require('./cache.js');

function MessageHandler() {
}

//CLAIM -> UPDATE|ip|mac
MessageHandler.prototype.handleLocalMsg = function(msg, sendCallback, ipv) {
    var self = this;
    var msgString = msg.toString();
    if(_.startsWith(msgString, 'CLAIM')) {
        cache.update(ipv.mac, ipv.address);
        sendCallback('UPDATE|'+ipv.address+'|'+ipv.mac);
        console.log('send UPDATE');
    }
};

//UPDATE|ip|mac -> ACK|ip|mac
//ACK|ip|mac
MessageHandler.prototype.handleRemoteMsg = function(msg, sendCallback, ipv) {
    var self = this;
    var msgString = msg.toString();
    var command = msgString.split('|');
    if(command.length === 3 && util.isIpv4LL(command[1])) {
       if(_.isEqual(command[0], 'UPDATE')) {
           cache.update(command[2], command[1]);
           sendCallback('ACK|'+ipv.address+'|'+ipv.mac);
           console.log('send ACK');
        } else if(_.isEqual(command[0], 'ACK')){
           cache.update(command[2], command[1]);
           console.log('receive ACK');
        }
    }
};

module.exports = new MessageHandler;

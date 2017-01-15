'use strict';

var net = require('net');
var _ = require('lodash');

function Util() {
}

Util.prototype.isIpv4LL = function(addr) {
    return net.isIPv4(addr) && _.startsWith(addr, '169.254')
};

module.exports = new Util;

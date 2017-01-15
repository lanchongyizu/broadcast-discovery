'use strict';

function Cache() {
    this.cache = {};
}

Cache.prototype.update = function(mac, ip) {
    this.cache[mac] = ip;
};

Cache.prototype.getAll = function() {
    return this.cache;
}

module.exports = new Cache;

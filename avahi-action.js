var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var encryption = require('./lib/encryption.js');
var config = require('./config.js');

console.log(process.argv);

var destIP = 'localhost';
if(process.argv.length > 2) {
    destIP = process.argv[2];
}

var encrypted = encryption.encrypt('CLAIM', config.sharedKey);
client.send(encrypted, 0, encrypted.length, 5000,
            destIP, function(err) {
                if (err) {
                    console.log(err);
                }
                client.close();
            });

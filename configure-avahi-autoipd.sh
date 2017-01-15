#!/bin/bash

route add -net 169.254.0.0 netmask 255.255.0.0 dev $1 metric 99
route add default dev $1 metric 99
cp avahi-autoipd.action /etc/avahi/avahi-autoipd.action
avahi-autoipd -D $1

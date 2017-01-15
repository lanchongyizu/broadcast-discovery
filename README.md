# broadcast-discovery

## Requirement

* node.js v4.6.2+
* avahi-autoipd
* openssl

## Quick start

```
cd ~
git clone https://github.com/lanchongyizu/broadcast-discovery.git
cd broadcast-discovery
npm install
node index.js &
```

## Configure avahi-autoipd with script

Use the NIC name connected the local LAN to replace to `eth0`

```
sudo ./configure-avahi-autoipd.sh eth0
```

## Query all nodes

```
curl localhost:3000
```

## Configure avahi-autoipd manually

Edit `/etc/avahi/avahi-autoipd.action`
Change

```
        BIND)
            ip addr add "$3"/16 brd 169.254.255.255 label "$2:avahi" scope link dev "$2"
            ip route add default dev "$2" metric "$METRIC" scope link ||:
            ;;
```

To

```
        BIND)
            ip addr add "$3"/16 brd 169.254.255.255 label "$2:avahi" scope link dev "$2"
            ip route add default dev "$2" metric "$METRIC" scope link ||:
            node ~/broadcast-discovery/avahi-action.js "$3"
            ;;
```

And change

```
        BIND)
            ifconfig "$2:avahi" inet "$3" netmask 255.255.0.0 broadcast 169.254.255.255 up
            route add default dev "$2:avahi" metric "$METRIC" ||:
            ;;
```

To

```
        BIND)
            ifconfig "$2:avahi" inet "$3" netmask 255.255.0.0 broadcast 169.254.255.255 up
            route add default dev "$2:avahi" metric "$METRIC" ||:
            node ~/broadcast-discovery/avahi-action.js "$3"
            ;;
```

Use the NIC name connected the local LAN to replace to `eth0`

```
sudo avahi-autoipd -D eth0
```

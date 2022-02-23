# Port forwarding

## Add routing

```
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.122.203:80
sudo iptables -t nat -A POSTROUTING -p tcp --dport 22 -d 192.168.122.203 -j SNAT --to 192.168.122.1
# for local connection
sudo iptables -t nat -A OUTPUT -p tcp --dport 8080 -j DNAT --to 192.168.122.203:80
```

## Delete reject stuff

```
sudo iptables -D FORWARD 5 -t filter
```
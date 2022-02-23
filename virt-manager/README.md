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

## To see changes

```
sudo iptables -nL -v --line-numbers -t nat
sudo iptables -nL -v --line-numbers -t filter
```

## To make ip static
List and edit xml:
```
virsh net-list
virsh net-dumpxml default
virsh net-edit default
```
Edit xml by adding after `<range/>`: 
```
<host mac='52:54:00:e2:95:c6' name='VM_NAME' ip='192.168.111.36'/>
```
Restart:
```
virsh net-destroy xhubnet
virsh net-start xhubnet
```
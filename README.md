# promisified-dbus-native

Promisified [dbus-native](https://github.com/sidorares/dbus-native)

```
const dbus = require('promisified-dbus-native');

dbus.systemBus()
  .getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable')
  .then(iface => iface.Introspect())
  .then(result => console.log(result));
```

# install
```
npm install promisified-dbus-native
```

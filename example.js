const dbus = require('./');

dbus.systemBus()
  .getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable')
  .then(iface => iface.Introspect())
  .then(result => console.log(result));

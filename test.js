const dbus = require('./');

(async function() {
  const bus = dbus.systemBus();
  const service = await bus.getService('org.freedesktop.DBus');
  let obj = await service.getObject('/org/freedesktop/DBus');
  let iface = await obj.as('org.freedesktop.DBus.Introspectable');
  let result = await iface.Introspect();
  console.log(result);

  obj = await bus.getObject('org.freedesktop.DBus', '/org/freedesktop/DBus');
  iface = await bus.getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable');
  result = await iface.Introspect();
  console.log(result);
})();

const dbus = require('./');

(async function() {
  const bus = dbus.systemBus();
  const service = await bus.getService('org.freedesktop.DBus');
  const obj = await service.getObject('/org/freedesktop/DBus');
  const iface = await obj.as('org.freedesktop.DBus.Introspectable');
  const result = await iface.Introspect();
  console.log(result);
})();


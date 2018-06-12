const dbus = require('./');

(async function() {
  const bus = dbus.systemBus();
  //console.log(bus);

  const service = await bus.getService('org.freedesktop.DBus');
  //console.log(service);

  const obj = await service.getObject('/org/freedesktop/DBus');
  //console.log(obj);

  const iface = await obj.as('org.freedesktop.DBus.Introspectable');
  console.log(iface);

  const result = await iface.Introspect();
  console.log(result);
})();


const assert = require('assert');
const dbus = require('./');
const originalDbus = require('dbus-native');

function introspect0() {
  return new Promise((resolve, reject) => {
    originalDbus.systemBus().getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable', (err, iface) => {
      err ? reject(err) : iface.Introspect((err, result) => {
        err ? reject(err) : resolve(result);
      })
    });
  });
}

function introspect1() {
  return dbus.systemBus()
    .getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable')
    .then(iface => iface.Introspect())
}

async function introspect2() {
  const bus = dbus.systemBus();
  const service = bus.getService('org.freedesktop.DBus');
  const obj = await service.getObject('/org/freedesktop/DBus');
  const iface = obj.as('org.freedesktop.DBus.Introspectable');
  const result = await iface.Introspect();
  return result;
}

async function introspect3() {
  const bus = dbus.systemBus();
  const obj = await bus.getObject('org.freedesktop.DBus', '/org/freedesktop/DBus');
  const iface = await bus.getInterface('org.freedesktop.DBus', '/org/freedesktop/DBus', 'org.freedesktop.DBus.Introspectable');
  const result = await iface.Introspect();
  return result;
}

async function run() {
  const expected = await introspect0();
  let [actual1] = await introspect1();
  assert.strictEqual(expected, actual1);
  let [actual2] = await introspect2();
  assert.strictEqual(expected, actual2);
  let [actual3] = await introspect3();
  assert.strictEqual(expected, actual3);
  console.log('ok');
}

run();

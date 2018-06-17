'use strict';

const dbus = require('dbus-native');

function promisify(iface, methodName) {
  const method = iface[methodName];
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...result) => {
        err ? reject(err) : resolve(result);
      });
      method.apply(iface, args);
    });
  }
}

function promisifyInterface(iface) {
  for (let name in iface) {
    switch (name) {
    case 'on':
    case 'addListener':
    case 'removeListener':
      break;
    default:
      iface[name] = promisify(iface, name);
      break;
    }
  }
  return iface;
}

function promisifyObject(obj) {
  obj._promisifiedInterface = {};
  obj.as = function(name) {
    if (!(name in this._promisifiedInterface)) {
      return this._promisifiedInterface[name] = promisifyInterface(this.proxy[name]);
    }
    return this._promisifiedInterface[name];
  }
  return obj;
}

const createClient = dbus.createClient;
dbus.createClient = function() {
  const bus = createClient.apply(dbus, arguments);

  const getService = bus.getService;
  bus.getService = function(name) {
    const service = getService.call(bus, name);
    const getObject = service.getObject;
    service.getObject = function(name, callback) {
      if (typeof callback !== 'undefined') {
        return getObject.call(service, name, callback);
      }
      return new Promise((resolve, reject) => {
        getObject.call(service, name, (err, obj) => {
          err ? reject(err) : resolve(promisifyObject(obj));
        });
      });
    }
    return service;
  }

  const getObject = bus.getObject;
  bus.getObject = function(path, name, callback) {
    if (typeof callback !== 'undefined') {
      return getObject.apply(bus, arguments);
    } else {
      return bus.getService(path).getObject(name);
    }
  }

  const getInterface = bus.getInterface;
  bus.getInterface = function(path, objname, name, callback) {
    if (typeof callback !== 'undefined') {
      return getInterface.apply(bus, arguments);
    } else {
      return new Promise((resolve, reject) => {
        bus.getService(path).getObject(objname)
          .then(obj => resolve(obj.as(name)))
          .catch(reject);
      });
    }
  }

  return bus;
}

module.exports = dbus;

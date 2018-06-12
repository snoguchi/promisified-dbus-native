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
  const promisified = {};
  obj.as = function(name) {
    promisified[name] = promisified[name] || promisifyInterface(this.proxy[name]);
    return promisified[name];
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
      if (typeof callback === 'undefined') {
        return new Promise((resolve, reject) => {
          getObject.call(service, name, (err, obj) => {
            err ? reject(err) : resolve(promisifyObject(obj));
          });
        });
      } else {
        return getObject.call(service, name, callback);
      }
    }
    return service;
  }

  return bus;
}

module.exports = dbus;

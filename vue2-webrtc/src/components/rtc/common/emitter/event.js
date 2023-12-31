import logger from '../logger';
export {
  UIEvents,
  RtcCoreEvents,
  RtcDeviceServiceEvents,
} from './eventTypes';

// 事件发布订阅
class Event {
  stores = null;

  static instance = null;

  static getInstance() {
    if (!Event.instance) {
      Event.instance = new Event();
    }
    return Event.instance;
  }

  on(event, fn, ctx) {
    if (typeof fn !== 'function') {
      logger.error('listener must be a function');
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    this.stores = this.stores || {};
    // eslint-disable-next-line no-underscore-dangle
    (this.stores[event] = this.stores[event] || []).push({cb: fn, ctx});
  }

  emit(event, data) {
    this.stores = this.stores || {};
    let store = this.stores[event];
    const args = [];

    if (store) {
      store = store.slice(0);
      // args = [].slice.call(arguments, 1),
      args[0] = data;

      // eslint-disable-next-line no-plusplus
      for (let i = 0, len = store.length; i < len; i++) {
        store[i].cb.apply(store[i].ctx, args);
      }
    }
  }

  off(event, fn) {
    this.stores = this.stores || {};

    // all
    if (!event) {
      this.stores = {};
      return;
    }

    // specific event
    const store = this.stores[event];
    if (!store) {
      return;
    }

    // remove all handlers
    if (!fn) {
      delete this.stores[event];
      return;
    }

    // remove specific handler
    let cb;
    for (let i = 0, len = store.length; i < len; i++) {
      cb = store[i].cb;
      if (cb === fn) {
        store.splice(i, 1);
        break;
      }
    }
  }
}

export default Event.getInstance();

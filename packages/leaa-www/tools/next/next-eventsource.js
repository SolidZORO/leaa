/* eslint-disable */
'use strict';
exports.__esModule = true;
exports.getEventSourceWrapper = getEventSourceWrapper;
const eventCallbacks = [];

function EventSourceWrapper(options) {
  let source;
  let lastActivity = new Date();
  let listeners = [];
  if (!options.timeout) {
    options.timeout = 20 * 1000;
  }

  init();
  let timer = setInterval(function() {
    if (new Date() - lastActivity > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log('[HMR] connected');
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }

    if (event.data.indexOf('action') !== -1) {
      // ⚠️ fixed wechat HMR (replace mod eventsource.js)
      if (typeof window !== 'undefined' && /micromessenger/.test(window.navigator.userAgent.toLowerCase())) {
        return;
      }

      eventCallbacks.forEach(cb => cb(event));
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    close: () => {
      clearTimeout(timer);
      source.close();
    },
    addMessageListener: function addMessageListener(fn) {
      listeners.push(fn);
    },
  };
}

function getEventSourceWrapper(options) {
  if (!options.ondemand) {
    return {
      addMessageListener: cb => {
        eventCallbacks.push(cb);
      },
    };
  }
  return EventSourceWrapper(options);
}

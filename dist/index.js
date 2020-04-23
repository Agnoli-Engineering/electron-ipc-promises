"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _electron = _interopRequireDefault(require("electron"));

var _getInstance = _interopRequireDefault(require("./getInstance.js"));

var _getRandomString = _interopRequireDefault(require("./util/getRandomString.js"));

var _isMainProcess = _interopRequireDefault(require("./util/isMainProcess.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Table where the Promise resolve functions
 * are stored.
 */
var table = {};
/**
 * getInstance() automatically returns the
 * correct ipc instance for the calling process (main or renderer).
 *
 * This event handler is automatically installed:
 * It runs the corresponding Promise resolve function when a
 * `message-received` event is received.
 */

(0, _getInstance["default"])().on("message-received", function (_, ctx) {
  var msgId = ctx.msgId;
  var payload = ctx.payload;

  if (msgId in table) {
    var resolve = table[msgId];
    delete table[msgId];
    resolve(payload);
  } else {
    console.warn("Cannot locate resolve function for msgId = " + msgId);
  }
});
/**
 * Make send() return a Promise.
 * Save the Promise resolve function in `table` to
 * call it later when `message-received` is received.
 */

var patched_send = function patched_send(sendFn, channel, payload) {
  return new Promise(function (resolve) {
    var msgId = (0, _getRandomString["default"])();
    table[msgId] = resolve;
    sendFn(channel, {
      msgId: msgId,
      payload: payload
    });
  });
};
/**
 * Make .on() automatically send `message-received` to
 * sender after handler `fn` was run.
 */


var registered_channels = {};

var patched_on = function patched_on(channel, fn) {
  if (channel in registered_channels) {
    throw new Error("Cannot register more than one handler per channel. " + "Channel = " + channel);
    return;
  }

  registered_channels[channel] = 1;
  (0, _getInstance["default"])().on(channel, function (e, data) {
    var msgId = data.msgId;

    var reply = function reply(payload) {
      e.sender.send("message-received", {
        msgId: msgId,
        payload: payload
      });
    };

    var response = fn(data.payload);

    if (response instanceof Promise) {
      response.then(reply);
    } else {
      reply(response);
    }
  });
};

var obj_main = {
  on: patched_on,
  send: function send(win, channel, data) {
    return patched_send(function () {
      var _win$webContents;

      (_win$webContents = win.webContents).send.apply(_win$webContents, arguments);
    }, channel, data);
  },
  broadcast: function broadcast(windows, channel, data) {
    return Promise.all(windows.map(function (win) {
      return patched_send(function () {
        var _win$webContents2;

        (_win$webContents2 = win.webContents).send.apply(_win$webContents2, arguments);
      }, channel, data);
    }));
  }
};
var obj_renderer = {
  on: patched_on,
  send: function send(channel, data) {
    return patched_send(_electron["default"].ipcRenderer.send, channel, data);
  }
};
var obj = {};
Object.defineProperty(obj, "main", {
  get: function get() {
    if (!(0, _isMainProcess["default"])()) {
      throw new Error("ipc.main can only be accessed in the main process.");
    }

    return obj_main;
  }
});
Object.defineProperty(obj, "renderer", {
  get: function get() {
    if ((0, _isMainProcess["default"])()) {
      throw new Error("ipc.renderer can only be accessed in a renderer process.");
    }

    return obj_renderer;
  }
});
var _default = obj;
exports["default"] = _default;
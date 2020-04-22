"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _electron = _interopRequireDefault(require("electron"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  _name: "renderer",
  on: function on(channel, fn) {
    _electron["default"].ipcRenderer.on(channel, fn);
  },
  send: function send(channel, data) {
    _electron["default"].ipcRenderer.send(channel, data);
  }
};
exports["default"] = _default;
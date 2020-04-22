"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _isMainProcess = _interopRequireDefault(require("./util/isMainProcess.js"));

var _main = _interopRequireDefault(require("./main.js"));

var _renderer = _interopRequireDefault(require("./renderer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default() {
  return (0, _isMainProcess["default"])() ? _main["default"] : _renderer["default"];
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  var ret = "";

  for (var i = 0; i < 4; ++i) {
    ret += Math.random().toString(32).substr(2);
  }

  return ret;
}
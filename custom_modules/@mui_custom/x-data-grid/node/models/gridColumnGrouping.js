"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLeaf = isLeaf;
function isLeaf(node) {
  return node.field !== undefined;
}

/**
 * A function used to process headerClassName params.
 */
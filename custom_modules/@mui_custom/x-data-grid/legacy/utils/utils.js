import _typeof from "@babel/runtime/helpers/esm/typeof";
export function isNumber(value) {
  return typeof value === 'number';
}
export function isFunction(value) {
  return typeof value === 'function';
}
export function isObject(value) {
  return _typeof(value) === 'object' && value !== null;
}
export function localStorageAvailable() {
  try {
    // Incognito mode might reject access to the localStorage for security reasons.
    // window isn't defined on Node.js
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    var key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}
export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Follows the CSS specification behavior for min and max
 * If min > max, then the min have priority
 */
export var clamp = function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
};

/**
 * Based on `fast-deep-equal`
 *
 *  MIT License
 *
 * Copyright (c) 2017 Evgeny Poberezkin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * We only type the public interface to avoid dozens of `as` in the function.
 */

export function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a && b && _typeof(a) === 'object' && _typeof(b) === 'object') {
    if (a.constructor !== b.constructor) {
      return false;
    }
    if (Array.isArray(a)) {
      var _length = a.length;
      if (_length !== b.length) {
        return false;
      }
      for (var i = 0; i < _length; i += 1) {
        if (!isDeepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) {
        return false;
      }
      var entriesA = Array.from(a.entries());
      for (var _i = 0; _i < entriesA.length; _i += 1) {
        if (!b.has(entriesA[_i][0])) {
          return false;
        }
      }
      for (var _i2 = 0; _i2 < entriesA.length; _i2 += 1) {
        var entryA = entriesA[_i2];
        if (!isDeepEqual(entryA[1], b.get(entryA[0]))) {
          return false;
        }
      }
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) {
        return false;
      }
      var entries = Array.from(a.entries());
      for (var _i3 = 0; _i3 < entries.length; _i3 += 1) {
        if (!b.has(entries[_i3][0])) {
          return false;
        }
      }
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      var _length2 = a.length;
      if (_length2 !== b.length) {
        return false;
      }
      for (var _i4 = 0; _i4 < _length2; _i4 += 1) {
        if (a[_i4] !== b[_i4]) {
          return false;
        }
      }
      return true;
    }
    if (a.constructor === RegExp) {
      return a.source === b.source && a.flags === b.flags;
    }
    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf();
    }
    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString();
    }
    var keys = Object.keys(a);
    var length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (var _i5 = 0; _i5 < length; _i5 += 1) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[_i5])) {
        return false;
      }
    }
    for (var _i6 = 0; _i6 < length; _i6 += 1) {
      var key = keys[_i6];
      if (!isDeepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  // true if both NaN, false otherwise
  // eslint-disable-next-line no-self-compare
  return a !== a && b !== b;
}

// Pseudo random number. See https://stackoverflow.com/a/47593316
function mulberry32(a) {
  return function () {
    /* eslint-disable */
    var t = a += 0x6d2b79f5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
    /* eslint-enable */
  };
}

export function randomNumberBetween(seed, min, max) {
  var random = mulberry32(seed);
  return function () {
    return min + (max - min) * random();
  };
}
export function deepClone(obj) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}
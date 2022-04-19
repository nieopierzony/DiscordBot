'use strict';

module.exports = async (fn, ...args) => {
  try {
    return [null, await fn(...args)];
  } catch (err) {
    return [err, null];
  }
};

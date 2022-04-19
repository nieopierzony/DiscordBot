'use strict';

const http = require('node:http');
const https = require('node:https');
const tryFunction = require('./util/tryFunction');

const makeRequestOptions = (url, options = {}) => {
  const { hostname, port, pathname, search } = new URL(url);
  const path = `${pathname}${search}`;
  const { method = 'GET', headers = {} } = options;
  const result = { hostname, port, path, method, headers };
  if (options.body) {
    result.body = JSON.stringify(options.body);
    result.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(result.body),
      ...headers,
    };
  }
  return result;
};

const fetch = (url, options = {}) => {
  const transport = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const requestOptions = makeRequestOptions(url, options);
    const req = transport.request(requestOptions, async (res) => {
      const code = res.statusCode;
      if (code >= 400) return reject(new Error(`HTTP status code ${code}`));
      res.on('error', reject);
      const chunks = [];
      for await (const chunk of res) chunks.push(chunk);
      const rawResponse = Buffer.concat(chunks).toString();
      const [err, json] = tryFunction(() => JSON.parse(rawResponse));
      if (err) return resolve(rawResponse);
      return resolve(json);
    });
    if (requestOptions.body) req.write(requestOptions.body);
    req.end();
  });
};

module.exports = { fetch, makeRequestOptions };

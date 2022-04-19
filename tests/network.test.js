'use strict';

const metatests = require('metatests');
const network = require('../src/util/network');

const API_EXCHANGE = {
  host: 'openexchangerates.org',
  path: '/api/latest.json?app_id=',
  key: '1f43ea96b1e343fe94333dd2b97a109d',
};

const POST_TEST = {
  host: 'httpbin.org',
  path: '/anything',
};

const getRate = async (currency) => {
  const { host, path, key } = API_EXCHANGE;
  const url = `https://${host}/${path}${key}`;
  const data = await network.fetch(url);
  const rate = data.rates[currency];
  return rate;
};

const getRequestInfo = async (options) => {
  const { host, path } = POST_TEST;
  const url = `https://${host}${path}`;
  const data = await network.fetch(url, options);
  return data;
};

metatests.test('makeRequestOptions', (test) => {
  const googleSearchURL = 'https://google.com/search?q=metautil';
  const googleRequestOptions = network.makeRequestOptions(googleSearchURL);
  test.strictEqual(googleRequestOptions, {
    hostname: 'google.com',
    port: '',
    path: '/search?q=metautil',
    method: 'GET',
    headers: {},
  });

  const postURL = 'http://example.com/json?lang=ru';
  const options = { method: 'POST', body: { a: 1 }, headers: { Test: 'test' } };
  const postRequestOptions = network.makeRequestOptions(postURL, options);
  test.strictEqual(postRequestOptions, {
    hostname: 'example.com',
    port: '',
    path: '/json?lang=ru',
    method: 'POST',
    body: '{"a":1}',
    headers: {
      Test: 'test',
      'Content-Type': 'application/json',
      'Content-Length': 7,
    },
  });
  test.end();
});

metatests.test('Fetch', async (test) => {
  const rate = await getRate('USD');
  test.strictSame(rate, 1);

  const method = 'POST';
  const body = { name: 'Aurelia', age: 43 };
  const headers = { Authorization: 'Bearer sometoken' };
  const res = await getRequestInfo({ headers, body, method });
  test.strictSame(res.method, method);
  test.strictSame(res.headers.Authorization, headers.Authorization);
  test.strictEqual(res.json, body);
  test.end();
});

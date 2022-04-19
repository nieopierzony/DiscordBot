'use strict';

const { fetch } = require('./network');
const tryFunction = require('./tryFunction');

const BASE_URL = 'https://zelinski.dev';
const PLAYERS_ENDPOINT = 'api/players.json';

let cache = {};
const CACHE_TTL = 10 * 60;

const getPlayers = async (force = false) => {
  const isCacheAlive = Date.now() - cache.updatedAt > CACHE_TTL;
  if (!force && isCacheAlive) return cache;
  const [err, data] = await tryFunction(fetch, `${BASE_URL}/${PLAYERS_ENDPOINT}`);
  if (err || data.updatedAt === cache?.updatedAt) return null;
  cache = data;
  return data;
};

const findPlayer = async (nickname) => {
  const online = await getPlayers();
  if (!online || Date.now() - online.updatedAt > CACHE_TTL) return null;
  return online.players.find((p) => p.nickname === nickname);
};

module.exports = { getPlayers, findPlayer };

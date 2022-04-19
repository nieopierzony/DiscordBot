'use strict';

const fs = require('node:fs');
const path = require('node:path');
const tryFunction = require('../util/tryFunction');

const EVENTS_PATH = path.join(__dirname, '../events');

module.exports = (client) => {
  console.log('\n[Events loader] Started loading events');
  const eventFileNames = fs.readdirSync(EVENTS_PATH).filter((fileName) => fileName.endsWith('.js'));
  for (const fileName of eventFileNames) {
    try {
      const event = require(`${EVENTS_PATH}/${fileName}`);
      if (!event?.type || !event?.method) throw new Error('Not all required parameters were provided');
      client[event?.once ? 'once' : 'on'](event.type, (...args) => tryFunction(event.method, client, ...args));
      console.log(`[Events loader] Event "${fileName}" was successful loaded`);
    } catch (err) {
      console.error(`[Events loader] Failed to load ${fileName}: ${err.message ?? err}`);
    }
  }
  return true;
};

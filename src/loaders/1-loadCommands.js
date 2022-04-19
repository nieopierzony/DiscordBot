'use strict';

const fs = require('node:fs');
const path = require('node:path');

const COMMANDS_PATH = path.join(__dirname, '../commands');

module.exports = (client) => {
  console.log('\n[Commands loader] Started loading commands');
  const commands = [];
  const commandCategories = fs.readdirSync(COMMANDS_PATH);
  for (const category of commandCategories) {
    const jsFiles = fs.readdirSync(`${COMMANDS_PATH}/${category}`).filter((fileName) => fileName.endsWith('.js'));
    for (const fileName of jsFiles) {
      try {
        const command = require(`${COMMANDS_PATH}/${category}/${fileName}`);
        if (!command?.data || !command?.method) throw new Error('Not all required parameters were provided');
        commands.push(command);
        console.log(`[Commands loader] Command "${fileName}" was successful loaded`);
      } catch (err) {
        console.error(`[Commands loader] Failed to load ${fileName}: ${err.message ?? err}`);
      }
    }
  }
  client.commands = commands;
  return commands;
};

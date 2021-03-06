'use strict';

const fs = require('node:fs');

const DB_FILENAME = 'database.json';
const defaultGuildConfig = {
  leaderRoles: null,
  commands: {},
};

const getCurrentContent = () => {
  const exists = fs.existsSync(DB_FILENAME);
  if (exists) return JSON.parse(fs.readFileSync(DB_FILENAME, 'utf-8'));
  fs.writeFileSync(DB_FILENAME, '{}');
  return {};
};

const updateConfig = (newConfig) => fs.writeFileSync(DB_FILENAME, JSON.stringify(newConfig));

const getGuild = (guildId) => {
  const config = getCurrentContent();
  if (!config[guildId]) {
    config[guildId] = defaultGuildConfig;
    updateConfig(config);
  }
  return config[guildId];
};

const updateGuild = (guildId, newData) => {
  const config = getCurrentContent();
  config[guildId] = newData;
  updateConfig(config);
  return true;
};

const getLeaderRoles = (guildId) => {
  const guildConfig = getGuild(guildId);
  return guildConfig.leaderRoles;
};

const getGuildCommands = () => {
  const config = getCurrentContent();
  const result = {};
  for (const [guildId, data] of Object.entries(config)) {
    if (!data.privateCommands) continue;
    for (const [key, value] of Object.entries(data.privateCommands)) {
      if (!value) continue;
      if (!result[guildId]) result[guildId] = [];
      result[guildId].push(key);
    }
  }
  return result;
};

module.exports = { getCurrentContent, updateConfig, getGuild, updateGuild, getLeaderRoles, getGuildCommands };

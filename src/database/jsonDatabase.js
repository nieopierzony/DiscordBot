'use strict';

const fs = require('node:fs');

const DB_FILENAME = 'database.json';
const defaultGuildConfig = {
  leaderRoles: null,
  commands: {},
  games: {
    hangman: {
      startChannelId: null,
      logChannelId: null,
      usePrivateThreads: true,
      playCooldown: 10 * 60 * 1000,
      players: {},
      logs: [],
      categories: [],
    },
  },
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
  config[guildId] = { defaultGuildConfig, ...config[guildId] };
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

// TODO: Add more find filters
const findGameLog = (gameName, guildId, { userId }) => {
  try {
    const guildConfig = getGuild(guildId);
    const logs = guildConfig.games[gameName].logs;
    return logs.filter((log) => log.playerId === userId);
  } catch (err) {
    return null;
  }
};

const setGameValue = (gameName, guildId, value, data) => {
  try {
    const guildConfig = getGuild(guildId);
    guildConfig.games[gameName][value] = data;
    return true;
  } catch (err) {
    // TODO: Sync recursive objects with default config if not exists
    return false;
  }
};

const createGameLog = (gameName, guildid, data) => {
  try {
    const guildConfig = getGuild(guildid);
    guildConfig.games[gameName].logs.push(data);
    return true;
  } catch (err) {
    return false;
  }
};

const getGuildGame = (gameName, guildId) => {
  try {
    const guildConfig = getGuild(guildId);
    return guildConfig.games[gameName];
  } catch (err) {
    return null;
  }
};

module.exports = {
  getCurrentContent,
  updateConfig,
  getGuild,
  updateGuild,
  getLeaderRoles,
  getGuildCommands,
  findGameLog,
  setGameValue,
  createGameLog,
  getGuildGame,
};

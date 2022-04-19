'use strict';

require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Client, Intents } = require('discord.js');
const initLoaders = require('./loaders');

const { DISCORD_TOKEN } = process.env;

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ['MESSAGE'],
});

client.slashCommandsRest = rest;
initLoaders(client);

client.login(DISCORD_TOKEN);

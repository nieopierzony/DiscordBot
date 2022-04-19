'use strict';

const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, GUILD_ID } = process.env;

module.exports = async ({ commands, slashCommandsRest }) => {
  try {
    console.log('\n[SlashCommands] Started refreshing application (/) commands.');
    const commandsData = commands
      .filter((command) => command.data.isSlashCommand)
      .map((command) => command.data.builtSlashCommand);
    await slashCommandsRest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandsData });
    console.log('[SlashCommands] Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

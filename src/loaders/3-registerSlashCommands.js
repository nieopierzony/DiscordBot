'use strict';

const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, REGISTER_SLASHCOMMANDS } = process.env;
const { getGuildCommands } = require('../database');

module.exports = async ({ commands, slashCommandsRest }) => {
  try {
    // TODO: Store last register in some file and diff date
    // TODO: Add commands permissions from database
    if (REGISTER_SLASHCOMMANDS === '0') return;
    console.log('\n[SlashCommands] Started refreshing application (/) commands.');
    const slashCommands = commands.filter((command) => command.data.isSlashCommand);
    const privateCommands = slashCommands.filter((command) => command.data.isGuildCommand);
    const guildCommands = getGuildCommands();
    for await (const [guildId, commandNames] of Object.entries(guildCommands)) {
      const guildPrivateCommands = privateCommands
        .filter((c) => commandNames.includes(c.data.name))
        .map((c) => c.data.builtSlashCommand);
      await slashCommandsRest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: guildPrivateCommands });
    }
    const globalCommands = slashCommands
      .filter((command) => !command.data.isGuildCommand)
      .map((command) => command.data.builtSlashCommand);
    await slashCommandsRest.put(Routes.applicationCommands(CLIENT_ID), { body: globalCommands });
    console.log('[SlashCommands] Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

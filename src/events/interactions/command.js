'use strict';

const log = ({ user, commandName, guild }) =>
  console.log(`[InteractionCreate] ${user.tag} использовал команду /${commandName} на сервере "${guild.name}"`);

module.exports = async (client, interaction) => {
  log(interaction);
  const command = client.commands
    .filter((cmd) => cmd.data.isSlashCommand)
    .find((cmd) => cmd.data.name === interaction.commandName);
  if (!command) throw new Error('Команда не найдена');
  const commandResult = await command.method(client, interaction);
  return commandResult;
};

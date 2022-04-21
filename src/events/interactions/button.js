'use strict';

const log = ({ user, customId, guild }) =>
  console.log(`[InteractionCreate] ${user.tag} нажал на кнопку "${customId}" на сервере "${guild.name}"`);

module.exports = async (client, interaction) => {
  log(interaction);
  const buttonHandler = client.commands.find((cmd) => cmd.data.name === interaction.customId);
  if (!buttonHandler) throw new Error('Действие не найдено');
  const result = await buttonHandler.method(client, interaction);
  return result;
};

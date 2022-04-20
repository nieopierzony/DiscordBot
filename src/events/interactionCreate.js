'use strict';

const { MessageEmbed } = require('discord.js');
const constants = require('../util/constants');

const errorMessage = (message) =>
  new MessageEmbed().setTitle('Произошла ошибка').setColor(constants.colors.red).setDescription(message);
const formatReply = (data) =>
  data instanceof MessageEmbed ? { embeds: [data] } : typeof data === 'string' ? { content: data } : data;

module.exports = {
  type: 'interactionCreate',
  async method(client, interaction) {
    try {
      if (!interaction.isCommand()) return;
      const command = client.commands.find((cmd) => cmd.data.name === interaction.commandName);
      if (!command) throw new Error('Команда не найдена');
      const commandResult = await command.method(client, interaction);
      const formattedReply = formatReply(commandResult);
      console.log(
        `[InteractionCreate] ${interaction.user.tag} использовал команду ` +
          `/${interaction.commandName} на сервере "${interaction.guild.name}"`,
      );
      if (!formattedReply) throw new Error('Нет ответа');
      interaction.reply(formattedReply);
    } catch (err) {
      console.error(`[Create interaction ERR] ${err}`);
      interaction.reply({ ephemeral: true, embeds: [errorMessage(err.message ?? err)] });
    }
  },
};

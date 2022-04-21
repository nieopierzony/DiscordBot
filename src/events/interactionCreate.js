'use strict';

const { MessageEmbed } = require('discord.js');
const { commandHandler, buttonHandler } = require('./interactions');
const constants = require('../util/constants');

const errorMessage = (message) =>
  new MessageEmbed().setTitle('Произошла ошибка').setColor(constants.colors.red).setDescription(message);
const formatReply = (data) =>
  data instanceof MessageEmbed ? { embeds: [data] } : typeof data === 'string' ? { content: data } : data;
const log = ({ user, commandName, guild }) =>
  console.log(`[InteractionCreate] ${user.tag} использовал команду /${commandName} на сервере "${guild.name}"`);

module.exports = {
  type: 'interactionCreate',
  async method(client, interaction) {
    try {
      let rawReply = null;
      if (interaction.isCommand()) rawReply = await commandHandler(client, interaction);
      else if (interaction.isButton()) rawReply = await buttonHandler(client, interaction);
      const formattedReply = formatReply(rawReply);
      if (!formattedReply) throw new Error('Нет ответа');
      interaction[formattedReply.type ?? 'reply'](formattedReply);
    } catch (err) {
      console.error(`[Create interaction ERR]`, err);
      interaction.reply({ ephemeral: true, embeds: [errorMessage(err.message ?? err)] });
    }
  },
};

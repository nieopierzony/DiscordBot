'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: {
    name: 'test',
    isGuildCommand: true,
    isSlashCommand: true,
    builtSlashCommand: new SlashCommandBuilder().setName('test').setDescription('Create test message'),
  },
  method(client, interaction) {
    const { member } = interaction;
    if (member.id !== '876172866897448981') throw new Error('No access');
    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('createHangman').setLabel('Начать виселицу').setStyle('PRIMARY'),
    );
    return { content: 'test', components: [row] };
  },
};

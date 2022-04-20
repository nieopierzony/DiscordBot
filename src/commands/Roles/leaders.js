'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const database = require('../../database');
const { colors, organzationCategories, OrganizationNames, nickRegex } = require('../../util/constants');
const { findPlayer } = require('../../util/playersApi');

module.exports = {
  data: {
    name: 'leaders',
    isGuildCommand: true,
    isSlashCommand: true,
    builtSlashCommand: new SlashCommandBuilder()
      .setName('leaders')
      .setDescription('Контакты руководителей организаций'),
  },
  async method(client, interaction) {
    const leaderRoleIds = database.getLeaderRoles(interaction.guild.id);
    if (!leaderRoleIds) throw new Error('Команда не настроена под этот сервер');
    await interaction.guild.members.fetch();
    const roles = [];
    for await (const [roleId, organizationId] of Object.entries(leaderRoleIds)) {
      const fetchedRole = await interaction.guild.roles.fetch(roleId);
      roles.push({ role: fetchedRole, organizationId });
    }
    const fields = [];
    for await (const [name, ids] of Object.entries(organzationCategories)) {
      const orgRoles = roles.filter(({ organizationId }) => ids.includes(organizationId));
      const valueLines = [];
      for await (const { organizationId, role } of orgRoles) {
        const orgName = OrganizationNames[organizationId];
        const roleHandler = role?.members?.first();
        if (!roleHandler) continue;
        let value = `**${orgName}** - ${roleHandler.toString()}`;
        const gameNickMatch = roleHandler.displayName.match(nickRegex);
        const gameNick = gameNickMatch?.length >= 2 ? gameNickMatch[1].replace(' ', '_') : null;
        const playerOnline = gameNick ? await findPlayer(gameNick) : null;
        if (playerOnline) value += `- \`ID ${playerOnline.id}\``;
        valueLines.push(value);
      }
      if (valueLines.length === 0) continue;
      fields.push({ name, value: valueLines.join('\n') });
    }
    const embed = new MessageEmbed().setTitle('Руководители организаций').setColor(colors.orange).addFields(fields);
    return { embeds: [embed], ephemeral: true };
  },
};

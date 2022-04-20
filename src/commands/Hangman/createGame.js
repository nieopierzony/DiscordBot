'use strict';

const { MessageEmbed, Util } = require('discord.js');
const { getGuildGame, findGameLog } = require('../../database/jsonDatabase');
const { colors } = require('../../util/constants');
const { pickRandomWord, maskWord } = require('../../util/hangman');

const checkUserPermissions = (gameData, { guild, member }) => {
  const userGameLogs = findGameLog('hangman', guild.id, { userId: member.id });
  const lastGame = userGameLogs[userGameLogs.length - 1];
  return !lastGame || (lastGame?.ended && Date.now() - lastGame?.endedAt > gameData.playCooldown);
};

const createThread = ({ channel, member }) =>
  channel.threads.create({
    name: member.displayName,
    autoArchiveDuration: 60,
    type: 'GUILD_PRIVATE_THREAD',
    reason: 'Игра Виселица',
  });

module.exports = {
  data: {
    name: 'createHangman',
    isButton: true,
  },
  async method(client, interaction) {
    const { member, guild } = interaction;
    if (member.id !== '876172866897448981') throw new Error('No access');

    const gameData = getGuildGame('hangman', guild.id);
    const canUserCreateGame = checkUserPermissions(gameData, interaction);
    if (!canUserCreateGame) throw new Error('Вы не можете сейчас создать игру');
    // TODO: Support game not in private thread but in new channel
    const channel = gameData?.usePrivateThreads ? await createThread(interaction) : null;
    if (!channel) throw new Error('Не удалось создать канал');
    const randomWord = pickRandomWord(gameData);
    console.log(randomWord);
    const maskedWord = maskWord(randomWord);
    const taskEmbed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle('Виселица : Игра')
      .setDescription(`**Word:** ${Util.escapeMarkdown(maskedWord)}\n**Mistakes:**`);
    await channel.send({ content: interaction.member.toString(), embeds: [taskEmbed] });
    return { ephemeral: true, content: 'created' };
  },
};

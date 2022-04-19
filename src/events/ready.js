'use strict';

module.exports = {
  once: true,
  type: 'ready',
  method(client) {
    try {
      console.log(`\n[Ready] Bot started as ${client.user.tag} [${client.user.id}]`);
      console.log(`[Ready] Cached guilds: ${client.guilds.cache.map((guild) => guild.name).join(', ')}`);
    } catch (err) {
      console.error(`[Ready ERR] ${err.message ?? err}`);
    }
  },
};

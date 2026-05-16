const db = require('./database');

function getGuildConfig(guildId) {
  return db.get(`config_${guildId}`) || {
    logChannel: null,
    embedColor: 0x5865F2,
    alertsEnabled: true,
    adminRoles: []
  };
}

function saveGuildConfig(guildId, config) {
  db.set(`config_${guildId}`, config);
}

module.exports = { getGuildConfig, saveGuildConfig };
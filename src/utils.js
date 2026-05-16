const { EmbedBuilder } = require('discord.js');

function createEmbed(title, description, color = 0x5865F2) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

function getStatus(bot) {
  const now = Date.now();
  if (bot.status === 'suspenso') return { text: '🔴 Suspenso', color: 0xED4245 };
  if (bot.expiresAt < now) return { text: '⛔ Expirado', color: 0xED4245 };
  const daysLeft = Math.ceil((bot.expiresAt - now) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 3) return { text: '🟠 Expirando', color: 0xF1C40F };
  return { text: '🟢 Ativo', color: 0x57F287 };
}

module.exports = { createEmbed, getStatus };
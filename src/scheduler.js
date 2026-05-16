const cron = require('node-cron');
const db = require('./database');
const { getGuildConfig } = require('./config');
const { Client, EmbedBuilder } = require('discord.js');

function startScheduler(client) {
  // Executa a cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    console.log('🔄 Verificando expirações...');

    const allKeys = db.all();
    for (const key of allKeys) {
      if (!key.startsWith('bots_')) continue;

      const guildId = key.replace('bots_', '');
      const bots = db.get(key) || [];
      const config = getGuildConfig(guildId);

      if (!config.alertsEnabled) continue;

      for (const bot of bots) {
        const now = Date.now();
        const daysLeft = Math.ceil((bot.expiresAt - now) / (86400000));

        let shouldNotify = false;
        let alertMsg = '';

        if (daysLeft <= 0 && bot.status !== 'expirado') {
          bot.status = 'expirado';
          shouldNotify = true;
          alertMsg = '❌ Seu bot expirou!';
        } else if (daysLeft === 1) {
          shouldNotify = true;
          alertMsg = '⚠️ Seu bot expira em 24 horas!';
        } else if (daysLeft === 3) {
          shouldNotify = true;
          alertMsg = '🟠 Seu bot expira em 3 dias!';
        } else if (daysLeft === 7) {
          shouldNotify = true;
          alertMsg = '🔶 Seu bot expira em 7 dias!';
        }

        if (shouldNotify) {
          try {
            const user = await client.users.fetch(bot.owner || 'ID_DO_DONO'); // Implemente dono se quiser
            const embed = new EmbedBuilder()
              .setTitle('📢 Alerta de Validade')
              .setDescription(`${alertMsg}\n\n**Bot:** <@${bot.botId}>\n**Dias restantes:** ${Math.max(0, daysLeft)}`)
              .setColor(0xF1C40F);
            await user.send({ embeds: [embed] }).catch(() => {});
          } catch (e) {}
        }
      }
      db.set(key, bots);
    }
  });
}

module.exports = { startScheduler };
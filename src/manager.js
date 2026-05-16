const db = require('./database');
const { getGuildConfig } = require('./config');

function addBot(guildId, botId, planId, notes = '') {
  const plans = getPlans(guildId);
  const plan = plans.find(p => p.plan_id === planId);
  if (!plan) throw new Error('Plano inválido');

  const expiresAt = Date.now() + (plan.duracao * 24 * 60 * 60 * 1000);

  const botData = {
    botId,
    guildId,
    planId,
    planName: plan.nome,
    notes,
    addedAt: Date.now(),
    expiresAt,
    status: 'ativo',
    owner: null // Pode ser expandido
  };

  let bots = getBots(guildId);
  bots = bots.filter(b => b.botId !== botId);
  bots.push(botData);
  db.set(`bots_${guildId}`, bots);

  return botData;
}

function getBots(guildId) {
  return db.get(`bots_${guildId}`) || [];
}

function getPlans(guildId) {
  return db.get(`plans_${guildId}`) || [];
}

function savePlans(guildId, plans) {
  db.set(`plans_${guildId}`, plans);
}

function renewBot(guildId, botId, days, reason) {
  const bots = getBots(guildId);
  const bot = bots.find(b => b.botId === botId);
  if (!bot) return null;

  bot.expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
  bot.status = 'ativo';
  db.set(`bots_${guildId}`, bots);

  logAction(guildId, `🔄 Renovação: Bot ${botId} por ${days} dias. Motivo: ${reason}`);
  return bot;
}

function removeBot(guildId, botId) {
  let bots = getBots(guildId);
  bots = bots.filter(b => b.botId !== botId);
  db.set(`bots_${guildId}`, bots);
  logAction(guildId, `🗑️ Bot removido: ${botId}`);
}

function logAction(guildId, description) {
  const config = getGuildConfig(guildId);
  // Log será usado no interactions.js com o canal configurado
  console.log(`[LOG ${guildId}] ${description}`);
  return { guildId, description };
}

module.exports = { addBot, getBots, getPlans, savePlans, renewBot, removeBot, logAction };
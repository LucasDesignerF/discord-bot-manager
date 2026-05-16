// src/interactions.js
const { 
  ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, 
  ModalBuilder, TextInputBuilder, TextInputStyle 
} = require('discord.js');

const { createEmbed, getStatus } = require('./utils');
const { getGuildConfig } = require('./config');
const manager = require('./manager');

async function handleInteraction(interaction) {
  try {
    if (interaction.isCommand()) {
      await handleCommands(interaction);
    } else if (interaction.isButton()) {
      await handleButtons(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModals(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelects(interaction);
    }
  } catch (error) {
    console.error(error);
    const reply = { content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}

// ==================== COMANDOS ====================
async function handleCommands(interaction) {
  if (!interaction.memberPermissions.has('Administrator')) {
    return interaction.reply({ content: '❌ Apenas administradores podem usar este comando.', ephemeral: true });
  }

  const { commandName } = interaction;

  if (commandName === 'plan') {
    const sub = interaction.options.getSubcommand();
    
    if (sub === 'create') await createPlan(interaction);
    if (sub === 'list') await listPlans(interaction);
  }

  if (commandName === 'bot') {
    const sub = interaction.options.getSubcommand();
    
    if (sub === 'add') await addBotCommand(interaction);
    if (sub === 'list') await listBots(interaction);
  }
}

// ===================== PLAN =====================
async function createPlan(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('plan_create')
    .setTitle('Criar Novo Plano');

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('nome')
        .setLabel('Nome do Plano')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('duracao')
        .setLabel('Duração em dias')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('descricao')
        .setLabel('Descrição')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );

  await interaction.showModal(modal);
}

async function listPlans(interaction) {
  const plans = manager.getPlans(interaction.guildId);

  if (plans.length === 0) {
    return interaction.reply({ 
      content: '❌ Nenhum plano cadastrado neste servidor.\nUse `/plan create` para criar um.', 
      ephemeral: true 
    });
  }

  const embed = createEmbed(
    '📋 Planos Disponíveis', 
    plans.map(p => `**${p.nome}** (${p.duracao} dias)\n${p.descricao || 'Sem descrição'}`).join('\n\n'),
    0x5865F2
  );

  await interaction.reply({ embeds: [embed] });
}

// ===================== BOT =====================
async function addBotCommand(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('bot_add')
    .setTitle('Adicionar Bot ao Gerenciamento');

  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('botId')
        .setLabel('ID do Bot')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('notes')
        .setLabel('Observações (opcional)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );

  await interaction.showModal(modal);
}

async function listBots(interaction) {
  const bots = manager.getBots(interaction.guildId);

  if (bots.length === 0) {
    return interaction.reply({ content: 'Nenhum bot cadastrado neste servidor.', ephemeral: true });
  }

  const embeds = bots.map(bot => {
    const status = getStatus(bot);
    return createEmbed(
      `🤖 ${bot.botId}`,
      `**Plano:** ${bot.planName}\n**Status:** ${status.text}\n**Expira:** <t:${Math.floor(bot.expiresAt/1000)}:R>`,
      status.color
    );
  });

  await interaction.reply({ embeds: [embeds[0]] });
}

// ==================== MODALS ====================
async function handleModals(interaction) {
  if (interaction.customId === 'plan_create') {
    const nome = interaction.fields.getTextInputValue('nome');
    const duracao = parseInt(interaction.fields.getTextInputValue('duracao'));
    const descricao = interaction.fields.getTextInputValue('descricao') || 'Sem descrição';

    let plans = manager.getPlans(interaction.guildId);
    plans.push({
      plan_id: Date.now().toString(36),
      nome,
      duracao,
      descricao,
      guild_id: interaction.guildId
    });

    manager.savePlans(interaction.guildId, plans);

    await interaction.reply({ 
      content: `✅ Plano **${nome}** criado com sucesso! (${duracao} dias)`, 
      ephemeral: true 
    });
  }

  if (interaction.customId === 'bot_add') {
    const botId = interaction.fields.getTextInputValue('botId');
    const notes = interaction.fields.getTextInputValue('notes');

    const plans = manager.getPlans(interaction.guildId);
    if (plans.length === 0) {
      return interaction.reply({ content: '❌ Crie pelo menos um plano primeiro!', ephemeral: true });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId(`select_plan_${botId}`)
      .setPlaceholder('Escolha um plano para este bot')
      .addOptions(plans.map(p => ({
        label: p.nome,
        value: p.plan_id,
        description: `${p.duracao} dias`
      })));

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: `Bot **${botId}** adicionado.\n\nSelecione o plano:`,
      components: [row],
      ephemeral: true
    });
  }
}

// ==================== SELECT MENU ====================
async function handleSelects(interaction) {
  if (interaction.customId.startsWith('select_plan_')) {
    const botId = interaction.customId.split('_')[2];
    const planId = interaction.values[0];

    try {
      manager.addBot(interaction.guildId, botId, planId);
      await interaction.update({ 
        content: `✅ Bot **${botId}** cadastrado com sucesso!`, 
        components: [] 
      });
    } catch (e) {
      await interaction.update({ content: `❌ Erro: ${e.message}`, components: [] });
    }
  }
}

// ==================== BUTTONS (ainda não implementados) ====================
async function handleButtons(interaction) {
  await interaction.reply({ content: 'Funcionalidade em desenvolvimento...', ephemeral: true });
}

module.exports = { handleInteraction };
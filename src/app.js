// src/app.js
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');
const { handleInteraction } = require('./interactions');
const { startScheduler } = require('./scheduler');
const os = require('os');
const db = require('./database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Cada linha é um status INDEPENDENTE
const statusList = [
  "👨‍💼 Gerenciando Licenças de Bots",
  `💾 RAM: {ram}%`,
  `🔥 CPU: {cpu}%`,
  `🌐 Banda: Estável`,                    // Pode melhorar no futuro
  `📊 {bots} bots sendo gerenciados`,
  `🌍 Em {servers} servidores`,
  "✨ Desenvolvido por Nexus Plataforms"
];

let statusIndex = 0;

function updateStatus() {
  const ram = Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100);
  const cpu = Math.round(os.loadavg()[0] * 10); // Aproximação
  const servers = client.guilds.cache.size;
  const totalBots = getTotalBots();

  let statusText = statusList[statusIndex]
    .replace('{ram}', ram)
    .replace('{cpu}', cpu)
    .replace('{servers}', servers)
    .replace('{bots}', totalBots);

  client.user.setActivity(statusText, {
    type: ActivityType.Custom
  });

  console.log(`🔄 Status → ${statusText}`);
  statusIndex = (statusIndex + 1) % statusList.length;
}

function getTotalBots() {
  try {
    let total = 0;
    const allData = db.all?.() || [];
    for (const entry of allData) {
      if (entry.id?.startsWith('bots_')) {
        const bots = db.get(entry.id) || [];
        total += bots.length;
      }
    }
    return total;
  } catch (e) {
    return 0;
  }
}

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);

  // Inicia o status imediatamente
  updateStatus();
  
  // Troca a cada 7 segundos
  setInterval(updateStatus, 7000);

  startScheduler(client);
  registerCommands();
});

client.on('interactionCreate', async interaction => {
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error(error);
    const reply = { content: '❌ Ocorreu um erro interno.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

async function registerCommands() {
  const commands = [
    {
      name: 'bot',
      description: 'Gerenciar bots',
      options: [
        { name: 'add', type: 1, description: 'Adicionar bot' },
        { name: 'list', type: 1, description: 'Listar bots' }
      ]
    },
    {
      name: 'plan',
      description: 'Gerenciar planos',
      options: [
        { name: 'create', type: 1, description: 'Criar plano' },
        { name: 'list', type: 1, description: 'Listar planos' }
      ]
    }
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  console.log('✅ Comandos registrados.');
}

client.login(process.env.TOKEN);
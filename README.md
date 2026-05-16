<div align="center">

![Banner](https://imgur.com/rM1nezx.png)

# 🤖 Bot Manager - Gerenciador de Licenças

**Painel completo de gerenciamento de bots dentro do Discord**

![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## ✨ Sobre o Projeto

**Bot Manager** é um sistema moderno e completo para gerenciar a validade e licenças de bots Discord diretamente pelo Discord.

Com uma interface premium, botões, modais e embeds modernas, ele transforma seu servidor em um **verdadeiro painel SaaS** de gerenciamento.

---

## 🚀 Funcionalidades

### ✅ Principais Recursos

- **Sistema de Planos Dinâmicos** (criados por servidor)
- **Gerenciamento Completo de Bots** (add, list, renew, remove)
- **Alertas Automáticos** de expiração (7d, 3d, 24h, expirado)
- **Status Personalizado Rotativo** com consumo de RAM, CPU e mais
- **Logs Detalhados** por servidor
- **Configurações Dinâmicas** por servidor
- **Interface Premium** (Embeds + Botões + Selects + Modals)
- **Totalmente Multiservidor**
- **Banco de Dados Leve** (wio.db)

---

## 🛠 Tecnologias Utilizadas

- **Node.js**
- **discord.js** (v14)
- **wio.db** (JsonDatabase)
- **node-cron** (Scheduler)
- **dotenv**

---

## 📥 Instalação

```bash
# Clone o repositório
git clone https://github.com/LucasDesignerF/discord-bot-manager.git

# Entre na pasta
cd discord-bot-manager

# Instale as dependências
npm install

# Configure o .env
cp .env.example .env
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
TOKEN=seu_token_do_bot_aqui
CLIENT_ID=id_do_seu_bot_aqui
```

> Dê permissão de **Administrator** ao bot ao convidá-lo.

---

## ▶️ Como Iniciar

```bash
# Modo Desenvolvimento (recomendado)
npm run dev

# Modo Produção
npm start
```

---

## 📋 Comandos Disponíveis

| Comando          | Descrição                        |
|------------------|----------------------------------|
| `/plan create`   | Criar novo plano                 |
| `/plan list`     | Listar planos do servidor        |
| `/bot add`       | Adicionar bot ao sistema         |
| `/bot list`      | Listar bots gerenciados          |

*(Mais comandos serão adicionados em breve)*

---

## 🎨 Status do Bot

O bot alterna automaticamente o status a cada **7 segundos**, mostrando:

- Gerenciamento de Licenças
- Consumo de RAM em tempo real
- Consumo de CPU
- Quantidade de bots gerenciados
- Quantidade de servidores
- **Desenvolvido por Nexus Plataforms**

---

## 📸 Preview

![Banner](https://imgur.com/rM1nezx.png)

*(Em breve mais screenshots)*

---

## 👨‍💻 Desenvolvido por

**Lucas Designer**  
GitHub: [LucasDesignerF](https://github.com/LucasDesignerF)

---

<div align="center">

**Feito com ❤️ e muito café**

</div>

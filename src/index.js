const { Client, Events, GatewayIntentBits } = require('discord.js');

const bot = new Client({intents: GatewayIntentBits.Guilds});

require('dotenv').config();

const {registerCommandListener} = require('./commands/command_loader.js');

const token = process.env.DISCORD_BOT_TOKEN;

bot.once(Events.ClientReady, client => {
	console.log('Your bot: ' + client.user.tag + ' is Online :)')
});

bot.login(token);

registerCommandListener(bot);

module.exports = bot;
const { Client, Events, GatewayIntentBits } = require('discord.js');

bot = new Client({intents: GatewayIntentBits.Guilds});

require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;

bot.once(Events.ClientReady, client => {
	console.log('Your bot: ' + client.user.tag + ' is Online :)')
});

bot.login(token);
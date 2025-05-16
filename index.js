const { Client, Intents, Events, GatewayIntentBits } = require('discord.js')

bot = new Client({intents: GatewayIntentBits.Guilds})

bot.once(Events.ClientReady, client => {
	console.log('Your bot: ' + client.user.tag + ' is Online :)')
})

bot.login(token)
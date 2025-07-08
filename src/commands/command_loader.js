const { Events, Collection, MessageFlags } = require('discord.js');
const { REST, Routes, Client } = require('discord.js');
const fs = require('node:fs');

const path = require('node:path');
const { isObject } = require('node:util');

const commands = [];

const commandsCollection = new Collection;

const commandsDataJson = [];

const commandsFolders = __dirname;

for (let commandFolder of fs.readdirSync(commandsFolders))
{
    commandFolder = path.join(commandsFolders, commandFolder, path.sep);
    if (!fs.existsSync(commandFolder) || !fs.statSync(commandFolder).isDirectory())
    {
        continue;
    }
    const commandsFiles = fs.readdirSync(commandFolder)
    .filter(
        fileName => fileName.endsWith('.js')
    );
    for (let file of commandsFiles)
    {
        let filePath = path.join(commandFolder, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command)
        {
            commandsDataJson.push(command.data.toJSON());
            commands.push(command);
            commandsCollection.set(command.data.name, command);
            console.debug(`Command ${command.data.name} loaded suceffully`);
        } else {
            throw `Command ${filePath} need to have data and execute property!`;
        }
    }
}


const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async() => {
    try {
        console.log('Registering bot commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commandsDataJson
            }
        );
        console.log(`${commands.length} commands registered suceffully`);
    } catch (error) {
        console.error(error);
    }
})();


/**
 * @param {Client} bot 
 */
function registerCommandListener(bot)
{
    /**
     * @type {import('discord.js').Interaction} interaction
     */
    bot.on(Events.InteractionCreate, async (interaction) => {
        try {
            if (interaction.isChatInputCommand())
            {
                const commandName = interaction.commandName;
                const command = commandsCollection.get(commandName);
                if (typeof command === 'object')
                {
                    try {
                        await command.execute(interaction);
                    } catch (error) {
                        console.error(`Error while execute command /${commandName}: ${error}`);
                        if (!interaction.replied)
                        {
                            interaction.reply({
                                flags: MessageFlags.Ephemeral,
                                content: "An error ocurred while execute this command, try again later"
                            }).catch(console.error);
                        }
                    }
                } else {
                    throw `Command ${commandName} does not found`;
                }
            }
        } catch (error) {
            console.error("Error while find command: " + error);
        }
    });
}

module.exports = {
    commands: commands,
    registerCommandListener
};
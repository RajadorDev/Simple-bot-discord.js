const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const path = require('node:path');

const commands = [];

const commandsDataJson = [];

const commandsFolders = path.join(__dirname, 'commands');

for (let commandFolder of fs.readdirSync(commandsFolders))
{
    commandFolder = path.join(commandsFolders, commandFolder);
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
        } else {
            throw `Command ${filePath} need to have data and execute property!`;
        }
    }
}

module.exports = commands;

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async() => {
    try {
        console.log('Loading bot commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID),
            {
                body: commandsDataJson
            }
        );
        console.log(`Commands ${commands.length} loaded suceffully`);
    } catch (error) {
        console.error(error);
    }
});
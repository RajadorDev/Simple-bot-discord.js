const { SlashCommandBuilder, CommandInteraction, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Show bot ping'),
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const time = interaction.createdAt.getTime() - Date.now();
        const timeFormatted = time.toFixed(2);
        await interaction.reply(
            {
                flags: MessageFlags.Ephemeral,
                content: `Bot ping: \`${timeFormatted}\``
            }
        );
    }
}
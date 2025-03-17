const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Tells you who made it.'),
	async execute(interaction) {
		await interaction.reply('Make with ❤️ by the Code Network Team (2025)');
	},
};

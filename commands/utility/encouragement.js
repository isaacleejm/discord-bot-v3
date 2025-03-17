const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('encouragement')
		.setDescription('Gives you encouragement.'),
	async execute(interaction) {
		await interaction.reply('https://tenor.com/view/gif-gif-19494503');
	},
};

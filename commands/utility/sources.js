const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sources')
		.setDescription('Searches Google Schollar')
		.addStringOption(option =>
			option.setName('campus')
				.setDescription('Your Starting Campus')
				.addChoices(
					{ name: 'Articles', value: 'article' },
					{ name: 'Case Law', value: 'law' },
				)
				.setRequired(true)),
	async execute(interaction) {
		// Reply to the interaction with a loading message
		await interaction.reply({ content: '🔍 Checking for articals...', ephemeral: true });

		const option = interaction.options.getString('campus');
		const url = `https://spaces.library.qut.edu.au/mob/${option}`;

		try {
			// Fetch the HTML data
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);
			$('.past').remove(); // Remove unnecessary elements
			$('.fa-icon').remove();
			const levels = [];
			const info = [];
			$('.room_wrapper').each(function (index, element) {
				const adr = $(element).find('a').attr('href');
				const room = $(element).find('a > .room > h3').text();
				const capacity = $(element).find('a > .room > span').text().replace(" ", "");
				const level = room.slice(4).substring(0, 1);
				const available = ($(element).find('a > .room_booking > ul > li').length - $(element).find('a > .room_booking > ul > .booked').length);
				const unavailable = $(element).find('a > .room_booking > ul > .booked').length;
				const total = $(element).find('a > .room_booking > ul > li').length;
				// const time = $(element).find('a > .room_booking > ul > li').attr('title');
				levels.push({
					level: level,
					//time: time,
					capacity: capacity,
                                        numa: available,
                                        numua: unavailable,
					total: total,
				});
				$('.room_wrapper > a > .room_booking > ul > li').each(function (index, element) {
				//const total = $(element).length;
				const time = $(element).attr('title');
				const booked = $(element).find('booked').length; 
				info.push({
					level: level,
					room: room,
					time: time,
					roomCapacity: capacity,
                                        numa: available,
                                        numua: unavailable,
					total: total,
					booked: booked,
					value: adr,
				});
					});

			});

			if (!info || info.length === 0) {
				// If no results found
				await interaction.editReply({ content: 'Hmmm, we had troble getting the data from QUT.', ephemeral: true });
			} else {

const levelCapacity = {};
levels.forEach(room => {
    const levelKey = room.level;
    if (!levelCapacity[levelKey]) {
        levelCapacity[levelKey] = {
            totalCapacity: 0,
            currentAvailableCapacity: 0
        };
    }
    levelCapacity[levelKey].totalCapacity += room.capacity;
    if (room.availableSlots > 0) {
        levelCapacity[levelKey].currentAvailableCapacity += room.capacity;
    }
});

// Example usage:
console.log("Total and Available Capacity per Level:");
Object.keys(levelCapacity).forEach(level => {
    console.log(`Level ${level}: 
      Total Capacity = ${levelCapacity[level].totalCapacity}, 
      Available Capacity = ${levelCapacity[level].currentAvailableCapacity}`);
});








				console.log(info)
				await interaction.editReply({ content: info });
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching unit data:', error);
			await interaction.editReply({ content: 'Hmmm, Something went wrong', ephemeral: true });
		}
	},
};

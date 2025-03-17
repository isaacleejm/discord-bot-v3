const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unit')
		.setDescription('Returns information about a unit')
		.addStringOption(option =>
			option.setName('unitcodeorname')
				.setDescription('The code of the unit to lookup')
				.setRequired(true)),
	async execute(interaction) {
		// Reply to the interaction with a loading message
		await interaction.reply({ content: '🔍 Searching for units...', ephemeral: true });

		const option = interaction.options.getString('unitcodeorname');
		const url = `https://qutvirtual4.qut.edu.au/web/qut/search?params.query=${option}&params.showOldUnits=true&profile=UNIT&params.stickyTabs=false&params.singleResultRedirect=false&params.sortKey=8`;

		try {
			// Fetch the HTML data
			const response = await axios.get(url);
			const $ = cheerio.load(response.data);
			$('.unit-details-heading').remove(); // Remove unnecessary elements

			const info = [];
			$('.class-result-item').find('div.search-unit-info').each(function (index, element) {
				const adr = $(element).find('h4 > a').attr('href');
				const q = require('url').parse(adr, true);
				const qdata = q.query;

				info.push({
					label: `${$(element).find('h4 > a').text()} (${$(element).find('.unit-details > li:first').text()} - ${qdata.year})`,
					description: `${$(element).find('.unit-details > .unit-details-location').text()} - ${$(element).find('.unit-details > .unit-details-attendance-mode').text()} (${$(element).find('.unit-details > .unit-details-startDate').text()} - ${$(element).find('.unit-details > .unit-details-endDate').text()})`,
					value: adr,
				});
			});

			if (!info || info.length === 0) {
				// If no results found
				await interaction.editReply({ content: 'Hmmm, Something went wrong, no units found', ephemeral: true });
			} else {
				// Create the select menu for user to choose
				const select = new StringSelectMenuBuilder()
					.setCustomId('starter')
					.setPlaceholder('Make a selection!')
					.addOptions(
						info.map(item => {
							return new StringSelectMenuOptionBuilder()
								.setLabel(item.label)
								.setDescription(item.description)
								.setValue(item.value);
						})
					);

				const row = new ActionRowBuilder().addComponents(select);

				// Update the reply with the select menu
				const response = await interaction.editReply({
					content: 'Choose your depression',
					components: [row],
				});

				// Collector filter to ensure the user is interacting
				const collectorFilter = i => i.customId === 'starter' && i.user.id === interaction.user.id;

				// Await the interaction response with a timeout
				try {
					const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
					//console.log('User selected:', confirmation.values);
					const idk = await getstuff(confirmation.values);
					await confirmation.update({ content: `${idk}`, components: [] });
					// Handle the selected option (confirmation)
					//console.log(getstuff(confirmation.values));
					// await confirmation.update({ content: `You selected: ${getstuff(confirmation.values)}`, components: [] });
				} catch {
					await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
				}

async function getstuff(urls) {
    const url = `https://qutvirtual4.qut.edu.au${urls}`;
    
    try {
        const response = await axios.get(url); // Wait for the HTTP request to complete
        const $ = cheerio.load(response.data); // Load the HTML data
        
        // Remove unwanted <th> elements
        $('th').remove();
        
        const year = $('.year-tab'); // Get the year element
        const unitname = $('div#outline > h1:first'); // Get the unit name
        const campus = $('dl.availabilities > dt > strong');
        const semester = $('dl.availabilities > dt dd');
        const synopsis = $('div.tab-pane > div.p');
        const credit = $('table.basicinfo > tbody > td:nth-child(3)');
	const finaltext = `**[${unitname.text()} (${semester.text()} - ${year.text()})](<${url}>)** \n Offered: ${campus.text()} \n ${credit.text()} Credit Points \n Synopsis: ${synopsis.text()}`
        // You can also return unitname if you want to use it elsewhere
        return finaltext; // Return the extracted data
    } catch (error) {
        console.error('Error while fetching unit details:', error);
        return null; // Return null or handle error appropriately
    }
}
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching unit data:', error);
			await interaction.editReply({ content: 'Hmmm, Something went wrong', ephemeral: true });
		}
	},
};

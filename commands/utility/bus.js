const { DateTime } = require('luxon');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuttle')
		.setDescription('Returns informtation about the next shuttle.')
		.addStringOption(option =>
			option.setName('campus')
				.setDescription('Which Route?')
				.addChoices(
					{ name: 'Gardens Point to Kelvin Grove', value: 'GP' },
					{ name: 'Kelvin Grove to Gardens Point', value: 'KG' },
				)
				.setRequired(true)),
	async execute(interaction) {



const kgtogp = [
    ["7:00AM", "7:12AM"],
    ["7:15AM", "7:27AM"],
    ["7:30AM", "7:42AM"],
    ["7:45AM", "7:57AM"],
    ["8:00AM", "8:12AM"],
    ["8:15AM", "8:27AM"],
    ["8:30AM", "8:42AM"],
    ["8:45AM", "8:57AM"],
    ["9:00AM", "9:11AM"],
    ["9:15AM", "9:26AM"],
    ["9:30AM", "9:41AM"],
    ["9:45AM", "9:56AM"],
    ["10:00AM", "10:11AM"],
    ["10:15AM", "10:26AM"],
    ["10:30AM", "10:41AM"],
    ["10:45AM", "10:56AM"],
    ["11:00AM", "11:11AM"],
    ["11:15AM", "11:26AM"],
    ["11:30AM", "11:41AM"],
    ["11:45AM", "11:56AM"],
    ["12:00PM", "12:11PM"],
    ["12:15PM", "12:26PM"],
    ["12:30PM", "12:41PM"],
    ["12:45PM", "12:56PM"],
    ["1:00PM", "1:11PM"],
    ["1:15PM", "1:26PM"],
    ["1:30PM", "1:41PM"],
    ["1:45PM", "1:56PM"],
    ["2:00PM", "2:11PM"],
    ["2:15PM", "2:26PM"],
    ["2:30PM", "2:41PM"],
    ["2:45PM", "2:56PM"],
    ["3:00PM", "3:23PM"],
    ["3:15PM", "3:28PM"],
    ["3:30PM", "3:43PM"],
    ["3:45PM", "3:58PM"],
    ["4:00PM", "4:23PM"],
    ["4:15PM", "4:28PM"],
    ["4:30PM", "4:43PM"],
    ["4:45PM", "4:58PM"],
    ["5:00PM", "5:23PM"],
    ["5:15PM", "5:28PM"],
    ["5:30PM", "5:43PM"],
    ["5:45PM", "5:58PM"],
    ["6:00PM", "6:23PM"],
    ["6:15PM", "6:28PM"],
    ["6:30PM", "6:43PM"],
    ["6:45PM", "6:58PM"],
    ["7:00PM", "7:11PM"]
];



const gptokg = [
  ['7:12AM', '7:22AM'],
  ['7:27AM', '7:37AM'],
  ['7:42AM', '7:52AM'],
  ['7:57AM', '8:07AM'],
  ['8:12AM', '8:22AM'],
  ['8:27AM', '8:37AM'],
  ['8:42AM', '8:52AM'],
  ['8:57AM', '9:07AM'],
  ['9:11AM', '9:21AM'],
  ['9:26AM', '9:36AM'],
  ['9:41AM', '9:51AM'],
  ['9:56AM', '10:06AM'],
  ['10:11AM', '10:21AM'],
  ['10:26AM', '10:36AM'],
  ['10:41AM', '10:51AM'],
  ['10:56AM', '11:06AM'],
  ['11:11AM', '11:21AM'],
  ['11:26AM', '11:36AM'],
  ['11:41AM', '11:51AM'],
  ['11:56AM', '12:06PM'],
  ['12:11PM', '12:21PM'],
  ['12:26PM', '12:36PM'],
  ['12:41PM', '12:51PM'],
  ['12:56PM', '1:06PM'],
  ['1:11PM', '1:21PM'],
  ['1:26PM', '1:36PM'],
  ['1:41PM', '1:51PM'],
  ['1:56PM', '2:06PM'],
  ['2:11PM', '2:21PM'],
  ['2:26PM', '2:36PM'],
  ['2:41PM', '2:51PM'],
  ['2:56PM', '3:06PM'],
  ['3:13PM', '3:25PM'],
  ['3:28PM', '3:40PM'],
  ['3:43PM', '3:55PM'],
  ['3:58PM', '4:10PM'],
  ['4:13PM', '4:25PM'],
  ['4:28PM', '4:40PM'],
  ['4:43PM', '4:55PM'],
  ['4:58PM', '5:10PM'],
  ['5:13PM', '5:25PM'],
  ['5:28PM', '5:40PM'],
  ['5:43PM', '5:55PM'],
  ['5:58PM', '6:10PM'],
  ['6:11PM', '6:21PM'],
  ['6:26PM', '6:36PM'],
  ['6:41PM', '6:51PM'],
  ['6:56PM', '7:06PM'],
  ['7:11PM', '7:21PM']
];




		// Reply to the interaction with a loading message
		await interaction.reply({ content: '🔍 Checking information...', ephemeral: true });

		const option = interaction.options.getString('campus');
		try {
			const brisbaneTime = DateTime.now().setZone('Australia/Brisbane');
			const formattedTime = brisbaneTime.toFormat('h:mm a');
			let otherchoice;
			let origin;
			if (option === "GP") {
			otherchoice = "Kelvin Grove";
			origin = "Gardens Point";
function nearest(date = new Date()) {
  let minutes = date.getMinutes();
  let remainder = minutes % 15;
  let minutesToAdd = remainder === 0 ? 0 : 11 - remainder;
  date.setMinutes(minutes + minutesToAdd);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const options = {
    timeZone: 'Australia/Brisbane',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const brisbaneTime = new Intl.DateTimeFormat('en-AU', options).format(date);
  return brisbaneTime;
}
			}
			else {
			otherchoice = "Gardens Point";
			origin = "Kelvin Grove";
function nearest(date = new Date()) {
  let minutes = date.getMinutes();
  let remainder = minutes % 15;
  let minutesToAdd = remainder === 0 ? 0 : 15 - remainder;
  date.setMinutes(minutes + minutesToAdd);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const options = {
    timeZone: 'Australia/Brisbane',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const brisbaneTime = new Intl.DateTimeFormat('en-AU', options).format(date);
  return brisbaneTime;
}
			}

			// console.log(otherchoice);
			if (!formattedTime || formattedTime.length === 0) {
				// If no results found
				await interaction.editReply({ content: 'Hmmm, we had troble getting the data', ephemeral: true });
			} else {
				let roundedTime = nearest();
				console.log(roundedTime);
				const info = `The Next Shuttle from ${origin} to ${otherchoice} is estimated to depart at **${roundedTime}** \n Heads up: \n
The QUT Shuttle bus does not operate on weekends, public holidays and the end-of-year period when the university is closed, usually between Christmas and New Year.`; 
				//console.log(info)
				await interaction.editReply({ content: info });
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching bus information:', error);
			await interaction.editReply({ content: 'Hmmm, Something went wrong', ephemeral: true });
		}
	},
};

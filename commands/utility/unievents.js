const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require("https");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unievents')
		.setDescription('Upcomming events hosted by different clubs.'),
	async execute(interaction) {
		const url = 'https://api.hellorubric.com/';

		// Define request options
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
		};

		// Define the POST body
		const data = "details=%7B%22firstCall%22%3Afalse%2C%22sortType%22%3A%22date%22%2C%22desiredType%22%3A%22events%22%2C%22limit%22%3A12%2C%22offset%22%3A0%2C%22sortDirection%22%3A%22asc%22%2C%22searchQuery%22%3A%22%22%2C%22eventsPeriodFilter%22%3A%22All%22%2C%22countryCode%22%3A%22AU%22%2C%22state%22%3A%22Queensland%22%2C%22selectedUniversityId%22%3A%2214%22%2C%22currentUrl%22%3A%22https%3A%2F%2Fcampus.hellorubric.com%2Fsearch%3Ftype%3Devents%22%2C%22device%22%3A%22web_portal%22%2C%22version%22%3A4%7D&endpoint=getUnifiedSearch";

		// Make the HTTPS request
		let result = '';
		const req = https.request(url, options, (res) => {
			console.log(`Status Code: ${res.statusCode}`);

			if (res.statusCode !== 200) {
				interaction.reply({
					content: `Error: Received status code ${res.statusCode}`,
					ephemeral: true,
				});
				return;
			}

			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				result += chunk; // Append chunks to the result
			});

			res.on('end', () => {
				try {
					// Parse the JSON response
					const jsonResponse = JSON.parse(result);
					const events = jsonResponse["results"];
					past = [];
					events.forEach(function (item, index) {
						console.log(item);
						console.log(index + ": " + item);
  						past.push(` \n${(index+1)}. **[${item["title"]}](<https://campus.hellorubric.com${item["destination"]}>)** \n \t Hosted By: ${item["societyname"]} \n \t Price: ${item["info"]} \n \t EventType: ${item["subtitle"]}`);
					});
					// Reply with the parsed JSON


const embed = new EmbedBuilder()
  .setAuthor({
    name: "Code Network",
    url: "https://codenetwork.co/",
  })
  .setTitle("Upcomming Events Hosted by Clubs")
  // .setURL("https://example.com")
  .setDescription(`${past.length > 0 ? past : "No Data"}`)
  .setColor("#2bdb45")
  .setFooter({
    text: "Made with ❤️by Code Network",
    iconURL: "https://www.codenetwork.co/logo.png",
  })
  .setTimestamp();



					interaction.reply(
						{ embeds: [embed] }					);
				} catch (error) {
					console.error('Error encountered:', error);
					interaction.reply({
						content: 'Error: Unable to parse JSON response',
						ephemeral: true,
					});
				}
			});
		});

		// Handle request errors
		req.on('error', (e) => {
			console.error(`Problem with request: ${e.message}`);
			interaction.reply({
				content: 'Hmmm, Something went wrong while making the request.',
				ephemeral: true,
			});
		});

		// Write data to request body and end the request
		req.write(data);
		req.end();
	},
};

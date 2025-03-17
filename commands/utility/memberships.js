const { SlashCommandBuilder } = require('discord.js');
const https = require("https");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membership')
		.setDescription('Returns Membership information'),
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
		const data = "details=%7B%22societyid%22%3A%224917%22%2C%22domain%22%3A%22campus.hellorubric.com%22%2C%22currentUrl%22%3A%22https%3A%2F%2Fcampus.hellorubric.com%2F%3Ftab%3Dmemberships%26s%3D4917%22%2C%22device%22%3A%22web_portal%22%2C%22version%22%3A4%7D&endpoint=getSocietyLandingPage";

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
					const memberships = jsonResponse["sections"][2]["array"];
					past = [];
					memberships.forEach(function (item, index) {
						console.log(item);
						console.log(index + ": " + item);
  						past.push(` \n${(index+1)}. **[${item["title"]}](<${item["destination"]}>)** \n \t ${item["subtitle"]} \n \t Description: [${item["description"]}]\n \t Price: ${item["info"]}`);
					});
					// Reply with the parsed JSON
					interaction.reply({
						content: `**Code Network Memberships:**  ${past.length > 0 ? past : "No Data"}`,
					});
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

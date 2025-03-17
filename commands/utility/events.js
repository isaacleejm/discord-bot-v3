const { SlashCommandBuilder } = require('discord.js');
const https = require("https");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('events')
		.setDescription('Returns a list of Club Events'),
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
					const events = jsonResponse["sections"][0]["array"];
					const upcoming = [];
					const past = [];
					events.forEach(function (item, index) {
					console.log(item);
					console.log(index + ": " + item);
					if (item["upcoming"] == "0") {
					const date = item["formatteddate"]
					const formattedDateString = date.replace(".", ":");
					const dateObject = new Date(formattedDateString);
					const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
//					console.log("Unix Timestamp:", unixTimestamp);
  					past.push(` \n${(index+1)}. **[${item["title"]}](<${item["destination"]}>)** \n \t Date: ${item["formatteddate"]} (<t:${unixTimestamp}:R>) \n \t Location: [${item["subtitle"]}](<https://www.google.com/maps/search/?api=1&query=${item["subtitle"].replaceAll(" ", "+")}>)\n \t Price: ${item["info"]}`);
					} else {
  					upcoming.push(` \n${(index+1)}. **[${item["title"]}](<${item["destination"]}>)** \n \t Date: ${item["formatteddate"]} (<t:${unixTimestamp}:R>) \n \t Location: [${item["subtitle"]}](<https://www.google.com/maps/search/?api=1&query=${item["subtitle"].replaceAll(" ", "+")}>)\n \t Price: ${item["info"]}`);
					}
					});
					// Reply with the parsed JSON
					interaction.reply({
						content: `**Code Network Events** \n Upcoming Events: ${upcoming.length > 0 ? upcoming : "No Data"} \n Past Events: ${past.length > 0 ? past : "No Data"}`,
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

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // Use axios instead of request
const cheerio = require('cheerio');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, demuxProbe, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const play = require('play-dl');
const prism = require('prism-media');
const { exec } = require('child_process');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const http = require('http');
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song')
		.addStringOption(option =>
			option.setName('songname')
				.setDescription('Name of the song to lookup')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.voice.channel) {
  		return await interaction.reply({
    		content: 'You need to join a voice channel before using this command.',
    		ephemeral: true,
  		});
		return;
		}
		// Reply to the interaction with a loading message

		const option = interaction.options.getString('songname');
		//&filter=music_songs
		const url = `https://pipedapi.kavin.rocks/search?q=${option}&filter=all`;
		const voicestatus = interaction.member.voice.channel;
		//console.log(voicestatus);
		// play.authorization();
		await interaction.reply({ content: '🔍 Searching for song...', ephemeral: true });

		try {
			// Fetch the HTML data
			// const spotify = await play.search(option, { source : { deezer : "track" } })
			const response = await axios.get(url);
			const results = response.data.items;
			// console.log(spotify);
			if (!results || results === 0) {
				// If no results found
				await interaction.editReply({ content: 'No songs found', ephemeral: true });
			} else {
				// Create the select menu for user to choose
				const select = new StringSelectMenuBuilder()
					.setCustomId('starter')
					.setPlaceholder('Make a selection!')
					.addOptions(
						results.map(item => {
							return new StringSelectMenuOptionBuilder()
								.setLabel(item.title ?? "(No Title)")
								.setDescription(item.uploaderName ?? "Unknown Artist")
								.setValue(item.url.replace("/watch?v=", ""));
						})
					);

				const row = new ActionRowBuilder().addComponents(select);

				// Update the reply with the select menu
				const response = await interaction.editReply({
					content: 'Choose a song!',
					components: [row],
				});

				// Collector filter to ensure the user is interacting
				const collectorFilter = i => i.customId === 'starter' && i.user.id === interaction.user.id;

				// Await the interaction response with a timeout
				try {
					const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    					const connection = joinVoiceChannel({
						channelId: interaction.member.voice.channel.id,
						guildId: interaction.member.voice.channel.guild.id,
						adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
					});
					const player = createAudioPlayer({
						behaviors: {
							noSubscriber: NoSubscriberBehavior.Pause,
						},
					});
					//console.log('User selected:', confirmation.values);
					//const url = await getstuff(confirmation.values);
					const url = `https://youtube.com/embed/${confirmation.values}`
					// const media = getyt(url);
					// const media = "0"
					// console.log(media);
        				// const streams = ytdl(url, {
            				//	filter: "audioonly",
            				//	quality: 'highestaudio',
            				//	highWaterMark: 1 << 25
        				//});
					// ytdl(url, {filter: "audioonly"}).pipe(require("fs").createWriteStream("video.mp4"));
					// console.log(streams);
    					const transcoder = new prism.FFmpeg({
        					args: ['-analyzeduration', '0', '-loglevel', '0', '-f', 'opus', '-ar', '48000', '-ac', '2']
    					});


					const ffmpeg = require('child_process').spawn('ffmpeg', [
				        '-i', media,         // Input URL
    					'-reconnect', '1',
    					'-reconnect_streamed', '1',
    					'-reconnect_delay_max', '5',
				        '-analyzeduration', '0', // Low latency mode
				        '-loglevel', 'debug',        // Suppress logs
				        '-f', 'opus',            // Output format
				        '-ar', '48000',          // 48kHz sample rate
				        '-ac', '2',              // Stereo audio
				        'pipe:1'                 // Output to stdout (pipe)
				        ], { stdio: ['ignore', 'pipe', 'ignore'] });







    					// streams.pipe(transcoder);
					const source = play.stream(url);
					console.log(source);


        				//const resource = createAudioResource(ffmpeg.stdout);
					const resourcee = createAudioResource(createReadStream(join(__dirname, "./audio.weba"), {
					inputType: voice.StreamType.Arbitrary,
					}));

					// const resource = createAudioResource(streams, {
					// inputType: voice.StreamType.Arbitrary,
					// });

        				// const player = createAudioPlayer();

        				player.play(resourcee);
        				connection.subscribe(player);

					await confirmation.update({ content: `Playing ${idk}`, components: [] });
					// Handle the selected option (confirmation)
					//console.log(getstuff(confirmation.values));
					// await confirmation.update({ content: `You selected: ${getstuff(confirmation.values)}`, components: [] });
				} catch {
					await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
				}




async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}



async function getyt(url) {
    try {
        const info = await ytdl.getInfo(url);
        console.log(info);
        // Filter formats that have audio but no video, then sort by bitrate (highest first)
        const audioFormats = info.formats
            .filter(format => format.hasAudio && !format.hasVideo)
            .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

        if (!audioFormats.length) {
            throw new Error('No valid audio-only format found.');
        }
        // Return the URL of the highest quality audio format
        return audioFormats[0].url;
    } catch (error) {
        console.error('Error fetching YouTube audio info:', error);
        return null;
    }
}



async function getstuff(urls) {



// this is for dev only, bcs i have a custom pytube running on my local machine
    const url = `https://youtube.com/video?v=${urls}`;
    try {
        const response = await axios.get(url); // Wait for the HTTP request to complete
        const audiourl = response.data; // Load the HTML data
        return audiourl; // Return the extracted data
    } catch (error) {
        console.error('Error while fetching unit details:', error);
        return null; // Return null or handle error appropriately
    }
}
			}
		} catch (error) {
			// Handle request or parsing errors
			console.error('Error while fetching song data:', error);
			await interaction.editReply({ content: 'Hmmm, Something went wrong', ephemeral: true });
		}
	},
};

// DISCORD.JS

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Chumete Chumete!');
});

// login to Discord with token
const dotenv = require('dotenv');
dotenv.config();

client.login(process.env.TOKEN);

// Pinging
client.on('message', message => {
	if (message.content === '"ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
});
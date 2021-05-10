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

// Reply to messages || ${prefix} based on value in .env file
client.on('message', message => {
	// Pinging
    if (message.content.startsWith(`${process.env.prefix}ping`)) { // responds as long as startsWith given value
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}

    else if (message.content === `${process.env.prefix}beep`) {
		message.channel.send(`boop ${message.author} from ${message.guild.name} in ${message.guild.region}`); //mentions user, server name and region
	}

    // Fun
    else if (message.content === "chumete chumete") {
		message.channel.send('tobikiri igai');
	}
});
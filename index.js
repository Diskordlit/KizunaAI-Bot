// DISCORD.JS
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
client.on('message', async(message) => {
	if (!message.content.startsWith(`${process.env.prefix}`) || message.author.bot) return; // if message does not start with prefix or if author is bot, skip.

	// Ping
    if (message.content.startsWith(`${process.env.prefix}ping`)) { // responds as long as startsWith given value
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}

    // Beep
    else if (message.content === `${process.env.prefix}beep`) {
		message.channel.send(`boop ${message.author} from ${message.guild.name} in ${message.guild.region}`); //mentions user, server name and region
	}

    // Fun
    else if (message.content === "chumete chumete") {
		message.channel.send('tobikiri igai');
	}

    // Package Tracker
    else if (message.content.startsWith(`${process.env.prefix}track`)) {
        const args = message.content.slice(`${process.env.prefix}`.length).trim().split(' '); // args creates an array of the parameters passed after command
        const command = args.shift().toLowerCase(); // removes the command (first element in args) from the array

        const packageTracker = require('./package-tracker/post');

		if (!args.length){
            message.channel.send("You didn't tell me your package number and courier \n Hint: '\"track {package_number} {courier}'");
        }
        else if (args.length == 1){
            var postData = {"tracking_number": `${args[0]}`};
            var url      = 'http://api.tracktry.com/v1/carriers/detect';
        }
        else {
            var postData = null;
            var url      = `http://api.tracktry.com/v1/trackings/${args[1]}/${args[0]}`;
            const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));
            packageTracker.fetcher(url, "GET");
            wait(4*1000).then(() => {
                console.log(packageTracker.status);
                message.channel.send(`**Status : ** ${packageTracker.status} \n${packageTracker.lastEvent}`);
            }).catch(() => {
                failureCallback();
            });
        }
	}

    // Virus Total
    if (message.content.startsWith(`${process.env.prefix}url`)) {
        const args = message.content.slice(`${process.env.prefix}`.length).trim().split(' '); // args creates an array of the parameters passed after command
        const command = args.shift().toLowerCase(); // removes the command (first element in args) from the array
        
        const virusTotal =  require('./virustotal/post');
        console.log(args[0]);
        virusTotal.urlRequest(args[0]);

        function virusTotalResponse() {
            if (virusTotal.urlValidator == false){ // incorrect url
                message.channel.send("You did not give me a proper url!");
            } else if (virusTotal.status != 'completed'){ // check if VirusTotal processing completed due to free API limitation
                message.channel.send("Aw shucks, I can't get it for you this time due to VIrusTotal free API limitations, try again later");
            } else if (virusTotal.danger == true){ // if site is dangerous
                message.channel.send(`Uh-Oh! I wouldn't go there if I were you \n ${virusTotal.flags}/${virusTotal.totalEngines} engines detected this page as possibly malicious. \nVirusTotal engine findings: \n harmless: ${virusTotal.harmless} \n malicious: ${virusTotal.malicious} \n suspicious: ${virusTotal.suspicious} \n undetected: ${virusTotal.undetected}`);
            } else if (virusTotal.danger == false){ // if site is alright
                message.channel.send(`Looks alright to me! \n ${virusTotal.flags}/${virusTotal.totalEngines} engines detected this page as possibly malicious. \nVirusTotal engine findings: \n harmless: ${virusTotal.harmless} \n malicious: ${virusTotal.malicious} \n suspicious: ${virusTotal.suspicious} \n undetected: ${virusTotal.undetected}`);
            }
        }
        setTimeout(virusTotalResponse, 24000);
    }
});
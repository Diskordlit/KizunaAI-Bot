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
client.on('message', async (message) => {

    // Fun
    if (message.content === 'chumete chumete') {
        message.channel.send('tobikiri igai')
    }

    // I know right?
    if (message.content.includes('wtf')) {
        message.channel.send('I know right?')
    }

    // if message does not start with prefix or if author is bot, skip.
    if (!message.content.startsWith(`${process.env.prefix}`) || message.author.bot) return

    // Ping
    if (message.content.startsWith(`${process.env.prefix}ping`)) { // responds as long as startsWith given value
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }

    // Beep
    if (message.content === `${process.env.prefix}beep`) {
        message.channel.send(`boop ${message.author} from ${message.guild.name} in ${message.guild.region}`); //mentions user, server name and region
    }

    // Package Tracker
    if (message.content.startsWith(`${process.env.prefix}track`)) {
        const args = message.content.slice(`${process.env.prefix}`.length).trim().split(' '); // args creates an array of the parameters passed after command
        const command = args.shift().toLowerCase(); // removes the command (first element in args) from the array

        const packageTracker = require('./package-tracker/post');

        if (!args.length) {
            message.channel.send("You didn't tell me your package number and courier \n Hint: '\"track {package_number} {courier}'");
        } else if (args.length == 1) {
            var postData = {
                "tracking_number": `${args[0]}`
            };
            var url = 'http://api.tracktry.com/v1/carriers/detect';
        } else {
            var postData = null;
            var url = `http://api.tracktry.com/v1/trackings/${args[1]}/${args[0]}`;
            const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
            packageTracker.fetcher(url, "GET");
            wait(4 * 1000).then(() => {
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

        const virusTotal = require('./virustotal/post');
        console.log(args[0]);
        virusTotal.urlRequest(args[0]);

        function virusTotalResponse() {
            if (virusTotal.urlValidator == false) { // incorrect url
                message.channel.send("You did not give me a proper url!");
            } else if (virusTotal.status != 'completed') { // check if VirusTotal processing completed due to free API limitation
                message.channel.send("Aw shucks, I can't get it for you this time due to VirusTotal free API limitations, try again later");
            } else if (virusTotal.danger == true) { // if site is dangerous
                message.channel.send(`Uh-Oh! I wouldn't go there if I were you \n ${virusTotal.flags}/${virusTotal.totalEngines} engines detected this page as possibly malicious. \nVirusTotal engine findings: \n harmless: ${virusTotal.harmless} \n malicious: ${virusTotal.malicious} \n suspicious: ${virusTotal.suspicious} \n undetected: ${virusTotal.undetected}`);
            } else if (virusTotal.danger == false) { // if site is alright
                message.channel.send(`Looks alright to me! \n ${virusTotal.flags}/${virusTotal.totalEngines} engines detected this page as possibly malicious. \nVirusTotal engine findings: \n harmless: ${virusTotal.harmless} \n malicious: ${virusTotal.malicious} \n suspicious: ${virusTotal.suspicious} \n undetected: ${virusTotal.undetected}`);
            }
        }
        setTimeout(virusTotalResponse, 24000);
    }

    if (message.content.startsWith(`${process.env.prefix}cum`)) {
        const args = message.content.slice(`${process.env.prefix}`.length).trim().split(' ')
        args.shift().toLowerCase()
        attemptCount = 0
        queryToVirusTotal(message, args[0])
    }
});

var attemptCount = 0

async function queryToVirusTotal(message, args) {
    const urlRequest = require('./virustotal/virustotal.js')
    const result = await urlRequest(args)
    if (result.resolved && isItSafe(result.stats)) {
        message.channel.send(`Looks alright to me!\n\n${resultToString(result.stats)}`)
    } else if (result.resolved && !isItSafe(result.stats)) {
        message.channel.send(`I wouldn't go there if I were you...\n\n${resultToString(result.stats)}`)
    } else {
        if (result.code === 'VIRUSTOTALREJECT001') {
            return message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
        }
        attemptCount++
        var retryArgs = args
        var retryMessage = message
        // var sentMessage = await message.channel.send(`Aw shucks, I can't get it for you on time. ${result.message}. ${result.solution}`)
        var sentMessage = await message.channel.send(`Aw shucks, I can't get it for you on time. Lemme retry real quick! Attempt number ${attemptCount}, let's go!`)
        setTimeout(() => {
            if (attemptCount >= 3) {
                message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
                return sentMessage.delete()
            }
            queryToVirusTotal(retryMessage, retryArgs)
            sentMessage.delete()
        }, 2000)
    }

}

function isItSafe(json) {
    if (json.malicious > 5 || json.suspicious > 8) return false
    return true
}

function resultToString(json) {
    const flaggedEngineCount = json.malicious + json.suspicious
    const totalEngines = json.harmless + json.malicious + json.suspicious
    return 'These are the readings from VirusTotal engines:\n' +
        `${flaggedEngineCount}/${totalEngines} engines detected this site as possibly malicious\n` +
        `Harmless: ${json.harmless}\n` +
        `Malicious: ${json.malicious}\n` +
        `Suspicious: ${json.suspicious}\n` +
        `Undetected: ${json.undetected}\n` +
        `Timeout: ${json.timeout}\n` +
        `Number of supported engines (excluding undetected and timeout): ${totalEngines}\n`
}
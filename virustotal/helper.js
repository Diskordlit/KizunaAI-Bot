// Please discontinue using this and create a localized variable for every
// called functions
exports.attemptCount = 0

exports.queryToVirusTotal = async (message, args) => {
    try {
        const urlRequest = require('../virustotal/virustotal')
        const result = await urlRequest(args)
        if (result.resolved && isItSafe(result.stats)) {
            message.channel.send(`Looks alright to me!\n\n${resultToString(result.stats)}`)
        } else if (result.resolved && !isItSafe(result.stats)) {
            message.channel.send(`I wouldn't go there if I were you...\n\n${resultToString(result.stats)}`)
        } else {
            if (result.code === 'VIRUSTOTALREJECT001') {
                return message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
            }
            this.attemptCount++
            var retryArgs = args
            var retryMessage = message
            // var sentMessage = await message.channel.send(`Aw shucks, I can't get it for you on time. ${result.message}. ${result.solution}`)
            var sentMessage = await message.channel.send(`Aw shucks, I can't get it for you on time. Lemme retry real quick! Attempt number ${attemptCount}, let's go!`)
            setTimeout(() => {
                if (attemptCount >= 3) {
                    message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
                    return sentMessage.delete()
                }
                this.queryToVirusTotal(retryMessage, retryArgs)
                sentMessage.delete()
            }, 2000)
        }
    } catch (error) {
        console.error(error)
        message.channel.send(`Aw shucks, I encountered an error while trying to process your request!\nLet me read the error for you.\n\`${error.message}\``)
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
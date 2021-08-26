const fetch = require('node-fetch')
const dotenv = require('dotenv')
dotenv.config()

async function urlRequest(url) {
    const FormData = require('form-data')

    const form = new FormData()
    form.append('url', url)

    const result = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: "POST",
        headers: {
            'x-apikey': `${process.env.VIRUSTOTAL_API_KEY}`
        },
        body: form
    }).then(result => result.json()).catch(error => {
        return {
            resolved: false,
            code: error.code,
            codetext: error.errno,
            message: 'Query made to VirusTotal API failed',
            solution: 'It could be due to network failure. Try again later.'
        }
    })

    try {
        // Will throw an exception if there is no ID
        var isThereID = result.data.id
    } catch {
        return {
            resolved: false,
            code: 'VIRUSTOTALREJECT001',
            codetext: 'REJECTED_DUE_TO_NO_REQUEST_ID',
            message: 'Query check failed to resolve the ID of the request made',
            solution: 'You could do me a favour by checking if the URL you sent is valid.'
        }
    }

    const query = await fetch(`https://www.virustotal.com/api/v3/analyses/${result.data.id}`, {
        method: "GET",
        headers: {
            'x-apikey': `${process.env.VIRUSTOTAL_API_KEY}`
        }
    }).then(result => result.json())

    return new Promise((resolve, reject) => {
        if (query.data.attributes.status === 'completed') {
            return resolve({
                resolved: true,
                code: 'VIRUSTOTALRESOLVE001',
                codetext: 'RESOLVED_WITH_COMPLETED_STATUS',
                message: 'Status check returned a \'completed\' status',
                stats: query.data.attributes.stats
            })
        }
        if (query.data.attributes.status === 'queued') {
            return reject({
                resolved: false,
                code: 'VIRUSTOTALREJECT002',
                codetext: 'REJECTED_DUE_TO_REQUEST_BEING_QUEUED',
                message: 'Status check returned a \'queued\' status',
                solution: 'Send the same URL again right after this and see if the result is ready!'
            })
        }
        return reject({
            resolved: false,
            code: 'VIRUSTOTALREJECT999',
            codetext: 'REJECTED_DUE_TO_STATUS_BEING_UNKNOWN',
            message: 'Status check returned anything besides from those which are handled',
            solution: 'Nothing I can do, kiddo.'
        })
    }).catch((rejection) => {
        return rejection
    })
}

module.exports = urlRequest
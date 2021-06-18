// Using Node-Fetch
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

exports.urlRequest = (url) => {
    const FormData = require('form-data');

    const form = new FormData();
    form.append('url', url);

    fetch('https://www.virustotal.com/api/v3/urls', {
        method: "POST",
        headers: { 'x-apikey': `${process.env.VirusTotalApiKey}` },
        body: form
    })
    .then(res => res.json())
    .then(json => {

        try{
            exports.urlValidator = true; // determine if user sent a proper url
            console.log(json.data.id);
            var id = json.data.id;
        } catch {
            exports.urlValidator = false; // if error is triggered, user did not send a proper url
        }

        function virusTotalResult(){
            fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
                method: "GET",
                headers: { 'x-apikey': `${process.env.VirusTotalApiKey}` }
            })
            .then(res => res.json())
            .then(json => {
                console.log(json.data.attributes.status);
                console.log(json.data.attributes.stats);
                console.log(json.data.attributes.stats.malicious + json.data.attributes.stats.suspicious);
                
                exports.status = json.data.attributes.status; // check if request is still queued or completed

                // Number of flags for each category
                exports.harmless = json.data.attributes.stats.harmless;
                exports.malicious = json.data.attributes.stats.malicious;
                exports.suspicious = json.data.attributes.stats.suspicious;
                exports.undetected = json.data.attributes.stats.undetected;

                exports.flags = json.data.attributes.stats.malicious + json.data.attributes.stats.suspicious; // how many suspicious / mailcious flags
                exports.totalEngines = json.data.attributes.stats.harmless 
                                    + json.data.attributes.stats.malicious 
                                    + json.data.attributes.stats.suspicious; // number of engines that scanned the url

                exports.danger = false;
                if(exports.malicious > 5 || exports.suspicious > 8){
                    exports.danger = true; // mark url as dangerous if more than 5 mailious flags or 8 suspicious flags
                }
            });
        }

        if (exports.urlValidator == true){
            setTimeout(virusTotalResult, 20000); // timeout due to VirusTotal limitations
        }
    });
};
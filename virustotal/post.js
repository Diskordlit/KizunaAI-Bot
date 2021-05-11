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
        headers: { 'x-apikey': '2b0b9e67a2ca7ae47954bb063346f3c8b03675b4aca816765a10c8de37c75e25' },
        body: form
    })
    .then(res => res.json())
    .then(json => {
        console.log(json.data.id);
        var id = json.data.id;

        fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
            method: "GET",
            headers: { 'x-apikey': '2b0b9e67a2ca7ae47954bb063346f3c8b03675b4aca816765a10c8de37c75e25' }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json.data.attributes.stats);
            console.log(json.data.attributes.stats.malicious + json.data.attributes.stats.suspicious);
            exports.harmless = json.data.attributes.stats.harmless;
            exports.malicious = json.data.attributes.stats.malicious;
            exports.suspicious = json.data.attributes.stats.suspicious;
            exports.undetected = json.data.attributes.stats.undetected;

            exports.flags = json.data.attributes.stats.malicious + json.data.attributes.stats.suspicious;
            exports.totalEngines = json.data.attributes.stats.harmless 
                                 + json.data.attributes.stats.malicious 
                                 + json.data.attributes.stats.suspicious;

            exports.danger = false;
            if(exports.malicious > 5 || exports.suspicious > 8){
                exports.danger = true;
            }
        });
    });
};
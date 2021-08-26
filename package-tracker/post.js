// Using Node-Fetch
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

exports.fetcher = (url, action) => {
    fetch(url, {
        method: action,
        headers: {
            'Content-Type': 'application/json',
            'Tracktry-Api-Key': `${process.env.TRACKTRY_API_KEY}`
        }
    })
    .then(res => res.json())
    .then(json => {
        try{
        console.log(json);
        console.log(json.data[0].status);
        console.log(json.data[0].lastEvent);
        console.log(json.data[0].lastUpdateTime);

        exports.status = json.data[0].status;
        exports.lastEvent = json.data[0].lastEvent;
        exports.lastUpdateTime = json.data[0].lastUpdateTime;
        }
        catch (error){
            
        }
    });
};
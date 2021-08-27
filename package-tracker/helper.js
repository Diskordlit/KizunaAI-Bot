const trackTry = require('./tracktry.js')

exports.queryTTryTrackThis = async (message, args) => {
    try {
        if (args[0] === undefined || args[1] === undefined) throw new Error('First and second argument must not be empty!')
        const metadata = {
            trackingNumber: args[0],
            courierCode: args[1],
            deliveryTitle: args[2] || undefined,
            customerName: args[3] || undefined,
            customerEmail: args[4] || undefined,
            orderID: args[5] || undefined,
            orderCreationTime: args[6] || undefined,
            destinationCode: args[7] || undefined,
            trackingShipDate: args[8] || undefined,
            trackingPostalCode: args[9] || undefined,
            language: args[10] || undefined,
            logisticsChannel: args[11] || undefined
        }
        // message.channel.send(JSON.stringify(metadata))
        const result = await trackTry.trackThisParcel(metadata)
        // console.log(result)
        if (result.resolved) {
            message.channel.send(`Nicely done!\n\n${trackResultToString(result)}`)
        } else {
            message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
        }
    } catch (error) {
        console.error(error)
        message.channel.send(`Aw shucks, I encountered an error while trying to process your request!\nLet me read the error for you.\n\`${error.message}\``)
    }
}

exports.queryTTryThisStatus = async (message, args) => {
    try {
        if (args[0] === undefined || args[1] === undefined) throw new Error('First and second argument must not be empty!')
        const metadata = {
            trackingNumber: args[0],
            courierCode: args[1]
        }
        const result = await trackTry.getStatusOfThisParcel(metadata)
        console.log(result)
        if (result.resolved) {
            message.channel.send(`Got it!\n\n${statusResultToString(result)}`)
        } else {
            message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
        }
    } catch (error) {
        console.error(error)
        message.channel.send(`Aw shucks, I encountered an error while trying to process your request!\nLet me read the error for you.\n\`${error.message}\``)
    }
}

exports.queryTTryUpdateThis = async (message, args) => {
    try {
        if (args[0] === undefined || args[1] === undefined) throw new Error('First and second argument must not be empty!')
        const metadata = {
            trackingNumber: args[0],
            courierCode: args[1],
            deliveryTitle: args[2] || undefined,
            customerName: args[3] || undefined,
            customerEmail: args[4] || undefined,
            orderID: args[5] || undefined,
            logisticsChannel: args[6] || undefined
        }
        const result = await trackTry.updateThisParcel(metadata)
        console.log(result)
        if (result.resolved) {
            message.channel.send(`Awesome!\n\n${updateResultToString(result)}`)
        } else {
            message.channel.send(`Aw shucks, I can't get it for you this time. ${result.message}. ${result.solution}`)
        }
    } catch (error) {
        console.error(error)
        message.channel.send(`Aw shucks, I encountered an error while trying to process your request!\nLet me read the error for you.\n\`${error.message}\``)
    }
}


function trackResultToString(json) {
    return 'These are the details of the newly-added tracking:\n' +
        `Tracking ID: ${json.data.id}\n` +
        `Tracking Number: ${json.data.tracking_number}\n` +
        `Courier Code: ${json.data.courier_code}\n` +
        `Order Creation Time: ${json.data.order_create_time !== '' ? json.data.order_create_time : 'Not Available'}\n` +
        `Status: ${json.data.status}\n` +
        `Tracking Created At: ${json.data.created_at}\n` +
        `Customer Name: ${json.data.customer_name !== '' ? json.data.customer_name : 'Not Available'}\n` +
        `Comment: ${json.data.comment !== '' ? json.data.comment : 'Not Available'}\n` +
        `Logistics Channel: ${json.data.logistics_channel !== '' ? json.data.logistics_channel : 'Not Available'}\n` +
        `Destination: ${json.data.destination !== '' ? json.data.destination : 'Not Available'}\n`
}

function statusResultToString(json) {
    return 'These are the details of the delivery:\n' +
        `Tracking ID: ${json.data.id}\n` +
        `Tracking Number: ${json.data.tracking_number}\n` +
        `Courier Code: ${json.data.courier_code}\n` +
        `Order Creation Time: ${json.data.order_create_time !== null ? json.data.order_create_time : 'Not Available'}\n` +
        `Status: ${json.data.status}\n` +
        `Tracking Created At: ${json.data.created_at}\n` +
        `Customer Name: ${json.data.customer_name !== null ? json.data.customer_name : 'Not Available'}\n` +
        `Comment: ${json.data.comment !== null ? json.data.comment : 'Not Available'}\n` +
        `Last Event: ${json.data.lastEvent !== '' ? json.data.lastEvent : 'Not Available'}\n` +
        `Last Update: ${json.data.lastUpdateTime !== '' ? json.data.lastUpdateTime : 'Not Available'}\n`
}

function updateResultToString(json) {
    return 'These are the details of the delivery:\n' +
        `Tracking ID: ${json.data.id}\n` +
        `Tracking Number: ${json.data.tracking_number}\n` +
        `Courier Code: ${json.data.courier_code}\n` +
        `Tracking Created At: ${json.data.created_at}\n` +
        `Tracking Updated At: ${json.data.updated_at}\n` +
        `Customer Name: ${json.data.customer_name !== null ? json.data.customer_name : 'Not Available'}\n` +
        `Customer Email: ${json.data.customer_email !== null ? json.data.customer_email : 'Not Available'}\n` +
        `Order ID: ${json.data.order_id !== null ? json.data.order_id : 'Not Available'}\n` +
        `title: ${json.data.title !== null ? json.data.title : 'Not Available'}\n` +
        `Destination Code: ${json.data.destination_code !== null ? json.data.destination_code : 'Not Available'}\n` +
        `Logistics Channel: ${json.data.logistics_channel !== null ? json.data.logistics_channel : 'Not Available'}\n` +
        `Archived: ${json.data.archived !== null ? json.data.archived : 'Not Available'}\n`
    }
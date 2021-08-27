// Using Node-Fetch
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

// API base url
// https://api.tracktry.com/v1

exports.trackThisParcel = async (metadata) => {
    var body = {
        tracking_number: metadata.trackingNumber,
        carrier_code: metadata.courierCode,
        title: metadata.deliveryTitle || undefined,
        customer_name: metadata.customerName || undefined,
        customer_email: metadata.customerEmail || undefined,
        order_id: metadata.orderID || undefined,
        order_create_time: metadata.orderCreationTime || undefined,
        destination_code: metadata.destinationCode || undefined,
        tracking_ship_date: metadata.trackingShipDate || undefined,
        tracking_postal_code: metadata.trackingPostalCode || undefined,
        lang: metadata.language || undefined,
        logistics_channel: metadata.logisticsChannel || undefined
    }

    body = JSON.stringify(body)

    const result = await fetch(`${process.env.TRACKTRY_BASE_URL}/trackings/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Tracktry-Api-Key': `${process.env.TRACKTRY_API_KEY}`
        },
        body: body
    }).then(result => result.json()).catch(error => {
        return {
            resolved: false,
            code: error.code,
            codetext: error.errno,
            message: 'Query made to TrackTry API failed',
            solution: 'It could be due to network failure. Try again later.'
        }
    })

    return new Promise((resolve, reject) => {
        if (result['meta']['code'] === 200) {
            return resolve({
                resolved: true,
                code: 'TRACKTRYRESOLVE001',
                codetext: 'RESOLVED_WITH_CODE_200',
                message: 'Code check returned a 200 HTTP code',
                data: {
                    id: result.id,
                    tracking_number: result.tracking_number,
                    courier_code: result.carrier_code,
                    order_create_time: result.order_create_time,
                    status: result.status,
                    created_at: result.created_at,
                    customer_name: result.customer_name,
                    order_id: result.order_id,
                    comment: result.comment,
                    logistics_channel: result.logistics_channel,
                    destination: result.destination,
                }
            })
        }
        if (result['meta']['code'] === 4016) {
            return reject({
                resolved: false,
                code: 'TRACKTRYREJECT001',
                codetext: 'REJECTED_DUE_TO_BAD_REQUEST',
                message: 'Code check returned bad request being made to the API server',
                solution: 'It could mean many things such as the tracking already added before to the server. I am not sure either.'
            })
        }
        return reject({
            resolved: false,
            code: 'TRACKTRYREJECT999',
            codetext: 'REJECTED_DUE_TO_CODE_BEING_UNKNOWN',
            message: 'Code check returned anything besides from those which are handled',
            solution: 'Nothing I can do, kiddo.'
        })
    }).catch((rejection) => {
        return rejection
    })
}
exports.trackTheseParcels = async () => {}
exports.getStatusOfThisParcel = async (metadata) => {
    const result = await fetch(`${process.env.TRACKTRY_BASE_URL}/trackings/${metadata.courierCode}/${metadata.trackingNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Tracktry-Api-Key': `${process.env.TRACKTRY_API_KEY}`
        }
    }).then(result => result.json()).catch(error => {
        return {
            resolved: false,
            code: error.code,
            codetext: error.errno,
            message: 'Query made to TrackTry API failed',
            solution: 'It could be due to network failure. Try again later.'
        }
    })

    return new Promise((resolve, reject) => {
        if (result['meta']['code'] === 200) {
            return resolve({
                resolved: true,
                code: 'TRACKTRYRESOLVE002',
                codetext: 'RESOLVED_WITH_CODE_200',
                message: 'Code check returned a 200 HTTP code',
                data: {
                    id: result.data[0]['id'],
                    tracking_number: result.data[0]['tracking_number'],
                    courier_code: result.data[0]['carrier_code'],
                    status: result.data[0]['status'],
                    created_at: result.data[0]['created_at'],
                    updated_at: result.data[0]['updated_at'],
                    order_create_time: result.data[0]['order_create_time'],
                    customer_email: result.data[0]['customer_email'],
                    title: result.data[0]['title'],
                    order_id: result.data[0]['order_id'],
                    comment: result.data[0]['comment'],
                    customer_name: result.data[0]['customer_name'],
                    archived: result.data[0]['archived'],
                    original_country: result.data[0]['original_country'],
                    itemTimeLength: result.data[0]['itemTimeLength'],
                    stayTimeLength: result.data[0]['stayTimeLength'],
                    service_code: result.data[0]['service_code'],
                    status_info: result.data[0]['status_info'],
                    origin_info: result.data[0]['origin_info'],
                    destination_info: result.data[0]['destination_info'],
                    lastEvent: result.data[0]['lastEvent'],
                    lastUpdateTime: result.data[0]['lastUpdateTime']
                }
            })
        }
        if (result['meta']['code'] === 4031) {
            return reject({
                resolved: false,
                code: 'TRACKTRYREJECT002',
                codetext: 'REJECTED_DUE_TO_NO_CONTENT_FOUND',
                message: 'Code check returned no content to be found',
                solution: 'It could be that the ID is not tracked. Try tracking the parcel first.'
            })
        }
        if (result['meta']['code'] === 4032) {
            return reject({
                resolved: false,
                code: 'TRACKTRYREJECT003',
                codetext: 'REJECTED_DUE_TO_NO_COURIER_FOUND',
                message: 'Code check returned no courier to be found',
                solution: 'It could be that the courier is not supported by TrackTry. Make sure the spelling is all correct and supported by the API.'
            })
        }
        return reject({
            resolved: false,
            code: 'TRACKTRYREJECT999',
            codetext: 'REJECTED_DUE_TO_CODE_BEING_UNKNOWN',
            message: 'Code check returned anything besides from those which are handled',
            solution: 'Nothing I can do, kiddo.'
        })
    }).catch((rejection) => {
        return rejection
    })
}
exports.updateThisParcel = async (metadata) => {
    var body = {
        title: metadata.deliveryTitle || undefined,
        customer_name: metadata.customerName || undefined,
        customer_email: metadata.customerEmail || undefined,
        order_id: metadata.orderID || undefined,
        logistics_channel: metadata.logisticsChannel || undefined
    }

    body = JSON.stringify(body)

    const result = await fetch(`${process.env.TRACKTRY_BASE_URL}/trackings/${metadata.courierCode}/${metadata.trackingNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Tracktry-Api-Key': `${process.env.TRACKTRY_API_KEY}`
        },
        body: body
    }).then(result => result.json()).catch(error => {
        return {
            resolved: false,
            code: error.code,
            codetext: error.errno,
            message: 'Query made to TrackTry API failed',
            solution: 'It could be due to network failure. Try again later.'
        }
    })

    return new Promise((resolve, reject) => {
        if (result['meta']['code'] === 200) {
            return resolve({
                resolved: true,
                code: 'TRACKTRYRESOLVE003',
                codetext: 'RESOLVED_WITH_CODE_200',
                message: 'Code check returned a 200 HTTP code',
                data: {
                    id: result.data.id,
                    tracking_number: result.data.tracking_number,
                    courier_code: result.data.carrier_code,
                    created_at: result.data.created_at,
                    updated_at: result.data.updated_at,
                    customer_email: result.data.customer_email,
                    title: result.data.title,
                    order_id: result.data.order_id,
                    customer_name: result.data.customer_name,
                    archived: result.data.archived,
                    destination_code: result.data.destination_code,
                    logistics_channel: result.data.logistics_channel
                }
            })
        }
        return reject({
            resolved: false,
            code: 'TRACKTRYREJECT999',
            codetext: 'REJECTED_DUE_TO_CODE_BEING_UNKNOWN',
            message: 'Code check returned anything besides from those which are handled',
            solution: 'Nothing I can do, kiddo.'
        })
    }).catch(rejection => {
        return rejection
    })
}
exports.deleteThisParcel = async () => {}
exports.deleteTheseParcels = async () => {}
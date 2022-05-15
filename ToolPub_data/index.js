require('dotenv').config()
var moment = require('moment-timezone');
const mqtt = require('mqtt')
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
})
const generateRandomValue = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1))
}
let wH = 100000
const public = () => {
    const calKwh = () => {
        wH = wH +100
        const KwH = Math.floor(wH/1000)
        return KwH
    }
    let iot_data = `{
        "Type": "inverter/sensor",
        "data":[
           {"AmpsA": 116.1},
           {"AmpsB": 118.1},
           {"AmpsC": 119.1},
           {"VoltAN": 230.1},
           {"VoltBN": 230.1},
           {"VoltCN": 230.1},
           {"Watts": ${generateRandomValue(200, 300)}},
           {"Hz": 49.96},
           {"VA": 166.67},
           {"VAr": 133.32},
           {"PF": 0.97},
           {"KWH": ${calKwh()}},
           {"WH_Original": 132801},
           {"DCAmps": 167},
           {"DCVolt": 660},
           {"DCWatts": 110000},
           {"tmpCab": 69.9},
           {"operatingState": "STARTING"},
           {"VoltRef": 380}
           ],
        "timeStamp": ${moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ssss')}
        }`
    console.log('Start Public Data to Broker!!!!!')
    client.publish(topic, iot_data, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
    })
}
console.log('Service test is runing')
const topic = 'Device/StationId/DeviceId'
client.on('connect', () => {
    setInterval(public, 1000*60*2)
})


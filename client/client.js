import net from "net"
import mqtt from "mqtt"
import fs from "fs"


const MOSQUITTO_BROKER = "mqtt://sd_mosquitto"
const MOSQUITTO_PORT = 1883

const socket_client = new net.Socket();
const mqtt_client = mqtt.connect(MOSQUITTO_BROKER, {port: MOSQUITTO_PORT});


const socket_server_ip = "sd_server"
const socket_server_port = 60600
const topic = "secret"


socket_client.connect(socket_server_port, socket_server_ip, ( )=> {
    console.log('Oi servidor, socket. Me inscreva nesse topico aqui por favor :)');
    socket_client.write(topic);
});

socket_client.on('data',(data) => {
    console.log('Received from server: ' + data);
});

socket_client.on('close', () => {
    console.log('Connection closed');
});

socket_client.on('error', (err) => {
    console.log('Error: ' + err.message);
});

mqtt_client.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    mqtt_client.subscribe(topic, (err) => {
        if (err) {
            console.log('Subscription failed:', err);
        } else {
            console.log('Subscribed to topic: ' + topic);
        }
    });
});

mqtt_client.on('message', (topic, message) => {
    const message_as_str = message.toString();
    console.log(message_as_str);
    fs.appendFile('log.txt', `${topic}:${message_as_str}\n`, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        } else {
            console.log('Message logged to log.txt');
        }
    });
});

mqtt_client.on('error', (err) => {
    console.error('MQTT Error:', err);
});
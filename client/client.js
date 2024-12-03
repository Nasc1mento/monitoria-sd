import net from "net"
import mqtt from "mqtt"

const client = new net.Socket();
const client_mqtt = mqtt.connect('mqtt://broker.hivemq.com');

let topic = "secret"

client.connect(60600, '127.0.0.1', ( )=> {
    console.log('Oi servidor, socket. Me inscreva nesse topico aqui por favor :)');
    client.write(topic);
});

client.on('data',(data) => {
    console.log('Received from server: ' + data);
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.log('Error: ' + err.message);
});

client_mqtt.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    client_mqtt.subscribe(topic, (err) => {
        if (err) {
            console.log('Subscription failed:', err);
        } else {
            console.log('Subscribed to topic: ' + topic);
        }
    });
});

client_mqtt.on('message', (topic, message) => {
    console.log(`Received message from topic ${topic}: ${message.toString()}`);
});

client_mqtt.on('error', (err) => {
    console.error('MQTT Error:', err);
});
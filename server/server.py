import socket
import paho.mqtt.client as mqtt
import time
import threading

ip_server = "0.0.0.0"
port_number = 60600
endpoint_server = (ip_server, port_number)
buffer_size = 1024

mqtt_broker = "broker.hivemq.com"  
mqtt_port = 1883         

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code: " + str(rc))

def mqtt_publish_ping(client, topic):
    while True:
        if topic:
            client.publish(topic, "ping", qos=1)
            print(f"Ping sent to {topic}")
        time.sleep(3)

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.connect(mqtt_broker, mqtt_port, 60)

server_socket_tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket_tcp.bind(endpoint_server)
server_socket_tcp.listen(5)

mqtt_thread = threading.Thread(target=mqtt_client.loop_start)
mqtt_thread.start()

print(f"Server is listening on {ip_server}:{port_number}...")

while True:
    client_connection, client_address = server_socket_tcp.accept()
    print(f"Connection established with {client_address}")
    
    data_client = client_connection.recv(buffer_size)
    if data_client:

        mqtt_topic = data_client.decode("utf-8")
        print(f"Received topic from client: {mqtt_topic}")
        
        ping_thread = threading.Thread(target=mqtt_publish_ping, args=(mqtt_client, mqtt_topic))
        ping_thread.start()

    client_connection.close()

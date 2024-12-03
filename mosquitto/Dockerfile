FROM eclipse-mosquitto:latest

EXPOSE 1883 9001

COPY ./mosquitto.conf /mosquitto/config/mosquitto.conf

CMD ["mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]

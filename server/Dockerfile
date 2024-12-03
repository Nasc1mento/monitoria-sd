FROM python:3.9-slim

WORKDIR /app

COPY server.py .

RUN pip install --no-cache-dir paho-mqtt

EXPOSE 60600

CMD ["python", "server.py"]

from flask import Flask, render_template, jsonify, request
from threading import Thread, Lock
import time
import adafruit_dht
import board
import requests

app = Flask(__name__)

# Initialize DHT11 on GPIO 4 (Pin 7)
dht_device = adafruit_dht.DHT11(board.D4)
data_lock = Lock()

# In-memory data
sensor_data = {
    "timestamps": [],
    "temperatures": [],
    "humidity": [],
    "latest": {"temperature": None, "humidity": None, "timestamp": None}
}

def get_sensor_data(retries=5, delay=2):
    for i in range(retries):
        try:
            # Force reinitialization in case previous instance is corrupted
            global dht_device
            dht_device = adafruit_dht.DHT11(board.D4)
            
            temperature = dht_device.temperature
            humidity = dht_device.humidity
            print(f"DEBUG: Attempt {i+1} - Temp={temperature}, Humidity={humidity}")
            
            if temperature is not None and humidity is not None:
                return round(temperature, 1), round(humidity, 1)
        except Exception as e:
            print(f"Sensor read error: {e}")
        time.sleep(delay)
    return (
        sensor_data["latest"]["temperature"] or 0,
        sensor_data["latest"]["humidity"] or 0
    )


def sensor_loop():
    while True:
        temp, hum = get_sensor_data()
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"DEBUG: Updating sensor_data with temp={temp}, hum={hum}, timestamp={timestamp}")
        with data_lock:
            sensor_data["timestamps"].append(timestamp)
            sensor_data["temperatures"].append(temp)
            sensor_data["humidity"].append(hum)
            sensor_data["latest"] = {
                "temperature": temp,
                "humidity": hum,
                "timestamp": timestamp
            }

            # Keep only the last 30 readings
            if len(sensor_data["timestamps"]) > 30:
                for key in ["timestamps", "temperatures", "humidity"]:
                    sensor_data[key].pop(0)
        time.sleep(15)
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    with data_lock:
        return jsonify(sensor_data)  # ✅ already includes 'latest'

# Mistral API
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "your_api_key_here")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "")
    if not user_msg:
        return jsonify({"error": "Empty message"}), 400

    with data_lock:
        latest = sensor_data["latest"]
        context = (
            f"Latest reading at {latest['timestamp']}:\n"
            f"Temperature: {latest['temperature']}°C\n"
            f"Humidity: {latest['humidity']}%\n\n"
            f"User asked: {user_msg}"
        )

    try:
        payload = {
            "model": "mistral-medium",
            "messages": [{"role": "user", "content": context}]
        }
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        resp = requests.post(MISTRAL_API_URL, json=payload, headers=headers)
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        reply = f"Error contacting Mistral API: {e}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    thread = Thread(target=sensor_loop, daemon=True)
    thread.start()
    app.run(host="0.0.0.0", port=5050, debug=True)

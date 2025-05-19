from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import json
import datetime
import os
import random  # For demo data generation

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cansat-secret-key!'
socketio = SocketIO(app)

# In-memory storage for demo purposes
# In a real application, you might use a database
## Do something about it aciu
cansat_data = {
    'gps': {'lat': 0, 'lon': 0, 'alt': 0},
    'linear_acceleration': {'x': 0, 'y': 0, 'z': 0},
    'heading': {'azimuth': 0, 'pitch': 0, 'roll': 0},
    'altitude': 0,
    'pressure': 0,
    'temperature': 0,
    'gyro': {'x': 0, 'y': 0, 'z': 0},
    'magnetometer': {'x': 0, 'y': 0, 'z': 0},
    'timestamp': datetime.datetime.now().isoformat()
}

data_log = []


@app.route('/')
def index():
    return render_template('dashboard.html')


@app.route('/data_logs')
def data_logs():
    return render_template('data_logs.html', logs=data_log)

@app.route('/api/current_data')
def get_current_data():
    return jsonify(cansat_data)


@app.route('/api/logs')
def get_logs():
    return jsonify(data_log)


@app.route('/api/receive_data', methods=['POST'])
def receive_data():
    """Endpoint for the CanSat to send data"""
    if request.method == 'POST':
        try:
            data = request.json
            update_cansat_data(data)
            log_data(data)
            socketio.emit('data_update', cansat_data)
            return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 400


def update_cansat_data(data):
    """Update the current CanSat data with new values"""
    # In a real application, validate the data here
    for key, value in data.items():
        if key in cansat_data:
            cansat_data[key] = value
    cansat_data['timestamp'] = datetime.datetime.now().isoformat()


def log_data(data):
    """Add new data to the log"""
    entry = data.copy()
    entry['timestamp'] = datetime.datetime.now().isoformat()
    data_log.append(entry)
    # Keep only the latest 1000 entries to prevent memory issues
    if len(data_log) > 1000:
        data_log.pop(0)


@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('data_update', cansat_data)


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


# For demo purposes - generate random data
def generate_demo_data():
    """Generate random CanSat data for demo purposes"""
    cansat_data['gps']['lat'] += random.uniform(-0.0001, 0.0001)
    cansat_data['gps']['lon'] += random.uniform(-0.0001, 0.0001)
    cansat_data['gps']['alt'] = max(0, cansat_data['gps']['alt'] + random.uniform(-5, 5))
    cansat_data['linear_acceleration']['x'] = random.uniform(-5, 5)
    cansat_data['linear_acceleration']['y'] = random.uniform(-5, 5)
    cansat_data['linear_acceleration']['z'] = random.uniform(-5, 5)
    cansat_data['heading']['azimuth'] = (cansat_data['heading']['azimuth'] + random.uniform(-5, 5)) % 360
    cansat_data['heading']['pitch'] = max(-90, min(90, cansat_data['heading']['pitch'] + random.uniform(-2, 2)))
    cansat_data['heading']['roll'] = max(-180, min(180, cansat_data['heading']['roll'] + random.uniform(-2, 2)))
    cansat_data['altitude'] = max(0, cansat_data['altitude'] + random.uniform(-10, 10))
    cansat_data['pressure'] = max(900, min(1100, cansat_data['pressure'] + random.uniform(-2, 2)))
    cansat_data['temperature'] = max(-20, min(50, cansat_data['temperature'] + random.uniform(-0.5, 0.5)))
    cansat_data['gyro']['x'] = random.uniform(-10, 10)
    cansat_data['gyro']['y'] = random.uniform(-10, 10)
    cansat_data['gyro']['z'] = random.uniform(-10, 10)
    cansat_data['magnetometer']['x'] = random.uniform(-100, 100)
    cansat_data['magnetometer']['y'] = random.uniform(-100, 100)
    cansat_data['magnetometer']['z'] = random.uniform(-100, 100)
    cansat_data['timestamp'] = datetime.datetime.now().isoformat()
    log_data(cansat_data)
    socketio.emit('data_update', cansat_data)


@socketio.on('request_demo_data')
def handle_demo_data_request():
    generate_demo_data()


if __name__ == '__main__':
    # Initialize demo data
    cansat_data['gps']['lat'] = 37.7749
    cansat_data['gps']['lon'] = -122.4194
    cansat_data['altitude'] = 100
    cansat_data['pressure'] = 1013.25
    cansat_data['temperature'] = 20.0

    socketio.run(app, debug=True, host='0.0.0.0', allow_unsafe_werkzeug=True)
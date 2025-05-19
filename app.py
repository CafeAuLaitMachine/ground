from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import json
import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cansat-secret-key!'
socketio = SocketIO(app)

# Static sample data that will always be shown
cansat_data = {
    'gps': {'lat': 54.6872, 'lon': 25.2797, 'alt': 100},  # Vilnius coordinates
    'linear_acceleration': {'x': 1.2, 'y': -0.5, 'z': 9.8},
    'heading': {'azimuth': 45, 'pitch': 10, 'roll': 5},
    'altitude': 150,
    'pressure': 1013.25,
    'temperature': 22.5,
    'gyro': {'x': 0.1, 'y': 0.2, 'z': 0.05},
    'magnetometer': {'x': 25, 'y': -15, 'z': 40},
    'timestamp': datetime.datetime.now().isoformat()
}

data_log = [
    # Pre-populated log entries for demonstration
    {
        'gps': {'lat': 54.6872, 'lon': 25.2797, 'alt': 100},
        'altitude': 150,
        'pressure': 1013.25,
        'temperature': 22.5,
        'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=5)).isoformat()
    },
    {
        'gps': {'lat': 54.6873, 'lon': 25.2798, 'alt': 105},
        'altitude': 155,
        'pressure': 1012.8,
        'temperature': 22.3,
        'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=4)).isoformat()
    },
    {
        'gps': {'lat': 54.6874, 'lon': 25.2799, 'alt': 110},
        'altitude': 160,
        'pressure': 1012.3,
        'temperature': 22.1,
        'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=3)).isoformat()
    },
    {
        'gps': {'lat': 54.6875, 'lon': 25.2800, 'alt': 115},
        'altitude': 165,
        'pressure': 1011.9,
        'temperature': 21.9,
        'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=2)).isoformat()
    },
    {
        'gps': {'lat': 54.6876, 'lon': 25.2801, 'alt': 120},
        'altitude': 170,
        'pressure': 1011.5,
        'temperature': 21.7,
        'timestamp': (datetime.datetime.now() - datetime.timedelta(minutes=1)).isoformat()
    }
]

@app.route('/')
def index():
    # Format timestamp for better display
    formatted_time = datetime.datetime.fromisoformat(cansat_data['timestamp'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
    cansat_data['formatted_time'] = formatted_time
    return render_template('index.html', data=cansat_data)

@app.route('/data_logs')
def data_logs():
    return render_template('data_logs.html', logs=data_log)

@app.route('/api/current_data')
def get_current_data():
    return jsonify(cansat_data)

@app.route('/api/logs')
def get_logs():
    return jsonify(data_log)

# Demo data function with minimal changes
@app.route('/demo_data')
def demo_page():
    # Simple change to demonstrate data update
    cansat_data['temperature'] = round(cansat_data['temperature'] + 0.1, 1)
    cansat_data['altitude'] = round(cansat_data['altitude'] + 1, 0)
    cansat_data['timestamp'] = datetime.datetime.now().isoformat()
    # Format timestamp for better display
    formatted_time = datetime.datetime.fromisoformat(cansat_data['timestamp'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S')
    cansat_data['formatted_time'] = formatted_time
    log_data(cansat_data.copy())
    return render_template('index.html', data=cansat_data)

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

@socketio.on('request_demo_data')
def handle_demo_data_request():
    """Minimal demo data change"""
    cansat_data['temperature'] = round(cansat_data['temperature'] + 0.1, 1)
    cansat_data['altitude'] = round(cansat_data['altitude'] + 1, 0)
    cansat_data['timestamp'] = datetime.datetime.now().isoformat()
    log_data(cansat_data.copy())
    emit('data_update', cansat_data)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', allow_unsafe_werkzeug=True)
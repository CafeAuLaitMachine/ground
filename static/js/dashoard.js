document.addEventListener('DOMContentLoaded', function() {
    // Initialize Socket.IO
    const socket = io();

    // Initialize the map with dark theme
    const map = L.map('map').setView([37.7749, -122.4194], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    }).addTo(map);

    // Create marker for CanSat location with custom color
    let canSatMarker = L.marker([37.7749, -122.4194]).addTo(map);
    let canSatPath = L.polyline([], {color: '#FFD700', weight: 3}).addTo(map);

    // Chart configuration - Acceleration
    const accCtx = document.getElementById('acc-chart').getContext('2d');
    const accChart = new Chart(accCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'X',
                    data: [],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Y',
                    data: [],
                    borderColor: '#00F5FF',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Z',
                    data: [],
                    borderColor: '#6A00F4',
                    backgroundColor: 'rgba(106, 0, 244, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#E0E0E0'
                    }
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    title: {
                        display: true,
                        text: 'm/s²',
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#A0A0A0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            },
            maintainAspectRatio: false,
            animation: false,
            responsive: true
        }
    });

    // Chart configuration - Gyroscope
    const gyroCtx = document.getElementById('gyro-chart').getContext('2d');
    const gyroChart = new Chart(gyroCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'X',
                    data: [],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Y',
                    data: [],
                    borderColor: '#00F5FF',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Z',
                    data: [],
                    borderColor: '#6A00F4',
                    backgroundColor: 'rgba(106, 0, 244, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#E0E0E0'
                    }
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    title: {
                        display: true,
                        text: '°/s',
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#A0A0A0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            },
            maintainAspectRatio: false,
            animation: false,
            responsive: true
        }
    });

    // Chart configuration - Magnetometer
    const magCtx = document.getElementById('mag-chart').getContext('2d');
    const magChart = new Chart(magCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'X',
                    data: [],
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Y',
                    data: [],
                    borderColor: '#00F5FF',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Z',
                    data: [],
                    borderColor: '#6A00F4',
                    backgroundColor: 'rgba(106, 0, 244, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#E0E0E0'
                    }
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    title: {
                        display: true,
                        text: 'μT',
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#A0A0A0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            },
            maintainAspectRatio: false,
            animation: false,
            responsive: true
        }
    });

    // Chart configuration - Telemetry
    const telemetryCtx = document.getElementById('telemetry-chart').getContext('2d');
    const telemetryChart = new Chart(telemetryCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Altitude',
                    data: [],
                    borderColor: '#FFEE32',
                    backgroundColor: 'rgba(255, 238, 50, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#E0E0E0'
                    }
                },
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second'
                    },
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#A0A0A0'
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: '#E0E0E0'
                    },
                    ticks: {
                        color: '#A0A0A0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            },
            maintainAspectRatio: false,
            animation: false,
            responsive: true
        }
    });

    // Store historical data for charts
    const historicalData = {
        timestamps: [],
        altitude: [],
        temperature: [],
        pressure: [],
        acceleration: {x: [], y: [], z: []},
        gyro: {x: [], y: [], z: []},
        magnetometer: {x: [], y: [], z: []}
    };

    // Update the telemetry chart based on selection
    document.getElementById('chart-data-select').addEventListener('change', updateTelemetryChart);
    document.getElementById('chart-time-range').addEventListener('change', updateTelemetryChart);

    function updateTelemetryChart() {
        const selectedData = document.getElementById('chart-data-select').value;
        const selectedTimeRange = document.getElementById('chart-time-range').value;

        let dataPoints;
        let dataLabel;
        let yAxisLabel;
        let borderColor;

        switch (selectedData) {
            case 'altitude':
                dataPoints = historicalData.altitude;
                dataLabel = 'Altitude';
                yAxisLabel = 'Meters';
                borderColor = '#FFEE32';
                break;
            case 'temperature':
                dataPoints = historicalData.temperature;
                dataLabel = 'Temperature';
                yAxisLabel = '°C';
                borderColor = '#FFD700';
                break;
            case 'pressure':
                dataPoints = historicalData.pressure;
                dataLabel = 'Pressure';
                yAxisLabel = 'hPa';
                borderColor = '#00F5FF';
                break;
            default:
                dataPoints = historicalData.altitude;
                dataLabel = 'Altitude';
                yAxisLabel = 'Meters';
                borderColor = '#FFEE32';
        }

        // Filter data based on time range
        let filteredTimestamps = [...historicalData.timestamps];
        let filteredData = [...dataPoints];

        if (selectedTimeRange !== 'all' && filteredTimestamps.length > 0) {
            const timeRange = parseInt(selectedTimeRange); // in seconds
            const now = Date.now();
            const cutoffTime = now - (timeRange * 1000);

            const filterIndex = filteredTimestamps.findIndex(ts => ts >= cutoffTime);

            if (filterIndex !== -1) {
                filteredTimestamps = filteredTimestamps.slice(filterIndex);
                filteredData = filteredData.slice(filterIndex);
            }
        }

        // Update chart data
        telemetryChart.data.labels = filteredTimestamps;
        telemetryChart.data.datasets[0].data = filteredData;
        telemetryChart.data.datasets[0].label = dataLabel;
        telemetryChart.data.datasets[0].borderColor = borderColor;
        telemetryChart.data.datasets[0].backgroundColor = borderColor.replace(')', ', 0.1)').replace('rgb', 'rgba');
        telemetryChart.options.scales.y.title.text = yAxisLabel;
        telemetryChart.update();
    }

    // Socket.IO event listeners
    socket.on('connect', function() {
        console.log('Connected to server');
        updateStatusIndicator(true);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
        updateStatusIndicator(false);
    });

    socket.on('data_update', function(data) {
        updateDashboard(data);
    });

    // Function to update the UI with new data
    function updateDashboard(data) {
        // Update timestamps
        const timestamp = new Date(data.timestamp);
        document.getElementById('timestamp').textContent = timestamp.toLocaleString();

        // Add data to historical records
        historicalData.timestamps.push(timestamp.getTime());

        // Update GPS position
        if (data.gps) {
            const lat = data.gps.lat;
            const lon = data.gps.lon;
            document.getElementById('gps-position').textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

            // Update map marker and path
            canSatMarker.setLatLng([lat, lon]);
            canSatPath.addLatLng([lat, lon]);
            map.panTo([lat, lon]);
        }

        // Update altitude, pressure, temperature
        if (data.altitude !== undefined) {
            document.getElementById('altitude').textContent = data.altitude.toFixed(2);
            historicalData.altitude.push(data.altitude);
        }

        if (data.pressure !== undefined) {
            document.getElementById('pressure').textContent = data.pressure.toFixed(2);
            historicalData.pressure.push(data.pressure);
        }

        if (data.temperature !== undefined) {
            document.getElementById('temperature').textContent = data.temperature.toFixed(2);
            historicalData.temperature.push(data.temperature);
        }

        // Update heading information
        if (data.heading) {
            document.getElementById('heading').textContent = data.heading.azimuth.toFixed(2);
            document.getElementById('azimuth').textContent = data.heading.azimuth.toFixed(2);
            document.getElementById('pitch').textContent = data.heading.pitch.toFixed(2);
            document.getElementById('roll').textContent = data.heading.roll.toFixed(2);

            // Update orientation indicator
            const pointer = document.getElementById('orientation-pointer');
            pointer.style.transform = `rotate(${data.heading.azimuth}deg)`;
        }

        // Update acceleration values
        if (data.linear_acceleration) {
            document.getElementById('acc-x').textContent = data.linear_acceleration.x.toFixed(2);
            document.getElementById('acc-y').textContent = data.linear_acceleration.y.toFixed(2);
            document.getElementById('acc-z').textContent = data.linear_acceleration.z.toFixed(2);

            // Add to historical data
            historicalData.acceleration.x.push(data.linear_acceleration.x);
            historicalData.acceleration.y.push(data.linear_acceleration.y);
            historicalData.acceleration.z.push(data.linear_acceleration.z);

            // Update acceleration chart
            updateTimeSeriesChart(accChart,
                historicalData.acceleration.x.slice(-20),
                historicalData.acceleration.y.slice(-20),
                historicalData.acceleration.z.slice(-20)
            );
        }

        // Update gyroscope values
        if (data.gyro) {
            document.getElementById('gyro-x').textContent = data.gyro.x.toFixed(2);
            document.getElementById('gyro-y').textContent = data.gyro.y.toFixed(2);
            document.getElementById('gyro-z').textContent = data.gyro.z.toFixed(2);

            // Add to historical data
            historicalData.gyro.x.push(data.gyro.x);
            historicalData.gyro.y.push(data.gyro.y);
            historicalData.gyro.z.push(data.gyro.z);

            // Update gyroscope chart
            updateTimeSeriesChart(gyroChart,
                historicalData.gyro.x.slice(-20),
                historicalData.gyro.y.slice(-20),
                historicalData.gyro.z.slice(-20)
            );
        }

        // Update magnetometer values
        if (data.magnetometer) {
            document.getElementById('mag-x').textContent = data.magnetometer.x.toFixed(2);
            document.getElementById('mag-y').textContent = data.magnetometer.y.toFixed(2);
            document.getElementById('mag-z').textContent = data.magnetometer.z.toFixed(2);

            // Add to historical data
            historicalData.magnetometer.x.push(data.magnetometer.x);
            historicalData.magnetometer.y.push(data.magnetometer.y);
            historicalData.magnetometer.z.push(data.magnetometer.z);

            // Update magnetometer chart
            updateTimeSeriesChart(magChart,
                historicalData.magnetometer.x.slice(-20),
                historicalData.magnetometer.y.slice(-20),
                historicalData.magnetometer.z.slice(-20)
            );
        }

        // Update the telemetry chart
        updateTelemetryChart();

        // Limit the size of historical data to prevent memory issues
        const maxDataPoints = 1000;
        if (historicalData.timestamps.length > maxDataPoints) {
            historicalData.timestamps = historicalData.timestamps.slice(-maxDataPoints);
            historicalData.altitude = historicalData.altitude.slice(-maxDataPoints);
            historicalData.temperature = historicalData.temperature.slice(-maxDataPoints);
            historicalData.pressure = historicalData.pressure.slice(-maxDataPoints);
            historicalData.acceleration.x = historicalData.acceleration.x.slice(-maxDataPoints);
            historicalData.acceleration.y = historicalData.acceleration.y.slice(-maxDataPoints);
            historicalData.acceleration.z = historicalData.acceleration.z.slice(-maxDataPoints);
            historicalData.gyro.x = historicalData.gyro.x.slice(-maxDataPoints);
            historicalData.gyro.y = historicalData.gyro.y.slice(-maxDataPoints);
            historicalData.gyro.z = historicalData.gyro.z.slice(-maxDataPoints);
            historicalData.magnetometer.x = historicalData.magnetometer.x.slice(-maxDataPoints);
            historicalData.magnetometer.y = historicalData.magnetometer.y.slice(-maxDataPoints);
            historicalData.magnetometer.z = historicalData.magnetometer.z.slice(-maxDataPoints);
        }
    }

    // Helper function to update time series charts
    function updateTimeSeriesChart(chart, xData, yData, zData) {
        const labels = Array.from({ length: Math.max(xData.length, yData.length, zData.length) }, (_, i) => i);

        chart.data.labels = labels;
        chart.data.datasets[0].data = xData;
        chart.data.datasets[1].data = yData;
        chart.data.datasets[2].data = zData;
        chart.update();
    }

    // Function to update connection status indicator
    function updateStatusIndicator(isConnected) {
        const navbar = document.querySelector('.navbar');
        if (isConnected) {
            navbar.classList.remove('bg-danger');
            // Use the dark theme color instead of Bootstrap's dark
            navbar.style.backgroundColor = '#0A0A0A';
        } else {
            navbar.style.backgroundColor = '#0A0A0A';
            // Add a red border to indicate disconnection rather than changing the entire background
            navbar.style.borderBottom = '3px solid #DC3545';
        }
    }

    // Demo data button
    document.getElementById('demoDataBtn').addEventListener('click', function() {
        // Add glow effect when clicked
        this.classList.add('glow-effect');
        setTimeout(() => {
            this.classList.remove('glow-effect');
        }, 300);

        socket.emit('request_demo_data');
    });

    // Initial data fetch
    fetch('/api/current_data')
        .then(response => response.json())
        .then(data => {
            updateDashboard(data);
        })
        .catch(error => {
            console.error('Error fetching initial data:', error);
        });
});
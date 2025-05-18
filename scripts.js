// Initialize the altitude chart
const altitudeCtx = document.getElementById('altitudeChart').getContext('2d');
const altitudeChart = new Chart(altitudeCtx, {
    type: 'line',
    data: {
        labels: [], // Will be populated with time datalog
        datasets: [{
            label: 'Altitude (m)',
            data: [], // Will be populated with altitude datalog
            borderColor: '#4ae3b5',
            backgroundColor: 'rgba(74, 227, 181, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(22, 27, 34, 0.9)',
                titleColor: '#ecf2f8',
                bodyColor: '#ecf2f8',
                borderColor: 'rgba(99, 130, 159, 0.3)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#8b949e'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#8b949e'
                },
                beginAtZero: true
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        animations: {
            radius: {
                duration: 400,
                easing: 'linear',
                loop: (context) => context.active
            }
        }
    }
});

// Sample datalog to simulate telemetry updates
const sampleData = {
    times: Array.from({length: 100}, (_, i) => i),
    altitudes: Array.from({length: 100}, (_, i) => 100 + 10 * i + Math.random() * 15 - 5)
};

// Add sample datalog to chart
sampleData.times.forEach((time, index) => {
    addDataPoint(altitudeChart, time, sampleData.altitudes[index]);
});

// Function to add datalog to the chart
function addDataPoint(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);

    // Keep only the last 100 datalog points to prevent performance issues
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
}

// Add rows to the datalog log table
const dataTable = document.getElementById('datalog-table').getElementsByTagName('tbody')[0];
for (let i = 0; i < 10; i++) {
    const randomAlt = (300 + Math.random() * 50).toFixed(1);
    const randomTemp = (20 + Math.random() * 10).toFixed(1);
    const randomPress = (97 + Math.random() * 3).toFixed(2);

    const row = dataTable.insertRow();
    row.innerHTML = `
        <td>14:${28+i}:${Math.floor(Math.random() * 60)}</td>
        <td>${randomAlt} m</td>
        <td>${randomTemp} °C</td>
        <td>${randomPress} kPa</td>
        <td>Valid</td>
    `;
}

// Handle connection button
document.getElementById('connect').addEventListener('click', function() {
    const statusIndicator = document.querySelector('.status-indicator');
    const connectButton = this;

    if (statusIndicator.classList.contains('connected')) {
        statusIndicator.classList.remove('connected');
        statusIndicator.querySelector('.status-text').textContent = 'Disconnected';
        connectButton.textContent = 'Connect';
    } else {
        statusIndicator.classList.add('connected');
        statusIndicator.querySelector('.status-text').textContent = 'Connected';
        connectButton.textContent = 'Disconnect';
    }
});

// Handle export datalog button
document.getElementById('export-datalog').addEventListener('click', function() {
    alert('Exporting datalog to CSV...');
    // Implementation would download a CSV file with all the logged datalog
});

// Handle clear log button
document.getElementById('clear-log').addEventListener('click', function() {
    const tbody = document.getElementById('datalog-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
});

// Simulated telemetry updates
function updateTelemetry() {
    // Update altitude with a slight variation
    const currentAltitude = parseFloat(document.getElementById('altitude').textContent);
    const newAltitude = (currentAltitude + (Math.random() * 10 - 5)).toFixed(1);
    document.getElementById('altitude').textContent = `${newAltitude} m`;

    // Add the new datalog point to the chart
    addDataPoint(altitudeChart, altitudeChart.data.labels.length, newAltitude);

    // Update other telemetry values with small random changes
    const currentTemp = parseFloat(document.getElementById('temperature').textContent);
    document.getElementById('temperature').textContent =
        `${(currentTemp + (Math.random() * 0.4 - 0.2)).toFixed(1)} °C`;

    const currentPressure = parseFloat(document.getElementById('pressure').textContent);
    document.getElementById('pressure').textContent =
        `${(currentPressure + (Math.random() * 0.1 - 0.05)).toFixed(1)} kPa`;

    const currentBattery = parseFloat(document.getElementById('battery').textContent);
    document.getElementById('battery').textContent =
        `${(currentBattery - Math.random() * 0.01).toFixed(1)} V`;

    const currentSignal = parseInt(document.getElementById('signal').textContent);
    document.getElementById('signal').textContent =
        `${currentSignal + Math.floor(Math.random() * 3 - 1)} dBm`;

    // Update orientation datalog
    const currentRoll = parseFloat(document.getElementById('roll').textContent);
    document.getElementById('roll').textContent =
        `${(currentRoll + (Math.random() * 2 - 1)).toFixed(1)}°`;

    const currentPitch = parseFloat(document.getElementById('pitch').textContent);
    document.getElementById('pitch').textContent =
        `${(currentPitch + (Math.random() * 2 - 1)).toFixed(1)}°`;

    const currentYaw = parseFloat(document.getElementById('yaw').textContent);
    document.getElementById('yaw').textContent =
        `${(currentYaw + (Math.random() * 1 - 0.5)).toFixed(1)}°`;

    // Update mission timer
    const timerElement = document.getElementById('mission-timer');
    const timeParts = timerElement.textContent.split(':');
    let minutes = parseInt(timeParts[0]);
    let seconds = parseInt(timeParts[1]);
    let milliseconds = parseInt(timeParts[2]);

    milliseconds += 1;
    if (milliseconds >= 60) {
        milliseconds = 0;
        seconds += 1;
        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }
    }

    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

// Update telemetry every second
setInterval(updateTelemetry, 1000);
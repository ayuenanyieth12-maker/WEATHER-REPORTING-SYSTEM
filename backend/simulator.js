const https = require('http');

const BASE_TEMP     = 24;
const BASE_HUMIDITY = 40;
const BASE_PRESSURE = 1013;

function randomVariation(base, range) {
  return parseFloat((base + (Math.random() * range * 2 - range)).toFixed(2));
}

function sendReading() {
  const data = JSON.stringify({
    temperature: randomVariation(BASE_TEMP,     3),
    humidity:    randomVariation(BASE_HUMIDITY, 8),
    pressure:    randomVariation(BASE_PRESSURE, 5)
  });

  const options = {
    hostname: 'localhost',
    port:     3000,
    path:     '/data',
    method:   'POST',
    headers: {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, res => {
    console.log(`[${new Date().toLocaleTimeString()}] Sent → Temp: ${JSON.parse(data).temperature}°C | Humidity: ${JSON.parse(data).humidity}% | Pressure: ${JSON.parse(data).pressure}hPa`);
  });

  req.on('error', err => console.error('Error:', err.message));
  req.write(data);
  req.end();
}

console.log('Simulator running — sending readings every 3 seconds...');
sendReading();
setInterval(sendReading, 3000);
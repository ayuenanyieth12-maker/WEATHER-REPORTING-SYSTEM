const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Initialize the database
const db = new Database('weather.db');

// create the weather_data table 
db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity    REAL NOT NULL,
    pressure    REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Endpoint to receive weather data
// POST /data — receive sensor data
app.post('/data', (req, res) => {
  const { temperature, humidity, pressure } = req.body;

  if (temperature == null || humidity == null || pressure == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const stmt = db.prepare(
    'INSERT INTO readings (temperature, humidity, pressure) VALUES (?, ?, ?)'
  );
  stmt.run(temperature, humidity, pressure);

  console.log(`Data saved — Temp: ${temperature}°C | Humidity: ${humidity}% | Pressure: ${pressure}hPa`);
  res.json({ success: true });
});

// Endpoint to retrieve all weather data
// GET /data — fetch last 50 readings
app.get('/data', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM readings ORDER BY recorded_at DESC LIMIT 50'
  ).all();
  res.json(rows);
});

// GET /data/latest — fetch most recent reading
app.get('/data/latest', (req, res) => {
  const row = db.prepare(
    'SELECT * FROM readings ORDER BY recorded_at DESC LIMIT 1'
  ).get();
  res.json(row || {});
});

app.listen(PORT, () => {
  console.log(`Weather backend running on http://localhost:${PORT}`);
});
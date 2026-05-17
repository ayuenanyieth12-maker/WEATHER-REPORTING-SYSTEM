#include <DHT.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>

#define DHTPIN 15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP085 bmp;

void setup() {
  Serial.begin(115200);
  dht.begin();

  if (!bmp.begin()) {
    Serial.println("BMP180 not found!");
    while(1);
  }

  Serial.println("Weather Station Ready");
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float pressure = bmp.readPressure() / 100.0F;

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT22 read error!");
    return;
  }

  Serial.print("Temp: "); Serial.print(temperature); Serial.print(" °C | ");
  Serial.print("Humidity: "); Serial.print(humidity);    Serial.print(" % | ");
  Serial.print("Pressure: "); Serial.print(pressure);    Serial.println(" hPa");

  delay(2000);
}
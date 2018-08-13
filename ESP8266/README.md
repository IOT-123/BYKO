# BYKO - ESP8266

## PROOF OF CONCEPT

The sketch mainly takes care of connections to the Wifi hotspot and MQTT server .

Some mock values are published every second.

Other than actual sensor readings being used, the following will make the deployment more robust:

- Momentary button when held down on boot, formats SPIFFS and resets WifiManeger then reboots.
- Indicator LED (self flashing) during Format process.
- RGB LED for indication of other states.
- Vibration indicator.
- 433mhz reciever for remote sensor (like Cadence contact).
- Battery, TP4056 charger and solor panels.
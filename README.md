# BYKO

## PROOF OF CONCEPT

A battery powered ESP8266 is attached to a cyclists helmet, optionally recharged from solar.

A mobile phone acts both as a hotspot and a front-end for viewing observations.

The ESP8266 connects to the hotspot, using WifiManager for the initial connection.

The readings the ESP8266 make are published to a MQTT server (one that is compatible with Secure Websockets).

The MobileWeb subscribes to the readings as well as Geolocation, OpenWeatherMap and Device API.

These are displayed in an easy to read, configurable dashboard.

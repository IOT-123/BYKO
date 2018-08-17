# BYKO

## PROOF OF CONCEPT

A battery powered ESP8266 is attached to a cyclists helmet, optionally recharged from solar.

A mobile phone acts both as a hotspot and a front-end for viewing observations.

The ESP8266 connects to the hotspot, using WifiManager for the initial connection.

The readings the ESP8266 make are published to a MQTT server (one that is compatible with Secure Websockets).

The MobileWeb subscribes to the readings as well as Geolocation, OpenWeatherMap and Device API.

These are displayed in an easy to read, configurable dashboard.

[Instructions](https://www.hackster.io/iot1232/iot123-byko-mashup-mobile-web-for-cyclists-7f8aa0)

[Video 1](https://youtu.be/6Fz2syrQn6w)

[Video 2](https://youtu.be/CD2wLWxXo2w)


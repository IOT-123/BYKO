# BYKO - MobileWeb

## PROOF OF CONCEPT

This is a hobbled together POC for surfacing obsverations available on the mobile device, including:
- MQTT publications from the ESP8266.
- Geolocation data including speed and direction.
- OpenWeatherMap data including wind direction and strength.
- Device API data like battery level, angle and acceleration.

Obvious shortcomings:
- MQTT broker is configurable, but credentials are not supported.
- Code is not testable in a cohesive way.
- No templating patterens used; vanilla JS with a mix of ES5 and ES6.
- Only tested on Android phone (LG G6), though some provisions made for others.
- Fullscreen and rotation lock known not to work on iPhone.


MUST BE SERVED FROM A SECURE SITE (https).
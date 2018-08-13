#include <FS.h>                   
#include <ESP8266WiFi.h>        
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager
#include <ArduinoJson.h>          //https://github.com/bblanchon/ArduinoJson
#include <PubSubClient.h>

char _mqtt_server[40];
char _mqtt_port[6];
char _mqtt_username[12];
char _mqtt_password[12];
char _mqtt_root_topic[40];
bool _shouldSaveConfig = false;
long _last_publish = 0;

#define KEY_MQTT_SERVER "mqtt_server"
#define KEY_MQTT_PORT "mqtt_port"
#define KEY_MQTT_USERNAME "mqtt_username"
#define KEY_MQTT_PASSWORD "mqtt_password"
#define KEY_MQTT_ROOT_TOPIC "mqtt_root_topic"

#define UI_MQTT_SERVER "mqtt server"
#define UI_MQTT_PORT "mqtt port"
#define UI_MQTT_USERNAME "mqtt username"
#define UI_MQTT_PASSWORD "mqtt password"
#define UI_MQTT_ROOT_TOPIC "mqtt root topic"

#define WM_SSID "IOT123_BYKO"
#define WM_PASSWORD "BYKO_123"

long _mock_value_1 = 100;
long _mock_value_2 = 200;
long _mock_value_3 = 300;

WiFiClient _wifi_client;
PubSubClient _mqtt_client(_wifi_client);

//---------------------------------FUNCTION SCOPE DECLARATIONS
void readConfigFromSpiffs();
void evokeWifiManager();
void writeConfigToSpiffs();
void reconnect();
void saveConfigCallback();

void setup() {
  Serial.begin(115200);
  delay(5000);
  Serial.println();
  //clean FS, for testing
  // use button/led to trigger this
  //SPIFFS.format();
  readConfigFromSpiffs();
  evokeWifiManager();
  if (_shouldSaveConfig) {
    writeConfigToSpiffs();
  }
  Serial.print("local ip: ");
  Serial.println(WiFi.localIP());
  int port = atoi(_mqtt_port);
  Serial.println(_mqtt_server);
  Serial.println(port);
  _mqtt_client.setServer(_mqtt_server, port);
}// setup

void loop() {
  if (!_mqtt_client.connected()) {
    reconnect();
  }
  _mqtt_client.loop();
  // send mock values
  long now = millis();
  if (now - _last_publish > 1000) {
    _last_publish = now;
    char topic[100];
    sprintf(topic, "%s/%s", _mqtt_root_topic, "field1");
    Serial.println(topic);
    _mqtt_client.publish(topic, String(_mock_value_1).c_str(), true);
    sprintf(topic, "%s/%s", _mqtt_root_topic, "field2");
    Serial.println(topic);
    _mqtt_client.publish(topic, String(_mock_value_2).c_str(), true);
    sprintf(topic, "%s/%s", _mqtt_root_topic, "field3");
    Serial.println(topic);
    _mqtt_client.publish(topic, String(_mock_value_3).c_str(), true);
    _mock_value_1++;
    _mock_value_2++;
    _mock_value_3++;
    Serial.println();
  }
}// loop

void reconnect() {
  // Loop until we're reconnected
  while (!_mqtt_client.connected()) {
    uint32_t random_id = random(999, 9999);
    char client_id[25];
    snprintf(client_id, 25, "BYKO-%04X", random_id);
    Serial.println(client_id);
    bool connected = false;
    if (strcmp(_mqtt_username, "") == 0){
      Serial.println("Connecting without credentials");
      connected = _mqtt_client.connect(client_id);
    }else{
      Serial.println("Connecting with credentials");
      connected = _mqtt_client.connect(client_id, _mqtt_username, _mqtt_password);
    }
    Serial.print("Attempting MQTT connection...");
    if (connected) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(_mqtt_client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void readConfigFromSpiffs(){
    //read configuration from FS json
  Serial.println("mounting FS...");
  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
    if (SPIFFS.exists("/config.json")) {
      //file exists, reading and loading
      Serial.println("reading config file");
      File configFile = SPIFFS.open("/config.json", "r");
      if (configFile) {
        Serial.println("opened config file");
        size_t size = configFile.size();
        // Allocate a buffer to store contents of the file.
        std::unique_ptr<char[]> buf(new char[size]);
        configFile.readBytes(buf.get(), size);
        DynamicJsonBuffer jsonBuffer;
        JsonObject& json = jsonBuffer.parseObject(buf.get());
        json.printTo(Serial);
        if (json.success()) {
          Serial.println("\nparsed json");
          strcpy(_mqtt_server, json[KEY_MQTT_SERVER]);
          strcpy(_mqtt_port, json[KEY_MQTT_PORT]);
          strcpy(_mqtt_username, json[KEY_MQTT_USERNAME]);
          strcpy(_mqtt_password, json[KEY_MQTT_PASSWORD]);          
          strcpy(_mqtt_root_topic, json[KEY_MQTT_ROOT_TOPIC]);          
        } else {
          Serial.println("failed to load json config");
        }
      }
    }
  } else {
    Serial.println("failed to mount FS");
  }
}// readConfigFromSpiffs

void writeConfigToSpiffs(){
    Serial.println("saving config");
    DynamicJsonBuffer jsonBuffer;
    JsonObject& json = jsonBuffer.createObject();
    json[KEY_MQTT_SERVER] = _mqtt_server;
    json[KEY_MQTT_PORT] = _mqtt_port;
    json[KEY_MQTT_USERNAME] = _mqtt_username;
    json[KEY_MQTT_PASSWORD] = _mqtt_password;    
    json[KEY_MQTT_ROOT_TOPIC] = _mqtt_root_topic;    
    File configFile = SPIFFS.open("/config.json", "w");
    if (!configFile) {
      Serial.println("failed to open config file for writing");
    }
    json.printTo(Serial);
    json.printTo(configFile);
    configFile.close();
}// writeConfigToSpiffs

void evokeWifiManager(){
  WiFiManagerParameter custom_mqtt_server(KEY_MQTT_SERVER, UI_MQTT_SERVER, _mqtt_server, 40);
  WiFiManagerParameter custom_mqtt_port(KEY_MQTT_PORT, UI_MQTT_PORT, _mqtt_port, 5);
  WiFiManagerParameter custom_mqtt_username(KEY_MQTT_USERNAME, UI_MQTT_USERNAME, _mqtt_username, 12);
  WiFiManagerParameter custom_mqtt_password(KEY_MQTT_PASSWORD, UI_MQTT_PASSWORD, _mqtt_password, 12);
  WiFiManagerParameter custom_mqtt_root_topic(KEY_MQTT_ROOT_TOPIC, UI_MQTT_ROOT_TOPIC, _mqtt_root_topic, 40);
  WiFiManager wifiManager;
  wifiManager.setSaveConfigCallback(saveConfigCallback);
  wifiManager.addParameter(&custom_mqtt_server);
  wifiManager.addParameter(&custom_mqtt_port);
  wifiManager.addParameter(&custom_mqtt_username);
  wifiManager.addParameter(&custom_mqtt_password);
  wifiManager.addParameter(&custom_mqtt_root_topic);
  // use button/led to trigger this
  //wifiManager.resetSettings();
  wifiManager.setMinimumSignalQuality();
  //sets timeout until configuration portal gets turned off
  //useful to make it all retry or go to sleep
  //in seconds
  //wifiManager.setTimeout(120);
  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if (!wifiManager.autoConnect(WM_SSID, WM_PASSWORD)) {
    Serial.println("failed to connect and hit timeout");
    delay(3000);
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(5000);
  }
  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  //read updated parameters
  strcpy(_mqtt_server, custom_mqtt_server.getValue());
  strcpy(_mqtt_port, custom_mqtt_port.getValue());
  strcpy(_mqtt_username, custom_mqtt_username.getValue());
  strcpy(_mqtt_password, custom_mqtt_password.getValue());
  strcpy(_mqtt_root_topic, custom_mqtt_root_topic.getValue());
}// evokeWifiManager

void saveConfigCallback () {
  Serial.println("Should save config");
  _shouldSaveConfig = true;
}// saveConfigCallback



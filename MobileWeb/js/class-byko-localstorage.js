function BykoLocalStorage() {

    var _field1Lbl = null;
    var _field2Lbl = null;
    var _field3Lbl = null;
    var _field1MqttTopic = null;
    var _field2MqttTopic = null;
    var _field3MqttTopic = null;
    var _field1TextSize = null;
    var _field2TextSize = null;
    var _field3TextSize = null;


    var _owmAppId = null;
    var _mqttBroker = null;
    var _mqttPort = null;
    var _mqttRootTopics = null;
    var _mqttUsername = null;
    var _mqttPassword = null;


    var _settingsMock = false;
    var _lastWindFetch = false;
    var _lastWindDeg = null;
    var _lastWindSpeed = null;

    var _activeReadings = null;

    //#region settingsField1Lbl
    this.getField1Lbl = function () {
        return this.getField1LblOrDefault("FIELD1");
    }

    this.getField1LblOrDefault = function (defaultValue) {
        if (_field1Lbl) {
            return _field1Lbl;
        }
        if (localStorage.settingsField1Lbl) {
            _field1Lbl = localStorage.settingsField1Lbl
            return _field1Lbl;
        }
        return defaultValue;
    }

    this.setField1Lbl = function (value) {
        localStorage.settingsField1Lbl = value;
        _field1Lbl = value;
    }
    //#endregion

    //#region settingsField2Lbl
    this.getField2Lbl = function () {
        return this.getField2LblOrDefault("FIELD2");
    }

    this.getField2LblOrDefault = function (defaultValue) {
        if (_field2Lbl) {
            return _field2Lbl;
        }
        if (localStorage.settingsField2Lbl) {
            _field2Lbl = localStorage.settingsField2Lbl
            return _field2Lbl;
        }
        return defaultValue;
    }

    this.setField2Lbl = function (value) {
        localStorage.settingsField2Lbl = value;
        _field2Lbl = value;
    }
    //#endregion

    //#region settingsField3Lbl
    this.getField3Lbl = function () {
        return this.getField3LblOrDefault("FIELD3");
    }

    this.getField3LblOrDefault = function (defaultValue) {
        if (_field3Lbl) {
            return _field3Lbl;
        }
        if (localStorage.settingsField3Lbl) {
            _field3Lbl = localStorage.settingsField3Lbl
            return _field3Lbl;
        }
        return defaultValue;
    }

    this.setField3Lbl = function (value) {
        localStorage.settingsField3Lbl = value;
        _field3Lbl = value;
    }
    //#endregion

    //#region settingsField1MqttTopic
    this.getField1MqttTopic = function () {
        return this.getField1MqttTopicOrDefault(null);
    }

    this.getField1MqttTopicOrDefault = function (defaultValue) {
        if (_field1MqttTopic) {
            return _field1MqttTopic;
        }
        if (localStorage.settingsField1MqttTopic) {
            _field1MqttTopic = localStorage.settingsField1MqttTopic;
            return _field1MqttTopic;
        }
        return defaultValue;
    }

    this.setField1MqttTopic = function (value) {
        localStorage.settingsField1MqttTopic = value;
        _field1MqttTopic = value;
    }
    //#endregion

    //#region settingsField2MqttTopic
    this.getField2MqttTopic = function () {
        return this.getField2MqttTopicOrDefault(null);
    }

    this.getField2MqttTopicOrDefault = function (defaultValue) {
        if (_field2MqttTopic) {
            return _field2MqttTopic;
        }
        if (localStorage.settingsField2MqttTopic) {
            _field2MqttTopic = localStorage.settingsField2MqttTopic;
            return _field2MqttTopic;
        }
        return defaultValue;
    }

    this.setField2MqttTopic = function (value) {
        localStorage.settingsField2MqttTopic = value;
        _field2MqttTopic = value;
    }
    //#endregion

    //#region settingsField3MqttTopic
    this.getField3MqttTopic = function () {
        return this.getField3MqttTopicOrDefault(null);
    }

    this.getField3MqttTopicOrDefault = function (defaultValue) {
        if (_field3MqttTopic) {
            return _field3MqttTopic;
        }
        if (localStorage.settingsField3MqttTopic) {
            _field3MqttTopic = localStorage.settingsField3MqttTopic;
            return _field3MqttTopic;
        }
        return defaultValue;
    }

    this.setField3MqttTopic = function (value) {
        localStorage.settingsField3MqttTopic = value;
        _field3MqttTopic = value;
    }
    //#endregion

    //#region settingsField1TextSize
    this.getField1TextSize = function () {
        return this.getField1TextSizeOrDefault("LARGE");
    }

    this.getField1TextSizeOrDefault = function (defaultValue) {
        if (_field1TextSize) {
            return _field1TextSize;
        }
        if (localStorage.settingsField1TextSize) {
            _field1TextSize = localStorage.settingsField1TextSize;
            return _field1TextSize;
        }
        return defaultValue;
    }

    this.setField1TextSize = function (value) {
        localStorage.settingsField1TextSize = value;
        _field1TextSize = value;
    }
    //#endregion

    //#region settingsField2TextSize
    this.getField2TextSize = function () {
        return this.getField2TextSizeOrDefault("LARGE");
    }

    this.getField2TextSizeOrDefault = function (defaultValue) {
        if (_field2TextSize) {
            return _field2TextSize;
        }
        if (localStorage.settingsField2TextSize) {
            _field2TextSize = localStorage.settingsField2TextSize;
            return _field2TextSize;
        }
        return defaultValue;
    }

    this.setField2TextSize = function (value) {
        localStorage.settingsField2TextSize = value;
        _field2TextSize = value;
    }
    //#endregion

    //#region settingsField3TextSize
    this.getField3TextSize = function () {
        return this.getField3TextSizeOrDefault("LARGE");
    }

    this.getField3TextSizeOrDefault = function (defaultValue) {
        if (_field3TextSize) {
            return _field3TextSize;
        }
        if (localStorage.settingsField3TextSize) {
            _field3TextSize = localStorage.settingsField3TextSize;
            return _field3TextSize;
        }
        return defaultValue;
    }

    this.setField3TextSize = function (value) {
        localStorage.settingsField3TextSize = value;
        _field3TextSize = value;
    }
    //#endregion




    //#region settingsOwmAppId
    this.getOwmAppId = function () {
        return this.getOwmAppIdOrDefault(null);
    }

    this.getOwmAppIdOrDefault = function (defaultValue) {
        if (_owmAppId) {
            return _owmAppId;
        }
        if (localStorage.settingsOwmAppId) {
            _owmAppId = localStorage.settingsOwmAppId;
            return _owmAppId;
        }
        return defaultValue;
    }

    this.setOwmAppId = function (value) {
        localStorage.settingsOwmAppId = value;
        _owmAppId = value;
    }
    //#endregion


    //#region settingsMock
    this.getSettingsMock = function () {
        return this.getSettingsMockOrDefault(false);
    }

    this.getSettingsMockOrDefault = function (defaultValue) {
        if (_owmAppId) {
            return _settingsMock;
        }
        if (localStorage.settingsMock) {
            _settingsMock = localStorage.settingsMock;
            return _settingsMock == "true";
        }
        return defaultValue;
    }

    this.setSettingsMock = function (value) {
        localStorage.settingsMock = _settingsMock;
        _settingsMock = value;
    }
    //#endregion

    //SHOULD ONLY FETCH ONCE EVERY 10 MINUTES
    //#region lastWindFetch
    this.getLastWindFetch = function () {
        return this.getLastWindFetchOrDefault(null);
    }

    this.getLastWindFetchOrDefault = function (defaultValue) {
        if (_lastWindFetch) {
            return _lastWindFetch;
        }
        if (localStorage.lastWindFetch) {
            _lastWindFetch = Date.parse(localStorage.lastWindFetch);
            return _lastWindFetch;
        }
        return defaultValue;
    }

    this.setLastWindFetch = function (value) {
        localStorage.lastWindFetch = value.toString();
        _lastWindFetch = value;
    }
    //#endregion

    //#region dynamicFieldShowing
    this.getDynamicFieldShowing = function (key) {
        return localStorage[key];
    }

    this.setDynamicFieldShowing = function (key, value) {
        localStorage[key] = value;
    }
    //#endregion


    //#region settingsMqttBroker
    this.getMqttBroker = function () {
        return this.getMqttBrokerOrDefault(null);
    }

    this.getMqttBrokerOrDefault = function (defaultValue) {
        if (_mqttBroker) {
            return _mqttBroker;
        }
        if (localStorage.settingsMqttBroker) {
            _mqttBroker = localStorage.settingsMqttBroker;
            return _mqttBroker;
        }
        return defaultValue;
    }

    this.setMqttBroker = function (value) {
        localStorage.settingsMqttBroker = value;
        _mqttBroker = value;
    }
    //#endregion

    //#region settingsMqttPort
    this.getMqttPort = function () {
        return this.getMqttPortOrDefault(null);
    }

    this.getMqttPortOrDefault = function (defaultValue) {
        if (_mqttPort) {
            return _mqttPort;
        }
        if (localStorage.settingsMqttPort) {
            _mqttPort = localStorage.settingsMqttPort;
            return _mqttPort;
        }
        return defaultValue;
    }

    this.setMqttPort = function (value) {
        localStorage.settingsMqttPort = value;
        _mqttPort = value;
    }
    //#endregion

    //#region settingsMqttRootTopics
    this.getMqttRootTopics = function () {
        return this.getMqttRootTopicsOrDefault(null);
    }

    this.getMqttRootTopicsOrDefault = function (defaultValue) {
        if (_mqttRootTopics) {
            return _mqttRootTopics;
        }
        if (localStorage.settingsMqttRootTopics) {
            _mqttRootTopics = localStorage.settingsMqttRootTopics;
            return _mqttRootTopics;
        }
        return defaultValue;
    }

    this.setMqttRootTopics = function (value) {
        localStorage.settingsMqttRootTopics = value;
        _mqttRootTopics = value;
    }
    //#endregion

    //#region settingsMqttUsername
    this.getMqttUsername = function () {
        return this.getMqttUsernameOrDefault(null);
    }

    this.getMqttUsernameOrDefault = function (defaultValue) {
        if (_mqttUsername) {
            return _mqttUsername;
        }
        if (localStorage.settingsMqttUsername) {
            _mqttUsername = localStorage.settingsMqttUsername;
            return _mqttUsername;
        }
        return defaultValue;
    }

    this.setMqttUsername = function (value) {
        localStorage.settingsMqttUsername = value;
        _mqttUsername = value;
    }
    //#endregion

    //#region settingsMqttPassword
    this.getMqttPassword = function () {
        return this.getMqttPasswordOrDefault(null);
    }

    this.getMqttPasswordOrDefault = function (defaultValue) {
        if (_mqttPassword) {
            return _mqttPassword;
        }
        if (localStorage.settingsMqttPassword) {
            _mqttPassword = localStorage.settingsMqttPassword;
            return _mqttPassword;
        }
        return defaultValue;
    }

    this.setMqttPassword = function (value) {
        localStorage.settingsMqttPassword = value;
        _mqttPassword = value;
    }
    //#endregion

    //#region settingsLastWindDeg
    this.getLastWindDeg = function () {
        return this.getLastWindDegOrDefault(null);
    }

    this.getLastWindDegOrDefault = function (defaultValue) {
        if (_lastWindDeg) {
            return _lastWindDeg;
        }
        if (localStorage.settingsLastWindDeg) {
            _lastWindDeg = localStorage.settingsLastWindDeg;
            return _lastWindDeg;
        }
        return defaultValue;
    }

    this.setLastWindDeg = function (value) {
        localStorage.settingsLastWindDeg = value;
        _lastWindDeg = value;
    }
    //#endregion

    //#region settingsLastWindSpeed
    this.getLastWindSpeed = function () {
        return this.getLastWindSpeedOrDefault(null);
    }

    this.getLastWindSpeedOrDefault = function (defaultValue) {
        if (_lastWindSpeed) {
            return _lastWindSpeed;
        }
        if (localStorage.settingsLastWindSpeed) {
            _lastWindSpeed = localStorage.settingsLastWindSpeed;
            return _lastWindSpeed;
        }
        return defaultValue;
    }

    this.setLastWindSpeed = function (value) {
        localStorage.settingsLastWindSpeed = value;
        _lastWindSpeed = value;
    }
    //#endregion

    //#region settingsActiveReadings
    this.getActiveReadings = function () {
        return this.getActiveReadingsOrDefault(null);
    }

    this.getActiveReadingsOrDefault = function (defaultValue) {
        if (_activeReadings) {
            return _activeReadings;
        }
        if (localStorage.settingsActiveReadings) {
            _activeReadings = JSON.parse(localStorage.settingsActiveReadings);
            return _activeReadings;
        }
        return defaultValue;
    }

    this.setActiveReadings = function (value) {
        localStorage.settingsActiveReadings = JSON.stringify(value);
        _activeReadings = value;
    }
    //#endregion
}











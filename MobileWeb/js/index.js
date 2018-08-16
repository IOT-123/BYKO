var _no_sleep = null;
var _byko_localstorage = null;
var _mqtt = null;
var _OpenWeatherMapKeyErrorShown = false;
var _timer_second_updates = 0;
var _last_dynamic_update = null;

var _ids =
{
    screen: {
        val_spd: "screen_val_spd",
        val_max_spd: "screen_val_max_spd",
        lbl_fld1: "screen_lbl_fld1",
        lbl_fld2: "screen_lbl_fld2",
        val_fld1: "screen_val_fld1",
        val_fld2: "screen_val_fld2",
    },
    toolbar: { btn_play: "toolbar_btn_play" },
    settings: {
        //val_ipaddress: "settings_val_ipaddress",
        val_appid: "settings_val_appid",
        val_mqtt_broker: "settings_val_mqtt_broker",
        val_mqtt_port: "settings_val_mqtt_port",
        val_mqtt_root_topics: "settings_val_mqtt_root_topics",
        // val_mqtt_username: "settings_val_mqtt_username",
        // val_mqtt_password: "settings_val_mqtt_password",
        val_field1_label: "settings_val-field1-lbl",
        val_field2_label: "settings_val-field2-lbl",
        val_field3_label: "settings_val-field3-lbl",
        val_field1_mqtt_topic: "settings_val_field1_mqtt_topic",
        val_field2_mqtt_topic: "settings_val_field2_mqtt_topic",
        val_field3_mqtt_topic: "settings_val_field3_mqtt_topic",
        val_field1_text_size: "settings_val_field1_text_size",
        val_field2_text_size: "settings_val_field2_text_size",
        val_field3_text_size: "settings_val_field3_text_size",
        chk_mock: "settings_chk_mock"
    }
};

var _dynamic_fields = {
    indexes: {
        SPEED: 0,
        MAX_SPEED: 1,
        DISTANCE: 2,
        DIRECTION: 3,
        LATITUDE: 4,
        LONGITUDE: 5,
        POSITION_ACCURACY: 6,
        ALTITUDE: 7,
        ALTITUDE_ACCURACY: 8,
        POSITION_FETCHED: 9,
        WIND_DIRECTION: 10,
        WIND_SPEED: 11,
        WEATHER: 12,
        TEMP: 13,
        PRESSURE: 14,
        HUMIDITY: 15,
        TEMP_MIN: 16,
        TEMP_MAX: 17,
        WEATHER_FETCHED: 18,
        WEATHER_COUNTRY: 19,
        SUNRISE: 20,
        SUNSET: 21,
        WEATHER_LOCATION: 22,
        DURATION: 23,
        TIME: 24,
        GRADE: 25,
        MAX_GRADE: 26,
        ACCELERATION: 27,
        MAX_ACCELERATION: 28,
        BATTERY_LEVEL: 29,
        FIELD1: 30,
        FIELD2: 31,
        FIELD3: 32,
    },
    list: [
        { id: "SPEED", label: "SPEED", value: 0, value_size: "LARGE", required: true, active: true, needs_geo: true },
        { id: "MAX_SPEED", label: "MAX. SPEED", value: 0, value_size: "LARGE", required: true, active: true, needs_geo: true },
        { id: "DISTANCE", label: "DISTANCE", value: 0, value_size: "LARGE", active: true, needs_geo: true },
        { id: "DIRECTION", label: "DIRECTION", value: null, start_degree: 0, end_degree: 0, value_size: "LARGE", active: true, needs_geo: true },
        { id: "LATITUDE", label: "LATITUDE", value: 0, value_size: "SMALL", active: false, needs_geo: true },
        { id: "LONGITUDE", label: "LONGITUDE", value: 0, value_size: "SMALL", active: false, needs_geo: true },

        { id: "POSITION_ACCURACY", label: "POSITION ACCURACY", value: 0, value_size: "LARGE", active: false, needs_geo: true },
        { id: "ALTITUDE", label: "ALTITUDE", value: 0, value_size: "LARGE", active: false, needs_geo: true },
        { id: "ALTITUDE_ACCURACY", label: "ALTITUDE ACCURACY", value: 0, value_size: "LARGE", active: false, needs_geo: true },
        { id: "POSITION_FETCHED", label: "POSITION FETCHED", value: 0, value_size: "LARGE", active: false, needs_geo: true },

        { id: "WIND_DIRECTION", label: "WIND DIRECTION", value: null, value_size: "LARGE", needs_owm: true, active: true },
        { id: "WIND_SPEED", label: "WIND SPEED", value: 0, value_size: "LARGE", needs_owm: true, active: true },
        { id: "WEATHER", label: "WEATHER", value: 0, value_size: "MEDIUM", needs_owm: true, active: false },
        { id: "TEMP", label: "TEMP (C)", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "PRESSURE", label: "PRESSURE (hPa)", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "HUMIDITY", label: "HUMIDITY (%)", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "TEMP_MIN", label: "MIN. TEMP (C)", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "TEMP_MAX", label: "MAX. TEMP (C)", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "WEATHER_FETCHED", label: "WEATHER FETCHED", value: 0, value_size: "MEDIUM", needs_owm: true, active: false },
        { id: "WEATHER_COUNTRY", label: "COUNTRY", value: 0, value_size: "LARGE", needs_owm: true, active: false },
        { id: "SUNRISE", label: "SUNRISE", value: 0, value_size: "MEDIUM", needs_owm: true, active: false },
        { id: "SUNSET", label: "SUNSET", value: 0, value_size: "MEDIUM", needs_owm: true, active: false },
        { id: "WEATHER_LOCATION", label: "WEATHER LOCATION", value: 0, value_size: "MEDIUM", needs_owm: true, active: false },

        { id: "DURATION", label: "DURATION", value: 0, value_size: "MEDIUM", start_value: 0, value_millis: 0, resume_value: 0, paused: true, active: true },
        { id: "TIME", label: "TIME", value: 0, value_size: "MEDIUM", active: true, own_update: true },
        // { id: "ASCENT_TOTAL", label: "TOTAL ASCENT", value: 0, value_size: "MEDIUM", active: true, own_update: true },
        // { id: "DESCENT", label: "TOATAL DESCENT", value: 0, value_size: "MEDIUM", active: true, own_update: true },
        { id: "GRADE", label: "GRADE", value: 0, value_size: "MEDIUM", active: true },
        { id: "MAX_GRADE", label: "MAX. GRADE", value: 0, value_size: "MEDIUM", active: true },
        { id: "ACCELERATION", label: "ACCEL.", value: 0, value_size: "MEDIUM", active: true },
        { id: "MAX_ACCELERATION", label: "MAX. ACCEL.", value: 0, value_size: "MEDIUM", active: true },
        { id: "BATTERY_LEVEL", label: "BAT. LEVEL", value: 0, value_size: "MEDIUM", active: true },

        { id: "FIELD1", label: "FIELD1", value: 0, value_size: "LARGE", needs_mqtt: true, topic: null, active: false, needs_mqtt: true },
        { id: "FIELD2", label: "FIELD2", value: 0, value_size: "LARGE", needs_mqtt: true, topic: null, active: false, needs_mqtt: true },
        { id: "FIELD3", label: "FIELD3", value: 0, value_size: "LARGE", needs_mqtt: true, topic: null, active: false, needs_mqtt: true },
    ]
};

var _settings = { mqtt_broker: null, mqtt_port: null, mqtt_root_topics: null, mqtt_username: null, mqtt_password: null };
var _fetch_wind = { timer: null, interval: 60000, speed: null, deg: null, app_id: null, location: null };


var initPage = function () {
    _byko_localstorage = new BykoLocalStorage();
    _no_sleep = new NoSleep();
    var elems = document.getElementsByClassName("dynamic_field");
    Array.prototype.forEach.call(elems, function (elem) {
        var current_localstorgae_key = elem.attributes['localstorage-key'].value;
        var persisted_dynamic_field = _byko_localstorage.getDynamicFieldShowing(current_localstorgae_key);
        if (persisted_dynamic_field) {
            elem.attributes['dynamic-field'].value = persisted_dynamic_field;
        }
    });
    displayDynamicFields();
    //flashTime();
    setInterval(flashTime, 1000);
};

var flashTime = function () {
    var time = formatTime(new Date());
    _dynamic_fields.list[_dynamic_fields.indexes.TIME].value = formatTime(new Date());
    //dynamic-field=TIME
    var elems = document.getElementsByClassName("dynamic_field");
    Array.prototype.forEach.call(elems, function (elem) {
        if (elem.attributes['dynamic-field'].value == "TIME") {
            var value_elem = elem.getElementsByClassName("number-small")[0];
            if (value_elem.innerHTML.indexOf('<span class="black') == -1) {
                time = time.replace(":", '<span class="black-colon">:</span>');
            } else {
                time = time.replace(":", '<span class="white-colon">:</span>');
            }
            value_elem.innerHTML = time;
            return;
        }
    });
};

var getSettings = function () {
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].label = _byko_localstorage.getField1Lbl();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].label = _byko_localstorage.getField2Lbl();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].label = _byko_localstorage.getField3Lbl();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].topic = _byko_localstorage.getField1MqttTopic();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].topic = _byko_localstorage.getField2MqttTopic();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].topic = _byko_localstorage.getField3MqttTopic();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].value_size = _byko_localstorage.getField1TextSize();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].value_size = _byko_localstorage.getField2TextSize();
    _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].value_size = _byko_localstorage.getField3TextSize();
    _settings.mqtt_broker = _byko_localstorage.getMqttBroker();
    _settings.mqtt_port = _byko_localstorage.getMqttPort();
    _settings.mqtt_root_topics = _byko_localstorage.getMqttRootTopics();
    _settings.mqtt_username = _byko_localstorage.getMqttUsername();
    _settings.mqtt_password = _byko_localstorage.getMqttPassword();
    _fetch_wind.app_id = _byko_localstorage.getOwmAppId();
    if (_settings.mqtt_broker && _settings.mqtt_port && _settings.mqtt_root_topics) {
        _mqtt = new MQTT(_settings.mqtt_broker, _settings.mqtt_port, on_mqtt_message);
    }
    var active_readings = _byko_localstorage.getActiveReadings();
    if (active_readings) {
        _dynamic_fields.list.some(function (item) {
            item.active = active_readings.indexOf(item.id) > -1;
        });
    }
};

var on_mqtt_message = function (topic, payload) {
    var topic_parts = topic.split("/");
    var field_topic = topic_parts[topic_parts.length - 1];
    _dynamic_fields.list.some(function (item) {
        if (item.needs_mqtt && item.topic == field_topic) {
            item.value = payload;
            return;
        }
    });
}

var initMqtt = function () {
    if (_mqtt) {
        _mqtt.connect();
        var root_topics = _settings.mqtt_root_topics;
        var topics = null;
        var field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD1];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.subscribe(topics);
        }
        field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD2];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.subscribe(topics);
        }
        field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD3];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.subscribe(topics);
        }
    }
};

var pauseMqtt = function () {
    if (_mqtt) {
        var root_topics = _settings.mqtt_root_topics;
        var topics = null;
        var field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD1];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.unsubscribe(topics);
        }
        field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD2];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.unsubscribe(topics);
        }
        field = _dynamic_fields.list[_dynamic_fields.indexes.FIELD3];
        if (field.topic && field.label) {
            topics = root_topics + "/" + field.topic;
            _mqtt.unsubscribe(topics);
        }
        _mqtt.disconnect();
    }
};

var toggleLock = function (img) {
    if (img.src.endsWith("unlock-2.png")) {
        if (!confirmUnlock()) {
            return;
        }
        screen.orientation.unlock()
        _no_sleep.disable(); // let the screen turn off.
        img.src = "img/lock-2.png";
    } else {
        if (!confirmLock()) {
            return;
        }
        var orientation = isLandscape() ? 'landscape' : 'portrait';
        screen.orientation.lock(orientation);
        _no_sleep.enable(); // keep the screen on!
        img.src = "img/unlock-2.png";
    }
};

var togglePlay = function (img, bypassAction) {
    if (img.src.endsWith("play.png")) {
        if (!bypassAction) {
            initGeolocation();
            _timer_second_updates = setInterval(displayDynamicFields, 1000);
            initMqtt();
            initMobileReadings();
            // wind fetch called from onposition - dependent on coords
        }
        img.src = "img/pause.png";
    } else {
        if (!bypassAction) {
            pauseGeolocation();
            clearInterval(_timer_second_updates);
            pauseMqtt();
            pauseWindFetch();
            pauseMobileReadings();
            setPauseValues();
        }
        img.src = "img/play.png";
    }
};

var setPauseValues = function () {
    _dynamic_fields.list[_dynamic_fields.indexes.SPEED].value = 0;
    _dynamic_fields.list[_dynamic_fields.indexes.DIRECTION].value = null;
    _dynamic_fields.list[_dynamic_fields.indexes.WIND_DIRECTION].value = null;
    _dynamic_fields.list[_dynamic_fields.indexes.WIND_SPEED].value = null;
    _dynamic_fields.list[_dynamic_fields.indexes.GRADE].value = null;
    _dynamic_fields.list[_dynamic_fields.indexes.ACCELERATION].value = null;
    displayDynamicFields();
    document.getElementById(_ids.screen.val_spd).innerHTML = 0;
};

var cycle_field = function (elem) {
    var current_field = elem.attributes['dynamic-field'].value;
    var current_localstorgae_key = elem.attributes['localstorage-key'].value;
    var current_index = findWithAttr(_dynamic_fields.list, 'id', current_field);
    for (var i = current_index + 1; i < _dynamic_fields.list.length; i++) {
        var dynamic_field = _dynamic_fields.list[i];
        if (!field_is_supported(dynamic_field)) {
            continue;
        }
        var cycle_value = dynamic_field.id;
        elem.attributes['dynamic-field'].value = cycle_value;
        _byko_localstorage.setDynamicFieldShowing(current_localstorgae_key, cycle_value);
        displayDynamicFields();
        return;
    }

    for (var i = 0; i < current_index; i++) {
        var dynamic_field = _dynamic_fields.list[i];
        if (!field_is_supported(dynamic_field)) {
            continue;
        }
        var cycle_value = dynamic_field.id;
        elem.attributes['dynamic-field'].value = cycle_value;
        _byko_localstorage.setDynamicFieldShowing(current_localstorgae_key, cycle_value);
        displayDynamicFields();
        return;
    }
}

var field_is_supported = function (dynamic_field) {
    if (dynamic_field.required) {
        return false;
    }
    if (!dynamic_field.active) {
        return false;
    }
    if (dynamic_field.needs_owm && !_fetch_wind.app_id) {
        return false;
    }
    if (dynamic_field.needs_mqtt && (!_settings.mqtt_broker || !_settings.mqtt_port || !dynamic_field.topic)) {
        return false;
    }
    return true;
};

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr].replace(" ", "_") === value) {
            return i;
        }
    }
    return -1;
}

var displayDynamicFields = function () {
    console.log("displayDynamicFields");
    var classnames = { SMALL: "field-value-small", MEDIUM: "field-value-medium", LARGE: "field-value-large" };
    _last_dynamic_update = new Date();
    var elems = document.getElementsByClassName("dynamic_field");
    Array.prototype.forEach.call(elems, function (elem) {
        var dynamic_field = elem.attributes['dynamic-field'].value;
        var field_size = elem.attributes['dynamic-field-size'].value;
        var dynamic_field_definition = _dynamic_fields.list[_dynamic_fields.indexes[dynamic_field]];
        var label_elem = elem.getElementsByClassName("label")[0];
        var value_elem = elem.getElementsByClassName("field-value")[0];
        if (label_elem.innerHTML != dynamic_field_definition.label) {
            label_elem.innerHTML = dynamic_field_definition.label;
        }
        // clear wind direction pointer
        var style = "linear-gradient(0deg, transparent 50%, black 50%), linear-gradient(360deg, black 50%, transparent 50%)";
        value_elem.style.backgroundImage = style;
        // set observation sizes
        if (field_size != dynamic_field_definition.value_size) {
            removeClassnames(value_elem, classnames);
        }
        console.log("------------------------");
        console.log(dynamic_field_definition.label);
        console.log("field_size: " + field_size);
        console.log("dynamic_field_definition.value_size: " + dynamic_field_definition.value_size);
        value_elem.classList.add(classnames[dynamic_field_definition.value_size]);
        elem.attributes['dynamic-field-size'].value = dynamic_field_definition.value_size;
        console.log(value_elem.className);
        if (!dynamic_field_definition.own_update) {
            if (dynamic_field_definition.value != null && label_elem.innerHTML == "DISTANCE") {
                value_elem.innerHTML = formatNumber(dynamic_field_definition.value, 3);
            } else if (dynamic_field_definition.value != null && label_elem.innerHTML == "DIRECTION") {
                value_elem.innerHTML = dynamic_field_definition.value;
                var style = "linear-gradient(" + dynamic_field_definition.start_degree + "deg, transparent 50%, black 50%), linear-gradient(" + dynamic_field_definition.end_degree + "deg, black 50%, transparent 50%)";
                value_elem.style.backgroundImage = style;
            } else {
                var value = "";
                if (dynamic_field_definition.value == null) {
                    value = "--";
                } else {
                    value = dynamic_field_definition.value.toString().substr(0, 8);
                }
                value_elem.innerHTML = value;
            }
        }
    });
};

var removeClassnames = function (elem, classNames) {
    Object.keys(classNames).some(function(key){
        console.log(classNames[key]);
        elem.classList.remove(classNames[key]);
    });
}

var confirmLock = function () {
    var conf = confirm("Fullscreen and Keep Screen Awake?");
    var docelem = document.documentElement;
    if (conf == true) {
        if (docelem.requestFullscreen) {
            docelem.requestFullscreen();
        }
        else if (docelem.mozRequestFullScreen) {
            docelem.mozRequestFullScreen();
        }
        else if (docelem.webkitRequestFullScreen) {
            docelem.webkitRequestFullScreen();
        }
        else if (docelem.msRequestFullscreen) {
            docelem.msRequestFullscreen();
        }
        return true;
    } else {
        return false;
    }
}

var confirmUnlock = function () {
    var conf = confirm("Unlock?");
    if (conf == true) {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        return true;
    } else {
        return false;
    }
};

var loadJS = function (url, implementationCode, location) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    location.appendChild(scriptTag);
};

var initWindFetch = function () {
    console.log("initWindFetch");
    if (_fetch_wind.app_id && _fetch_wind.app_id.length == 32) {
        windFetch();
        _fetch_wind.timer = setInterval(windFetch.bind(this), _fetch_wind.interval);
    } else if (!_OpenWeatherMapKeyErrorShown) {
        vanillaToast.error("OpenWeatherMap KEY missing!", { duration: 4000, fadeDuration: 180 });
        _OpenWeatherMapKeyErrorShown = true;
    }
};

var pauseWindFetch = function () {
    if (_fetch_wind.timer) {
        clearInterval(_fetch_wind.timer);
        _fetch_wind.timer = null;
    }
};

var windFetch = function () {
    console.log("windFetch attempt");
    var lastWindFetch = _byko_localstorage.getLastWindFetch();
    if (lastWindFetch) {
        var now = new Date();
        var ellapsed = now - lastWindFetch; // max 9007199254740991 ENOUGH
        if (ellapsed < 600000) { // 10 minutes
            console.log("windFetch attempt < 10 minutes");
            _fetch_wind.speed = _byko_localstorage.getLastWindSpeed();// m/s
            _fetch_wind.deg = _byko_localstorage.getLastWindDeg();
            return;
        }
    }
    if (_fetch_wind.app_id && _fetch_wind.app_id.length == 32) {
        var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + _lastPos.lat + "&lon=" + _lastPos.lng + "&units=metric&appid=" + _fetch_wind.app_id;
        fetch(url, {
            method: 'get'
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log("windFetch success");
                console.log(data);
                var now = new Date();
                _byko_localstorage.setLastWindFetch(now);
                _fetch_wind.speed = data.wind.speed;// m/s
                _byko_localstorage.setLastWindSpeed(data.wind.speed)
                _fetch_wind.deg = data.wind.deg;
                _byko_localstorage.setLastWindDeg(data.wind.deg)
                _fetch_wind.location = data.name;
                _dynamic_fields.list[_dynamic_fields.indexes.WEATHER].value = data.weather[0].main;
                _dynamic_fields.list[_dynamic_fields.indexes.TEMP].value = data.main.temp;
                _dynamic_fields.list[_dynamic_fields.indexes.PRESSURE].value = data.main.pressure;
                _dynamic_fields.list[_dynamic_fields.indexes.HUMIDITY].value = data.main.humidity;
                _dynamic_fields.list[_dynamic_fields.indexes.TEMP_MIN].value = data.main.temp_min;
                _dynamic_fields.list[_dynamic_fields.indexes.TEMP_MAX].value = data.main.temp_max;
                _dynamic_fields.list[_dynamic_fields.indexes.WEATHER_FETCHED].value = formatTime(now);
                _dynamic_fields.list[_dynamic_fields.indexes.WEATHER_COUNTRY].value = data.sys.country;
                _dynamic_fields.list[_dynamic_fields.indexes.SUNRISE].value = formatEpochTime(data.sys.sunrise);// formatTime(new Date(data.sys.sunrise));
                _dynamic_fields.list[_dynamic_fields.indexes.SUNSET].value = formatEpochTime(data.sys.sunset);
                _dynamic_fields.list[_dynamic_fields.indexes.WEATHER_LOCATION].value = formatLocation(data.name);
            }).catch(onWindFetchError);
    }
};

var formatTime = function (time) {
    return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
}

var formatEpochTime = function (seconds) {
    var time = new Date(0);
    time.setUTCSeconds(seconds);
    return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
}

var formatLocation = function (name) {
    if (name.length < 7) {
        return name;
    }
    var parts = name.split(' ');
    if (parts.length == 1) {
        return name.substr(0, 6) + ".";
    }
    return parts[0].substr(0, 1) + " " + parts[1].substr(0, 4) + ".";
}

var onWindFetchError = function (error) {
    vanillaToast.error("Error fetching from OpenWeatherMap!", { duration: 4000, fadeDuration: 180 });
    console.log(error);
}
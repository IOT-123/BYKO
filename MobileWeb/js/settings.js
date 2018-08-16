



var showSettings = function () {
    console.log("showSettings");
    if (isLandscape()) {
        console.log("showSettings 2");
        vanillaToast.warning('Rotate screen upright for Settings!', { duration: 4000, fadeDuration: 180 });
        console.log("showSettings 3");
        return;
    }
    var settingsForm = new tingle.modal({
        closeMethods: [],
        footer: true,
        stickyFooter: true
    });
    settingsForm.setContent(document.querySelector('.settings-form').innerHTML);
    settingsForm.addFooterBtn('Save', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', function () {
        // services
        value = document.getElementById(_ids.settings.val_mqtt_broker).value;
        _byko_localstorage.setMqttBroker(value)
        _settings.mqtt_broker = value;
        value = document.getElementById(_ids.settings.val_mqtt_port).value;
        _byko_localstorage.setMqttPort(value)
        _settings.mqtt_port = value;
        value = document.getElementById(_ids.settings.val_mqtt_root_topics).value;
        _byko_localstorage.setMqttRootTopics(value)
        _settings.mqtt_root_topics = value;
        // value = document.getElementById(_ids.settings.val_mqtt_username).value;
        // _byko_localstorage.setMqttUsername(value)
        // _settings.mqtt_username = value;
        // value = document.getElementById(_ids.settings.val_mqtt_password).value;
        // _byko_localstorage.setMqttPassword(value)
        _settings.mqtt_password = value;
        value = document.getElementById(_ids.settings.val_appid).value;
        _byko_localstorage.setOwmAppId(value);
        _fetch_wind.app_id = value;

        // fields
        var value = document.getElementById(_ids.settings.val_field1_label).value;
        _byko_localstorage.setField1Lbl(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].label = value;
        value = document.getElementById(_ids.settings.val_field2_label).value;
        _byko_localstorage.setField2Lbl(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].label = value;
        value = document.getElementById(_ids.settings.val_field3_label).value;
        _byko_localstorage.setField3Lbl(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].label = value;
        value = document.getElementById(_ids.settings.val_field1_mqtt_topic).value;
        _byko_localstorage.setField1MqttTopic(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].topic = value;
        value = document.getElementById(_ids.settings.val_field2_mqtt_topic).value;
        _byko_localstorage.setField2MqttTopic(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].topic = value;
        value = document.getElementById(_ids.settings.val_field3_mqtt_topic).value;
        _byko_localstorage.setField3MqttTopic(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].topic = value;
        value = document.getElementById(_ids.settings.val_field1_text_size).value;
        _byko_localstorage.setField1TextSize(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD1].value_size = value;
        value = document.getElementById(_ids.settings.val_field2_text_size).value;
        _byko_localstorage.setField2TextSize(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD2].value_size = value;
        value = document.getElementById(_ids.settings.val_field3_text_size).value;
        _byko_localstorage.setField3TextSize(value)
        _dynamic_fields.list[_dynamic_fields.indexes.FIELD3].value_size = value;
        // readings
        var active_list = [];
        var list_elem = document.getElementById("settings_readings_list");
        var chks = list_elem.getElementsByClassName("settings_readings_item_left_chk");
        Array.prototype.forEach.call(chks, function (chk) {
            var id = chk.getAttribute("dynamic-field");
            if (chk.checked) {
                active_list.push(id);
            }
            _dynamic_fields.list[_dynamic_fields.indexes[id]].active = chk.checked;
        });
        _byko_localstorage.setActiveReadings(active_list);
        settingsForm.close();
    });
    settingsForm.addFooterBtn('Cancel', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function () {
        settingsForm.close();
    });
    fetchLocalStorageSettings();
    settingsForm.open();
};

var fetchLocalStorageSettings = function () {
    if (typeof (Storage) !== "undefined") {

        // services
        document.getElementById(_ids.settings.val_appid).value = _byko_localstorage.getOwmAppId();

        // fields
        document.getElementById(_ids.settings.val_field1_label).value = _byko_localstorage.getField1Lbl();
        document.getElementById(_ids.settings.val_field2_label).value = _byko_localstorage.getField2Lbl();
        document.getElementById(_ids.settings.val_field3_label).value = _byko_localstorage.getField3Lbl();
        document.getElementById(_ids.settings.val_field1_mqtt_topic).value = _byko_localstorage.getField1MqttTopic();
        document.getElementById(_ids.settings.val_field2_mqtt_topic).value = _byko_localstorage.getField2MqttTopic();
        document.getElementById(_ids.settings.val_field3_mqtt_topic).value = _byko_localstorage.getField3MqttTopic();
        document.getElementById(_ids.settings.val_field1_text_size).value = _byko_localstorage.getField1TextSize();
        document.getElementById(_ids.settings.val_field2_text_size).value = _byko_localstorage.getField2TextSize();
        document.getElementById(_ids.settings.val_field3_text_size).value = _byko_localstorage.getField3TextSize();
        document.getElementById(_ids.settings.val_mqtt_broker).value = _byko_localstorage.getMqttBroker();
        document.getElementById(_ids.settings.val_mqtt_port).value = _byko_localstorage.getMqttPort();
        document.getElementById(_ids.settings.val_mqtt_root_topics).value = _byko_localstorage.getMqttRootTopics();
        // document.getElementById(_ids.settings.val_mqtt_username).value = _byko_localstorage.getMqttUsername();
        // document.getElementById(_ids.settings.val_mqtt_password).value = _byko_localstorage.getMqttPassword();
        document.getElementById(_ids.settings.chk_mock).checked = _byko_localstorage.getSettingsMock();
        if (document.getElementById(_ids.settings.chk_mock).checked) {
            chkMockClick(document.getElementById(_ids.settings.chk_mock));
        }
        build_readings_list();
    } else {
        // Sorry! No Web Storage support..
    }
};

var build_readings_list = function () {
    var list_elem = document.getElementById("settings_readings_list");
    while (list_elem.lastChild) {
        list_elem.removeChild(list_elem.lastChild);
    }
    _dynamic_fields.list.some(function (item) {
        const row = document.createElement('div');
        if (item.required) {
            row.className = "settings_readings_item_disabled";
        } else {
            row.className = "settings_readings_item";
        }
        const chk = document.createElement('input');
        chk.className = "settings_readings_item_left_chk";
        chk.setAttribute("dynamic-field", item.id);
        chk.type = "checkbox";
        if (item.required) {
            chk.checked = true;
            chk.disabled = "disabled";
        } else {
            chk.checked = item.active;
        }
        row.appendChild(chk);
        const span_left = document.createElement('span');
        span_left.className = "settings_readings_item_left";
        span_left.innerText = item.label;
        row.appendChild(span_left);
        var group = "";
        if (item.needs_geo) {
            group = "GEOLOCATION"
        } else if (item.needs_owm) {
            group = "OPENWEATHERMAP"
        } else if (item.needs_mqtt) {
            group = "MQTT"
        } else {
            group = "MOBILE"
        }
        const span_right = document.createElement('span');
        span_right.className = "settings_readings_item_right";
        span_right.innerText = group;
        row.appendChild(span_right);

        list_elem.appendChild(row);
    });
}



var chkMockClick = function (elem) {
    _byko_localstorage.setSettingsMock(elem.checked);
    _is_mocking = elem.checked;
}

var butResetMax = function () {
    _max_speed = 0;
    document.getElementById(_ids.screen.val_max_spd).innerHTML = _max_speed;
}

var butResetDistance = function () {
    _dynamic_fields.list[_dynamic_fields.indexes.DISTANCE].value = 0;
    document.getElementById(_ids.screen.val_dist).innerHTML = formatNumber(0, 3);
}

var toast = function (msg) {
    vanillaToast.show(msg, { duration: 2000, fadeDuration: 180 })
}

var show_page = function (id) {
    document.getElementById("settings_menu_page").style.display = 'none';
    document.getElementById("settings_trip_page").style.display = 'none';
    document.getElementById("settings_services_page").style.display = 'none';
    document.getElementById("settings_fields_page").style.display = 'none';
    document.getElementById("settings_readings_page").style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

function isLandscape() {
    var object = window.screen.orientation || window.screen.msOrientation || window.screen.mozOrientation || null;
    if (object) {
        if (object.type.indexOf('landscape') !== -1) { return true; }
        if (object.type.indexOf('portrait') !== -1) { return false; }
    }
    if ('orientation' in window) {
        var value = window.orientation;
        if (value === 0 || value === 180) {
            return false;
        } else if (value === 90 || value === 270) {
            return true;
        }
    }
    // fallback to comparing width to height
    return window.innerWidth > window.innerHeight;
}
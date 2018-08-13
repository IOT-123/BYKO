

var _lastPos = { lat: 0, lng: 0 };

var _max_speed = 0;
var _watch_timer_id;
var _geo_simulator;
var _positionOptions = {
    enableHighAccuracy: true,
    timeout: Infinity,
    maximumAge: 0
};

var _is_mocking = false;

// initialize and possibly resume geo/ui updates
var initGeolocation = function () {
    if (navigator.geolocation) {
        if (_is_mocking) {
            if (_geo_simulator) { // already started
                _geo_simulator.pauseMocking = false;
                _geo_simulator.getMockingPosition();
            } else {
                loadJS('js/geolocation-simulator.js', onMockingLoad, document.body);
            }
        } else {
            navigator.geolocation.getCurrentPosition(onPosition, onPositionError, _positionOptions);
            _watch_timer_id = navigator.geolocation.watchPosition(onPosition, onPositionError, _positionOptions);
        }
    }
    else {
        alert('Geolocation is not supported for this Browser/OS version yet.');
    }
}

// pause update of ui
var pauseGeolocation = function () {
    if (navigator.geolocation) {
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].resume_value += _dynamic_fields.list[_dynamic_fields.indexes.DURATION].value_millis;
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].paused = true;
        if (_is_mocking) {
            _geo_simulator.pauseMocking = true;
            navigator.geolocation.clearWatch(); //override in simulator
        } else {
            navigator.geolocation.clearWatch(_watch_timer_id);
        }
    }
    else {
        alert('Geolocation is not supported for this Browser/OS version yet.');
    }
}

// success callback on getCurrentPosition and watchPosition
var onPosition = function (position) {
    displaySpeed(position); // stays static
    calculateEllapsed(position);
    calculateDirection(position);
    setGeolocation(position);
//    displayDynamicFields();
    _lastPos.lat = position.coords.latitude;
    _lastPos.lng = position.coords.longitude;
    if (_fetch_wind.app_id && !_fetch_wind.timer) {
        initWindFetch();
    }
}

var setGeolocation = function (position) {
    _dynamic_fields.list[_dynamic_fields.indexes.LATITUDE].value = position.coords.latitude;
    _dynamic_fields.list[_dynamic_fields.indexes.LONGITUDE].value = position.coords.longitude;
    _dynamic_fields.list[_dynamic_fields.indexes.POSITION_ACCURACY].value = position.coords.accuracy;
    _dynamic_fields.list[_dynamic_fields.indexes.ALTITUDE].value = position.coords.altitude;
    _dynamic_fields.list[_dynamic_fields.indexes.ALTITUDE_ACCURACY].value = position.coords.altitudeAccuracy;
    _dynamic_fields.list[_dynamic_fields.indexes.POSITION_FETCHED].value = formatTime(new Date());
}


// show error when live api faults
var onPositionError = function (error) {
    if (error.message.indexOf("Only secure origins are allowed") == 0) {
        alert("Only secure origins are allowed");
    } else {
        alert('Error occurred. Error code: ' + error.code);
    }
    //#region
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from locaton provider)
    //   3: timed out
    //#endregion 
}

// derive and display image (better control) for direction
var calculateDirection = function (position) {
    var heading = position.coords.heading;
    _dynamic_fields.list[_dynamic_fields.indexes.DIRECTION].value = getDirFromDeg(heading);
    _dynamic_fields.list[_dynamic_fields.indexes.WIND_DIRECTION].value = getDirFromDeg(_fetch_wind.deg);
    _dynamic_fields.list[_dynamic_fields.indexes.WIND_SPEED].value = _fetch_wind.speed;
    // wind indicator
    if (_fetch_wind.speed) { // have fetched values
        var offset_degrees = (_fetch_wind.deg - heading) - 90;
        // due north calcs // html angle starts at 90degrees
        var arc_degrees = (_fetch_wind.speed * 3) + 10;
        var start_degree = (-1 * (arc_degrees / 2)) + offset_degrees;
        var end_degree = (arc_degrees / 2) + offset_degrees;
        if (start_degree < 0) {
            start_degree = 360 + start_degree;
        }
        if (end_degree < 0) {
            end_degree = 360 + end_degree;
        }
        _dynamic_fields.list[_dynamic_fields.indexes.DIRECTION].start_degree = Math.round(start_degree);
        _dynamic_fields.list[_dynamic_fields.indexes.DIRECTION].end_degree = Math.round(end_degree);
    }
}

var getDirFromDeg = function (deg) {
    if (deg == null){
        return "--";
    }
    if (deg >= 337 || deg <= 23) {
        return "N";
    } else if (deg <= 68) {
        return "NE";
    } else if (deg <= 113) {
        return "E";
    } else if (deg <= 158) {
        return "SE";
    } else if (deg <= 203) {
        return "S";
    } else if (deg <= 248) {
        return "SW";
    } else if (deg <= 293) {
        return "W";
    } else {
        return "NW";
    }
};

// alculate and display speed and max speed
var displaySpeed = function (position) {
    var currSpeed = position.coords.speed; // Meters per second
    currSpeed = currSpeed * 60 * 60; // meters per hour
    currSpeed = Math.round(currSpeed / 1000); // k/hr
    // smooth
    if (_lastPos.speed) {
        var difference = _lastPos.speed - currSpeed;
        if (Math.abs(difference) > 3) {
            var smooth = difference * 0.66;
            currSpeed = Math.round(currSpeed + smooth);
        }
    }
    document.getElementById(_ids.screen.val_spd).innerHTML = currSpeed;
    _max_speed = Math.max(currSpeed, _max_speed);
    document.getElementById(_ids.screen.val_max_spd).innerHTML = _max_speed;
    _lastPos.speed = currSpeed;
}

// calculate and display trip distance
var calculateEllapsed = function (position) {
    if ( _dynamic_fields.list[_dynamic_fields.indexes.DURATION].paused){
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].start_value = new Date();
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].paused = false;
    }
    if (!_lastPos || (_lastPos.lat == 0 && _lastPos.lng == 0)) {
        _dynamic_fields.list[_dynamic_fields.indexes.DISTANCE].value = 0;
    } else {
        var lat1 = _lastPos.lat;
        var lon1 = _lastPos.lng;
        var lat2 = position.coords.latitude;
        var lon2 = position.coords.longitude;
        var segmentDist = distance(lat1, lon1, lat2, lon2);
        _dynamic_fields.list[_dynamic_fields.indexes.DISTANCE].value += segmentDist;
        var elapsed = new Date() - _dynamic_fields.list[_dynamic_fields.indexes.DURATION].start_value;
        var resume_value = _dynamic_fields.list[_dynamic_fields.indexes.DURATION].resume_value;
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].value_millis = elapsed;
        _dynamic_fields.list[_dynamic_fields.indexes.DURATION].value = millisToMinutesAndSeconds(elapsed + resume_value);
    }
    _lastPos.lat = position.coords.latitude;
    _lastPos.lng = position.coords.longitude;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

// load geo sim library then config
var onMockingLoad = function () {
    loadJS('js/class-geolocation-simulator-config.js', onMockingConfigLoad, document.body);
}

var onMockingComplete = function () {
    var img = document.getElementById(_ids.toolbar.btn_play);
    togglePlay(img, true);
    alert('you have arrived!  AAA');
}

// initialize mocking and start
var onMockingConfigLoad = function () {
    _geo_simulator = new BykoSimulator();
//    setMockingUi();
    _geo_simulator.start(onMockingComplete);
    _geo_simulator.getMockingPosition();
}

// insert friendlier period and better control of length
var formatNumber = function (value, precision) {
    if (value == 0) return "0.0";
    if (value == null) return "0.0";
    //var dot = '<span class="number-small-decimal-pt">.</span>';
    var parts = value.toString().split(".");
    if (parts[0].length >= (precision)) {
        return parts[0];
    }
    return parts[0] + '.' + parts[1].substr(0, precision - parts[0].length);
}

// distacnce is derived for all coords (mocking of live)
function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

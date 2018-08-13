var _battery = null;

var initMobileReadings = function () {
    window.addEventListener('devicemotion', onDeviceMotion);
    window.addEventListener('deviceorientation', onDeviceOrientation, true);
    initBatteryPromise();
};

var pauseMobileReadings = function () {
    window.removeEventListener("devicemotion", onDeviceMotion);
    window.removeEventListener("deviceorientation", onDeviceOrientation, true);
    _battery.removeEventListener('levelchange', onLevelChange);
};

var onDeviceMotion = function (event) {
    var acceleration = event.acceleration.y;
    _dynamic_fields.list[_dynamic_fields.indexes.ACCELERATION].value = formatNumber(acceleration, 3);;
    var current_max = _dynamic_fields.list[_dynamic_fields.indexes.MAX_ACCELERATION].value;
    _dynamic_fields.list[_dynamic_fields.indexes.MAX_ACCELERATION].value = formatNumber(Math.max(acceleration, current_max), 3)
};


var onDeviceOrientation = function (event) {
    var grade = precentageIn180(event.beta);
    _dynamic_fields.list[_dynamic_fields.indexes.GRADE].value = grade;
    var current_max = _dynamic_fields.list[_dynamic_fields.indexes.MAX_GRADE].value;
    _dynamic_fields.list[_dynamic_fields.indexes.MAX_GRADE].value = Math.max(grade, current_max)
};

function precentageIn180(value) {
    return ((value * 100) / 180).toFixed(0);
}

var initBatteryPromise = function () {
    console.log("initBatteryPromise");
    if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {



        var batteryPromise;

        if ('getBattery' in navigator) {
            batteryPromise = navigator.getBattery();
        } else {
            batteryPromise = Promise.resolve(navigator.battery);
        }

        batteryPromise.then(function (battery) {
            console.log("batteryPromise.then");
            _dynamic_fields.list[_dynamic_fields.indexes.BATTERY_LEVEL].value = decimalToPercent(battery.level);
            _battery = battery;
            _battery.addEventListener('levelchange', onLevelChange);
        });

    }

}

function onLevelChange() {
    console.log("onLevelChange");
    console.log(this.level);
    _dynamic_fields.list[_dynamic_fields.indexes.BATTERY_LEVEL].value = decimalToPercent(this.level);
}

var decimalToPercent = function(value){
    return Math.round(value * 100) + '%'
}
function BykoSimulator() {
    var _simulator = null;
    var _timer,
        _timerInterval = 1000; //play with these to see more infrequent results (>= 1000)
    var _pathData = [
        { latitude: 42.352376, longitude: -71.064548 },
        { latitude: 42.353454, longitude: -71.064184 },
        { latitude: 42.354707, longitude: -71.063647 },
        { latitude: 42.355785, longitude: -71.062768 },
        { latitude: 42.356483, longitude: -71.062016 },
        { latitude: 42.357069, longitude: -71.062660 },
        { latitude: 42.357672, longitude: -71.063261 },
        { latitude: 42.357164, longitude: -71.064978 },
        { latitude: 42.356768, longitude: -71.066844 },
        { latitude: 42.356213, longitude: -71.069334 },
        { latitude: 42.355832, longitude: -71.070921 },
        { latitude: 42.355452, longitude: -71.072509 },
        { latitude: 42.353517, longitude: -71.071479 },
        { latitude: 42.351947, longitude: -71.070685 },
        { latitude: 42.352566, longitude: -71.067595 },
        { latitude: 42.352344, longitude: -71.064591 }
    ];
    this.pauseMocking = false;


    //tap into the geolocation api
    this.getMockingPosition = function () {
        if (this.pauseMocking) return;
        //if geolocation is available, proceed
        if ('geolocation' in navigator) {
            //get location
            navigator.geolocation.getCurrentPosition(onPosition, onPositionError, _positionOptions);
            //lets keep getting it to see where this fella goes
            _timer = setTimeout(this.getMockingPosition.bind(this), _timerInterval);
        } else {
            alert.log('what browser are you using??');
        }
    }

    this.start = function () {
        _simulator = GeolocationSimulator({ coords: _pathData });
        _simulator.start();
    }

}












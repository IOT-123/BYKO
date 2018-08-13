
class MQTT {
    constructor(broker, port, onmessage_callback) {

        var _mosquitto = new Mosquitto();

        var _broker = broker;
        var _port = port;
        var _onmessage_callback = onmessage_callback;

        // properties
        this.connected = false;
        this.auto_reconnect = false;

        // methods
        this.connect = function () {
            var url = "wss://" + _broker + ":" + _port + "/mqtt";
            console.log(url);
            this.auto_reconnect = true;
            _mosquitto.connect(url);
        }

        this.disconnect = function () {
            console.log("disconnect");
            this.auto_reconnect = false;
            _mosquitto.disconnect();
        }

        this.subscribe = function(topic){
            console.log("subscribe");
            console.log(topic);
			_mosquitto.subscribe(topic, 0);
		};

		this.unsubscribe = function(topic){
            console.log("unsubscribe");
			_mosquitto.unsubscribe(topic);
        }
        
        this.publish = function(topic, payload){
            console.log(topic);
			_mosquitto.publish(topic, payload, 0);
        };
        
        // events
        _mosquitto.onconnect = function (rc) {
            this.connected = true;
        };

        _mosquitto.ondisconnect = function (rc) {
            this.connected = false;
            if (this.auto_reconnect) {
                this.connect();
            }
        };

        _mosquitto.onmessage = function (topic, payload, qos) {
            console.log("onmessage");
            _onmessage_callback(topic, payload);
        };

    }
}
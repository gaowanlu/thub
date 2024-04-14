const WS = { socket: null, open: null, message: null, close: null, error: null, isConnected: false };
WS.connect = function () {
    this.isConnected = false;
    this.socket = new WebSocket("ws://61.171.51.135:20023/");
    this.socket.addEventListener("open", (event) => {
        if (this.open) {
            this.open(event);
        }
        this.isConnected = true;
    });
    this.socket.addEventListener("message", (event) => {
        if (this.message) {
            this.message(event);
        }
    });
    this.socket.addEventListener("close", (event) => {
        if (this.close) {
            this.close(event);
        }
        this.isConnected = false;
    });
    this.socket.addEventListener("error", (event) => {
        if (this.error) {
            this.error(event);
        }
        this.isConnected = false;
    });
};
WS.send = function (data) {
    if (this.isConnected) {
        this.socket.send(data);
    }
}

export default WS;
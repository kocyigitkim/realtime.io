const chalk = require("chalk");
const { Manager } = require("socket.io-client");
const RealtimeIOClientOptions = require("./RealtimeIOClientOptions");
const RealtimeEvent = require("../RealtimeEvent");
class RealtimeIOClient {
  /**
   *
   * @param {RealtimeIOClientOptions} options
   */
  constructor(options) {
    this.options = options;
    this.clientObjects = [];
    this.connected = new RealtimeEvent();
    this.disconnected = new RealtimeEvent();
    this.received = new RealtimeEvent();
    this.sent = new RealtimeEvent();
    this.authenticated = new RealtimeEvent();
    this.serverError = new RealtimeEvent();
  }
  connect() {
    const _client = this;
    if (this.options.debug)
      console.log(chalk.black(chalk.bgYellow("Connecting server...")));
    this.manager = new Manager(
      "ws://" + this.options.host + ":" + this.options.port
    );
    this.socket = this.manager.socket(this.options.path);

    function processMessageReceive(message) {
      const { type, id, action, args } = message;
      var mode = message.mode;
      var targetClientObject = _client.clientObjects.filter(
        (p) => p.name == type
      )[0];
      if (!targetClientObject) {
        console.log(chalk.red(chalk.bgYellow(`Unknown client object ${type}`)));
        return;
      }
      if (mode == "broadcast") mode = "listener";
      if (mode == "listener") {
        const targetAction = (mode + "_" + action).toLowerCase();
        const targetActionName = Object.keys(targetClientObject)
          .map((propName) => ({
            original: propName,
            lcase: propName.toLowerCase(),
          }))
          .filter((p) => p.lcase == targetAction)[0];
        if (targetActionName) {
          targetClientObject[targetActionName.original](...args);
        } else {
          console.log(
            chalk.red(
              chalk.bgYellow(`Unknown client action ${type}.${targetAction}`)
            )
          );
        }
      } else if (mode == "normal") {
      }
    }

    this.on("connect", (...args) => {
      if (_client.options.debug)
        console.log(chalk.black(chalk.bgGreen("Connected.")));
      _client.connected.invoke(args);
      _client.handshake();
    });
    this.on("disconnect", (...args) => {
      if (_client.options.debug)
        console.log(chalk.black(chalk.bgRed("Disconnected.")));
      _client.disconnected.invoke(args);
    });
    this.on("message", (rawMessage) => {
      var message =JSON.parse(_client.options.encoder.decode(rawMessage));
      if (_client.options.debug)
        console.log(
          chalk.black(chalk.bgYellow("Received: " + JSON.stringify(message)))
        );
      processMessageReceive.call(_client, message);
      _client.received.invoke(message);
    });
    this.on("auth", (rawMessage) => {
        var message = JSON.parse(_client.options.encoder.decode(rawMessage));
      if (_client.options.debug) {
        console.log(
          chalk.black(
            chalk.bgCyan("Authentication: " + JSON.stringify(message))
          )
        );
      }
      _client.handshakeStatus = message;
      if (message && message.success) {
        _client.authenticated.invoke([message]);
      }
      else{
          _client.disconnect();
      }
    });
    this.on("error", (rawMessage) => {
        var message = JSON.parse(_client.options.encoder.decode(rawMessage));
      _client.serverError.invoke([message]);
      if (_client.options.showErrors) {
        console.log(
          chalk.black(chalk.bgRed("Server Error: " + JSON.stringify(message)))
        );
      }
    });

    this.socket.connect();
  }
  on(event, callback) {
    this.socket.on(event, callback);
  }
  send(message) {
    if (!this.handshakeStatus || !this.handshakeStatus.success) {
      console.log(
        chalk.black(
          chalk.bgRed(
            "Authentication failed!\n- Please check your authenticator."
          )
        )
      );
      return;
    }
    this.emit("message", message);
    if (this.options.debug) {
      console.log(
        chalk.black(chalk.bgGray("Emit: " + JSON.stringify(message)))
      );
    }
    this.sent.invoke(message);
  }
  handshake() {
    if (this.options.debug) {
      console.log(chalk.black(chalk.bgCyan("Waiting for authentication...")));
    }
    this.emit("auth", {
      method: this.options.authenticator.constructor.name,
      parameters: this.options.authenticator,
    });
  }
  emit(path, data){
    var rawData = JSON.stringify(data);
    var encodedData = this.options.encoder.encode(rawData);
    return this.socket.emit(path, encodedData);
  }
  disconnect(){
    this.socket.disconnect();
  }
  registerClientObject(client) {
    this.clientObjects.push(client);
  }
}

module.exports.RealtimeIOClient = RealtimeIOClient;

const RealtimeIOServerOptions = require("./RealtimeIOServerOptions");
const RealtimeIOSessionAccessor = require("./RealtimeIOSessionAccessor");
const events = require("events");
const io = require("socket.io");
const chalk = require("chalk");
const nodeCache = require("node-cache");
const RealtimeEvent = require("../RealtimeEvent");

class RealtimeIOServer {
  /**
   *
   * @param {RealtimeIOServerOptions} options
   */
  constructor(options) {
    this.options = options;
    this.serverObjects = [];
    this.cache = new nodeCache({ stdTTL: 300 });
    this.connected = new RealtimeEvent();
    this.disconnected = new RealtimeEvent();
    this.received = new RealtimeEvent();
    this.sent = new RealtimeEvent();
    this.sentBroadcast = new RealtimeEvent();
    this.authenticated = new RealtimeEvent();
    this.filters = [];
  }
  on(event, listener) {
    this.socket.on(event, listener);
  }
  registerServerObject(obj) {
    this.serverObjects.push(obj);
  }
  listen() {
    const _server = this;
    console.log(
      chalk.black(chalk.bgGreen(`Listening server at ${this.options.port}`))
    );
    this.socket = new io.Server(this.options.httpServer, {
      path: this.options.path,
    });

    function processMessageReceive(session, message) {
      if (session.has("__realtimeio__authentication")) {
        var handshakeStatus = session.get("__realtimeio__authentication");
        if (!handshakeStatus.success) {
          console.log(
            chalk.black(
              chalk.bgRed(`Authentication failed for ${session.sessionKey}`)
            )
          );
          session.client.disconnect();
          return;
        }
      }
      const { type, id, mode, action, args } = message;
      var targetServerObject = this.serverObjects.filter(
        (p) => p.name == type
      )[0];
      if (!targetServerObject) {
        console.log(chalk.black(chalk.bgRed(`Unknown server object ${type}`)));
        return;
      }
      if (mode == "listener") {
        const targetAction = (mode + "_" + action).toLowerCase();
        const targetActionName = Object.keys(targetServerObject)
          .map((propName) => ({
            original: propName,
            lcase: propName.toLowerCase(),
          }))
          .filter((p) => p.lcase == targetAction)[0];
        if (targetActionName) {
          targetServerObject[targetActionName.original](session, ...args);
        } else {
          console.log(
            chalk.red(
              chalk.bgYellow(`Unknown server action ${type}.${targetAction}`)
            )
          );
        }
      } else if (mode == "wait") {
        _server.cache.set(id, message);
      } else if (mode == "normal") {
      }
    }

    this.on("connection", (socket) => {
      var sessionKey = _server.options.sessionManager.create(socket);
      var session = new RealtimeIOSessionAccessor(
        _server.options.sessionManager,
        sessionKey
      );
      socket.session = session;
      if (_server.options.debug)
        console.log(
          chalk.black(chalk.bgYellow(`Client connected ${session.sessionKey}`))
        );

      _server.filters.forEach(filter=>{
        if(filter){
          var status = filter.execute(session);
          if(!status || !status.success){
            console.log(
              chalk.black(chalk.bgRed(`Client blocked ${session.sessionKey} - ${session.client.handshake.address}`))
            );
          }
        }
      })

      socket.on(
        "disconnect",
        (() => {
          if (_server.options.debug)
            console.log(
              chalk.black(
                chalk.bgYellow(`Client disconnected ${session.sessionKey}`)
              )
            );
        }).bind(this)
      );
      socket.on(
        "message",
        ((rawMessage) => {
          var message = JSON.parse(_server.options.encoder.decode(rawMessage));
          if (_server.options.debug)
            console.log(
              chalk.black(
                chalk.bgGray(`Message received ${JSON.stringify(message)}`)
              )
            );
          processMessageReceive.call(_server, session, message);
        }).bind(this)
      );
      socket.on("auth", (rawMessage) => {
        var message = JSON.parse(_server.options.encoder.decode(rawMessage));
        var handshakeResult = _server.options.authenticator.validate(
          session,
          message.parameters
        );
        if (_server.options.debug) {
          console.log(
            chalk.black(
              chalk.bgCyan(
                "Authentication: \n" +
                  JSON.stringify(message) +
                  "\n" +
                  JSON.stringify(handshakeResult)
              )
            )
          );
        }
        session.set("__realtimeio__authentication", handshakeResult);
        _server.handshake(session, handshakeResult);
        if (!handshakeResult || !handshakeResult.success) {
          session.client.disconnect();
        }
      });
    });

    if (!this.options.httpServer) this.socket.listen(this.options.port);
  }
  /**
   *
   * @param {RealtimeIORoom} room
   * @param {Object} data
   */
  broadcast(room, data) {
    if (room) {
      result = room.broadcast(data);
    } else {
      result = this.emit(this.socket.sockets, "message", data);
    }
    this.sentBroadcast.invoke(room, data);
    return result;
  }
  /**
   *
   * @param {RealtimeIOSessionAccessor} session
   * @param {Object} data
   */
  send(session, data) {
    var client = session.sessionObject.client;
    var result = this.emit(client, "message", data);
    this.sent.invoke(session, client, data);
    return result;
  }
  /**
   *
   * @param {RealtimeIOSessionAccessor} session
   * @param {Object} data
   */
  handshake(session, data) {
    var client = session.sessionObject.client;
    var result = this.emit(client, "auth", data);
    return result;
  }
  /**
   *
   * @param {RealtimeIOSessionAccessor} session
   * @param {Object} message
   */
  sendError(session, message) {
    var client = session.sessionObject.client;
    var result = this.emit(client, "error", message);
    return result;
  }

  /**
   *
   * @param {Object} target
   * @param {String} path
   * @param {Object} data
   */
  emit(target, path, data) {
    var rawData = JSON.stringify(data);
    var encodedData = this.options.encoder.encode(rawData);
    return target.emit(path, encodedData);
  }
  /**
   * 
   * @param {RealtimeIOFilter} filter 
   */
  addFilter(filter){
    this.filters.push(filter);
  }
}

module.exports = RealtimeIOServer;

const http = require("http");
const RealtimeIOSessionManager = require("./RealtimeIOSessionManager");
const RealtimeIOAuthenticator = require("../auth/RealtimeIOAuthenticator");
const RealtimeIOEncoder = require("../encoding/RealtimeIOEncoder");

module.exports = class RealtimeIOServerOptions {
  /**
   *
   * @param {http.Server} httpServer
   * @param {Number} port
   * @param {String} path
   * @param {RealtimeIOSessionManager} sessionManager
   * @param {RealtimeIOAuthenticator} authenticator
   * @param {RealtimeIOEncoder} encoder
   * @param {Boolean} debug
   */
  constructor(httpServer, port, path, sessionManager, authenticator, encoder, debug = false) {
    this.httpServer = httpServer;
    this.port = port;
    this.debug = debug;
    this.path = path;
    if (!sessionManager) {
      sessionManager = new RealtimeIOSessionManager();
    }
    this.sessionManager = sessionManager;
    if (!authenticator) {
      authenticator = new RealtimeIOAuthenticator();
    }
    this.authenticator = authenticator;
    if(!encoder){
      encoder = new RealtimeIOEncoder();
    }
    this.encoder = encoder;
  }
};

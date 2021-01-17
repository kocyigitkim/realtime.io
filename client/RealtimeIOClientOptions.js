const RealtimeIOAuthenticator = require("../auth/RealtimeIOAuthenticator");
const RealtimeIOEncoder = require("../encoding/RealtimeIOEncoder");

class RealtimeIOClientOptions {
  /**
   *
   * @param {String} host
   * @param {Number} port
   * @param {String} path
   * @param {Boolean} debug
   * @param {Boolean} showErrors
   * @param {RealtimeIOAuthenticator} authenticator
   * @param {RealtimeIOEncoder} encoder
   */
  constructor(
    host = "localhost",
    port = 3000,
    path = "/",
    debug = false,
    showErrors = true,
    authenticator,
    encoder
  ) {
    this.host = host;
    this.port = port;
    this.path = path;
    this.debug = debug;
    this.showErrors = showErrors;
    if (!authenticator) authenticator = new RealtimeIOAuthenticator();
    this.authenticator = authenticator;
    if (!encoder) encoder = new RealtimeIOEncoder();
    this.encoder = encoder;
  }
}
module.exports.RealtimeIOClientOptions = RealtimeIOClientOptions;

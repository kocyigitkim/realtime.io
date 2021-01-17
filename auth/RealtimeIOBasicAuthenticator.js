const RealtimeIOSessionAccessor = require("../server/RealtimeIOSessionAccessor");
const RealtimeIOAuthenticator = require("./RealtimeIOAuthenticator");

module.exports = class RealtimeIOBasicAuthenticator extends (
  RealtimeIOAuthenticator
) {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
  /**
   *
   * @param {RealtimeIOSessionAccessor} session
   * @param {Object} args
   */
  validate(session, args) {
    var username = args.user || args.username;
    var password = args.pass || args.password;
    var success = username == this.username && password == this.password;
    return {
      success: success,
      message: success ? "OK" : "ERR",
    };
  }
};

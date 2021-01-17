const RealtimeIOSessionAccessor = require("../server/RealtimeIOSessionAccessor");
const RealtimeIOAuthenticator = require("./RealtimeIOAuthenticator");

module.exports = class RealtimeIOTokenAuthenticator extends (
  RealtimeIOAuthenticator
) {
  constructor(token) {
    super();
    this.token = token;
  }
  /**
   *
   * @param {RealtimeIOSessionAccessor} session
   * @param {Object} args
   */
  validate(session, args) {
    var success = this.token == args.token;
    return {
      success: success,
      message: success ? "OK" : "ERR",
    };
  }
};

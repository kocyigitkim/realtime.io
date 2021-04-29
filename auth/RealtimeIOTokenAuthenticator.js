const RealtimeIOAuthenticator = require("./RealtimeIOAuthenticator");

module.exports = class RealtimeIOTokenAuthenticator extends (
  RealtimeIOAuthenticator
) {
  constructor(token) {
    super();
    this.token = token;
  }
};

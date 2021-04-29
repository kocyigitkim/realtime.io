const RealtimeIOAuthenticator = require("./RealtimeIOAuthenticator");

module.exports = class RealtimeIOBasicAuthenticator extends (
  RealtimeIOAuthenticator
) {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
};

module.exports.client = {
    RealtimeIOClient: require('./client/RealtimeIOClient').RealtimeIOClient,
    RealtimeIOClientObject: require('./client/RealtimeIOClientObject'),
    RealtimeIOClientOptions: require('./client/RealtimeIOClientOptions').RealtimeIOClientOptions
};
module.exports.auth = {
    RealtimeIOAuthenticator: require('./auth/RealtimeIOAuthenticator'),
    RealtimeIOBasicAuthenticator: require('./auth/RealtimeIOBasicAuthenticator'),
    RealtimeIOTokenAuthenticator: require('./auth/RealtimeIOTokenAuthenticator')
};
module.exports.encoding = {
    RealtimeIOEncoder: require('./encoding/RealtimeIOEncoder')
};
module.exports.RealtimeEvent = require('./RealtimeEvent');
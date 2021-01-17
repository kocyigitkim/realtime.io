const RealtimeIOSessionManager = require("./RealtimeIOSessionManager");

module.exports = class RealtimeIOSessionAccessor{
    /**
     * 
     * @param {RealtimeIOSessionManager} session 
     * @param {String} sessionKey 
     */
    constructor(session, sessionKey){
        this.session = session;
        this.sessionKey = sessionKey;
        this.sessionObject = session.getObject(sessionKey);
        this.client = this.sessionObject.client;
    }
    get(key){
        return this.sessionObject.args[key];
    }
    set(key, value){
        this.sessionObject.args[key] = value;
    }
    has(key){
        return Boolean(this.sessionObject.args[key]);
    }
    remove(key){
        delete this.sessionObject.args[key];
    }
};
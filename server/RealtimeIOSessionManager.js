const uid = require('uuid').v4;

module.exports = class RealtimeIOSessionManager{
    constructor(){
        this.session = {};
    }
    create(client){
        var key = uid();
        this.session[key] = {
            client: client,
            args: {}
        };
        return key;
    }
    set(sessionKey, key, value){
        this.session[sessionKey].args[key]=value;
    }
    get(sessionKey, key){
        return this.session[sessionKey].args[key];
    }
    getObject(sessionKey){
        return this.session[sessionKey];
    }
    has(sessionKey, key){
        var session = this.session[sessionKey];
        return Boolean(session) && Boolean(session.args[key])
    }
    remove(sessionKey, key){
        delete this.session[sessionKey].args[key];
    }
    dispose(sessionKey){
        delete this.session[key];
    }
};
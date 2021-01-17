const RealtimeIOSessionAccessor = require("../server/RealtimeIOSessionAccessor");

module.exports = class RealtimeIOAuthenticator{
    /**
     * 
     * @param {RealtimeIOSessionAccessor} session 
     * @param {Object} args 
     */
    validate(session, args){
        return {
            success: true,
            message: 'OK'
        };
    }
};
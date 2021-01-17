const RealtimeIOSessionAccessor = require('../server/RealtimeIOSessionAccessor');
class RealtimeIOFilterStatus{
    /**
     * 
     * @param {Boolean} success 
     * @param {String} message 
     */
    constructor(success, message){
        this.success = success;
        this.message = message;
    }
}
class RealtimeIOFilter{
    constructor(){
    }
    /**
     * 
     * @param {RealtimeIOSessionAccessor} session 
     */
    execute(session){
        return new RealtimeIOFilterStatus(true, "OK");
    }
}
module.exports = RealtimeIOFilter;
module.exports.RealtimeIOFilterStatus = RealtimeIOFilterStatus;
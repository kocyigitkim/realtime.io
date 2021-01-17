const RealtimeIOSessionAccessor = require("../server/RealtimeIOSessionAccessor");
const RealtimeIOFilter = require("./RealtimeIOFilter");

class RealtimeIOBlackListItem{
    /**
     * 
     * @param {String} ip 
     */
    constructor(ip){
        this.ip = ip;
    }
}

class RealtimeIOBlackListFilter extends RealtimeIOFilter{
    /**
     * 
     * @param {Array.<RealtimeIOBlackListItem>} blacklist 
     */
    constructor(blacklist){
        super();
        this.blacklist = blacklist;
    }
    /**
     * 
     * @param {RealtimeIOSessionAccessor} session 
     */
    execute(session){
        var clientIPAddress = session.client.handshake.address;
        var isBlocked = this.blacklist.filter(p=>p.ip == clientIPAddress).length > 0;
        return new RealtimeIOFilter.RealtimeIOFilterStatus(
            !isBlocked,
            isBlocked ? "Blocked" : "OK"
        );
    }
}

module.exports = RealtimeIOBlackListFilter;
module.exports.RealtimeIOBlackListItem = RealtimeIOBlackListItem;
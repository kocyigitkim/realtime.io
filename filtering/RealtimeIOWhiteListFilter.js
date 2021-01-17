const RealtimeIOSessionAccessor = require("../server/RealtimeIOSessionAccessor");
const RealtimeIOFilter = require("./RealtimeIOFilter");

class RealtimeIOWhiteListItem{
    /**
     * 
     * @param {String} ip 
     */
    constructor(ip){
        this.ip = ip;
    }
}

class RealtimeIOWhiteListFilter extends RealtimeIOFilter{
    /**
     * 
     * @param {Array.<RealtimeIOWhiteListItem>} whitelist 
     */
    constructor(whitelist){
        super();
        this.whitelist = whitelist;
    }
    /**
     * 
     * @param {RealtimeIOSessionAccessor} session 
     */
    execute(session){
        var clientIPAddress = session.client.handshake.address;
        var isBlocked = this.whitelist.filter(p=>p.ip == clientIPAddress).length == 0;
        return new RealtimeIOFilter.RealtimeIOFilterStatus(
            !isBlocked,
            isBlocked ? "Blocked" : "OK"
        );
    }
}

module.exports = RealtimeIOWhiteListFilter;
module.exports.RealtimeIOWhiteListItem = RealtimeIOWhiteListItem;
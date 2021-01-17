const RealtimeIOServer = require("./RealtimeIOServer");
const RealtimeIOSessionAccessor = require("./RealtimeIOSessionAccessor");

class RealtimeIORoom{
    /**
     * 
     * @param {RealtimeIOServer} server 
     * @param {Number} roomNo 
     */
     constructor(server, roomNo){
         this.server = server;
         this.roomNo = roomNo;
         this.room = this.server.socket.sockets.in("room-"+this.roomNo);
     }
     on(event, listener){
         this.room.on(event, listener);
     }
     broadcast(data){
        return this.room.emit("message", data);
     }
     /**
      * 
      * @param {RealtimeIOSessionAccessor} session 
      * @param {*} data 
      */
     send(session, data){
        return this.server.send(session, data);
     }
};
const uuid = require('uuid').v4;
const RealtimeIOServer = require("./RealtimeIOServer");
const RealtimeIOSessionAccessor = require("./RealtimeIOSessionAccessor");

module.exports = class RealtimeIOServerObject {
  /**
   * @param {String} name
   * @param {RealtimeIOServer} server
   */
  constructor(name, server) {
    this.name = name;
    this.server = server;
    function generateActionInvoker(actionName, action) {
      var isWaitAction = actionName.toLowerCase().startsWith("wait_");
      var isBroadCastAction = actionName.toLowerCase().startsWith("broadcast_");
      var isListenerAction = actionName.toLowerCase().startsWith("listener_");
      var originalActionName = actionName;
      if(isWaitAction) originalActionName = actionName.substr(5);
      else if(isBroadCastAction) originalActionName = actionName.substr(10);
      else if(isListenerAction) originalActionName = actionName.substr(9);

      if (isBroadCastAction) {
        return async (...args) => {
            try{
                this.server.broadcast(null, {
                    type: this.name,
                    action: originalActionName,
                    mode: 'broadcast',
                    args: args
                });
                return true;
            }catch{
                return false;
            }
        };
      } 
      else if(isListenerAction){
        return action;
      }
      else if (isWaitAction) {
        return async (client, ...args) => {
          try {
              var messageId = uuid();
            this.server.send(client, {
              type: this.name,
              id: messageId,
              mode: 'wait',
              action: originalActionName,
              args: args,
            });
            var result = await this.getWaitedResponse(messageId);
            return result.args[0];
          } catch {
            return false;
          }
        };
      } else {
        return async (client, ...args) => {
          try {
            this.server.send(client, {
              type: this.name,
              action: originalActionName,
              mode: 'listener',
              args: args,
            });
            return true;
          } catch(x) {
            return false;
          }
        };
      }
    }

    var actions = Object.getOwnPropertyNames(this.__proto__).filter(
      (p) => p != "constructor"
    );
    for (var action of actions) {
      var _thisObject = this;
      this[action] = generateActionInvoker.call(this, action, this[action]);
      this[action] = this[action].bind(_thisObject);
    }
    
    server.registerServerObject(this);
  }
  async getWaitedResponse(messageId){
    var message = null;
    do{
      await new Promise(resolve=>setTimeout(resolve, 100));
    }while(Boolean(message = this.server.cache.get(messageId)) == false);
    return message;
  }
};

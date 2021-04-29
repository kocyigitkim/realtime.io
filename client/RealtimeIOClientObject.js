const uuid = require('uuid').v4;
const RealtimeIOClient = require("./RealtimeIOClient");

module.exports = class RealtimeIOClientObject {
  /**
   * @param {String} name
   * @param {RealtimeIOClient} client
   */
  constructor(name, client) {
    this.name = name;
    this.client = client;
    function generateActionInvoker(actionName, action) {
      var isWaitAction = actionName.toLowerCase().startsWith("wait_");
      var isListenerAction = actionName.toLowerCase().startsWith("listener_");
      var originalActionName = actionName;
      if(isWaitAction) originalActionName = actionName.substr(5);
      else if(isListenerAction) originalActionName = actionName.substr(9);

      if(isListenerAction){
        return action;
      }
      else {
        return async (...args) => {
          try {
            this.client.send({
              type: this.name,
              action: originalActionName,
              mode: 'listener',
              args: args,
            });
            return true;
          } catch {
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
    
    client.registerClientObject(this);
  }
};

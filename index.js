const { Plugin } = require('powercord/entities');
const { inject, uninject } = require("powercord/injector");
const { messages } = require('powercord/webpack');

module.exports = class Raw extends Plugin {
    toggled
    rawify(raw) {
      raw = raw.replaceAll("\\", "\\\\")
      raw = raw.replaceAll("*", "\\*")
      raw = raw.replaceAll("|", "\\|")
      raw = raw.replaceAll("_", "\\_")
      raw = raw.replaceAll(">", "\\>")
      raw = raw.replaceAll("~", "\\~")
      raw = raw.replaceAll("`", "\\`")
      raw = raw.replaceAll(":", "\\:")
      return raw
    }
    startPlugin() {
        this.toggled = false
        powercord.api.commands.registerCommand({
          command: "raw",
          description: "Sends the input, without markdown",
          usage: "{c} [...args]",
          executor: (args) => {
            if (args.length === 0) {
              return {
                send: false,
                result: "That string is empty!"
              }
            }
            let raw = this.rawify(args.join(" "))
              return {
                send: true,
                result: raw
              }
            }
        });

        powercord.api.commands.registerCommand({
          command: "toggleraw",
          description: "Toggles if the plugin should automatically make your messages raw.",
          usage: "{c}",
          executor: (args) => {
            this.toggled = !this.toggled
            return {
              send: false,
              result: this.toggled
                  ? "I will now be rawifying your messages automatically"
                  : "I will no longer be rawifying your messages automatically"
            }
          }
        })

    inject("toggleraw", messages, 'sendMessage', (args) => {
      if (!this.toggled) return args
      args[1].content = this.rawify(args[1].content)
      return args;
    }, true);
  }
    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("raw");
        powercord.api.commands.unregisterCommand("toggleraw")
        uninject("toggleraw")
    }
};

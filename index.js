const Interaction = require("./InteractionClass.js");
module.exports = class SlashCommandHandler {
  constructor(client) {
    if (!client) throw new Error("No client provided.");
    this.client = client;
  }
  async add(slash = {}) {
    if (!slash.name) throw new Error("Invalid name provided.");
    if (!slash.description) throw new Error("Invalid description provided.");
    await this.client.api.applications(this.client.user.id).commands.post({
      data: {
        name: slash.name.toLowerCase(),
        description: slash.description,
        options: slash.options
          ? slash.options.map((x) => {
              const returnObj = x.options;
              returnObj.name = returnObj.name.toLowerCase();
              return returnObj;
            })
          : undefined,
      },
    });
  }
  async bulkAdd(slashCmds) {
    if (!slashCmds) throw new Error("Invalid commands provided.");
    if (!Array.isArray(slashCmds))
      throw new Error("Slash commands are not an array.");
    await this.client.api.interactions(this.client.user.id).commands.put({
      data: slashCmds.map((x) => {
        return {
          name: x.name.toLowerCase(),
          description: x.description,
          options: x.options
            ? x.options.map((x) => {
                const returnObj = x;
                returnObj.name = returnObj.name.toLowerCase();
                return returnObj;
              })
            : undefined,
        };
      }),
    });
  }
  listen() {
    this.client.ws.on("INTERACTION_CREATE", (rawInt) => {
      const interaction = new Interaction(rawInt);
      if (!interaction.isCommand()) return;
      this.client.emit("slashCreate", interaction);
    });
  }
};

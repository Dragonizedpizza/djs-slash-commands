const Interaction = require("./InteractionClass.js");
module.exports = class SlashCommandHandler {
  constructor(client) {
    if (!client) throw new Error("No client provided.");
    this.client = client;
  }
  async add(slash = {}, guildId) {
    try {
      if (!slash.name) throw new Error("Invalid name provided.");
      if (!slash.description) throw new Error("Invalid description provided.");
      const data = {
        name: slash.name.toLowerCase(),
        description: slash.description,
        options: slash.options
          ? slash.options.map((x) => {
              const returnObj = x.options;
              returnObj.name = returnObj.name.toLowerCase();
              return returnObj;
            })
          : undefined,
      };
      async function postCommand() {
        if (!guildId)
          await this.client.api
            .applications(this.client.user.id)
            .commands.post({
              data: data,
            });
        else {
          this.client.api
            .applications(this.client.user.id)
            .guilds(guildId)
            .commands.post({
              data: data,
            });
        }
      }
      if (!this.client.user)
        this.client.on("ready", async () => {
          await postCommand();
        });
      else await postCommand();
    } catch (err) {
      throw err;
    }
  }
  async bulkAdd(slashCmds, guildId) {
    try {
      if (!slashCmds) throw new Error("Invalid commands provided.");
      if (!Array.isArray(slashCmds))
        throw new Error("Slash commands are not an array.");
      const cmdsBulk = slashCmds.map((x) => {
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
      });
      async function postCommands() {
        if (!guildId)
          await this.client.api
            .applications(this.client.user.id)
            .commands.put({ data: cmdsBulk });
        else
          await this.client.api
            .applications(this.client.user.id)
            .guilds(guildId)
            .commands.put({ data: cmdsBulk });
      }
      if (!this.client.user)
        this.client.on("ready", async () => {
          await postCommands();
        });
      else await postCommands();
    } catch (err) {
      throw err;
    }
  }
  listen() {
    this.client.ws.on("INTERACTION_CREATE", (rawInt) => {
      try {
        const interaction = new Interaction(rawInt, this.client);
        if (!interaction.isCommand()) return;
        this.client.emit("slashCreate", interaction);
      } catch (err) {
        throw err;
      }
    });
  }
};

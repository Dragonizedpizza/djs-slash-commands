const Interaction = require("./CommandInteraction.js");
const {
  InteractionCommandOptionTypesString,
  InteractionCommandOptionTypesInteger,
} = require("./Constants.js");

module.exports = class SlashCommandHandler {
  constructor(client) {
    if (!client) throw new Error("No client provided.");
    this.client = client;
  }
  async add(slash = {}, GuildID) {
    try {
      if (!slash.name) throw new Error("Invalid name provided.");
      if (!slash.description) throw new Error("Invalid description provided.");

      const data = {
        name: slash.name.toLowerCase(),
        description: slash.description,
        options: slash.options
          ? slash.options.map((x) => {
              const returnObj = x;
              returnObj.type =
                InteractionCommandOptionTypesString[x.type] ||
                InteractionCommandOptionTypesString[
                  InteractionCommandOptionTypesInteger[x.type]
                ];
              returnObj.name = returnObj.name.toLowerCase();
              return returnObj;
            })
          : undefined,
      };

      async function postCommand(client, guildId) {
        if (!guildId)
          await client.api.applications(client.user.id).commands.post({
            data: data,
          });
        else
          client.api
            .applications(client.user.id)
            .guilds(guildId)
            .commands.post({
              data: data,
            });
      }

      if (!this.client.user)
        this.client.on("ready", async () => {
          await postCommand(this.client, GuildID);
        });
      else await postCommand(this.client, GuildID);
    } catch (err) {
      throw err;
    }
  }
  async bulkAdd(slashCmds, GuildID) {
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

      async function postCommands(client, guildId) {
        if (!guildId)
          await client.api
            .applications(client.user.id)
            .commands.put({ data: cmdsBulk });
        else
          await client.api
            .applications(client.user.id)
            .guilds(guildId)
            .commands.put({ data: cmdsBulk });
      }

      if (!this.client.user)
        this.client.on("ready", async () => {
          await postCommands(this.client, GuildID);
        });
      else await postCommands(this.client, GuildID);
    } catch (err) {
      throw err;
    }
  }
  listen() {
    this.client.ws.on("INTERACTION_CREATE", (rawInt) => {
      try {
        const interaction = new Interaction(rawInt, this.client);
        if (!interaction || !interaction.isCommand) return;
        this.client.emit("slashCreate", interaction);
      } catch (err) {
        throw err;
      }
    });
  }
};

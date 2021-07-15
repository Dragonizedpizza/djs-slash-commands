const Interaction = require("./CommandInteraction.js"),
  {
    InteractionCommandOptionTypesString,
    InteractionCommandOptionTypesInteger,
  } = require("../utils/Constants.js"),
  ConvertOptions = require("../utils/ConvertOptions.js").userToAPI,
  ApplicationCommand = require("./ApplicationCommand.js"),
  Discord = require("discord.js"),
  resolveCommand = require("../utils/resolveCommand.js");
/**
 *
 * @param {Discord.Client} client
 * @param {String} ID
 * @param {String} guildId
 * @returns {Object}
 */

module.exports = class SlashCommandHandler {
  constructor(client) {
    if (!client) throw new Error("No client provided.");
    this.client = client;
  }

  /**
   * Fetch an application command from the API.
   * @param {String} ID
   * @param {String} guildId
   * @returns {ApplicationCommand}
   */

  async get(ID, guildId) {
    try {
      const dat = await resolveCommand(this.client, ID, guildId, "get");
      const cmd =
        dat && dat.length
          ? dat.map((x) => new ApplicationCommand(x, this.client, this))
          : new ApplicationCommand(dat, this.client, this);
      return cmd;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete a command.
   * @param {String} ID
   * @param {String} guildId
   * @returns
   */

  async delete(ID, guildId) {
    try {
      if (!ID && guildId) ID = undefined;
      await resolveCommand(this.client, ID, guildId, "delete");
      return [ID, guildId];
    } catch (err) {
      throw err;
    }
  }

  /**
   * Add a slash command.
   * @param {Object} slash
   * @param {String} GuildID
   */

  async add(slash = {}, GuildID) {
    try {
      if (!slash.name) throw new Error("Invalid name provided.");
      if (!slash.description) throw new Error("Invalid description provided.");

      const data = {
        name: slash.name.toLowerCase(),
        description: slash.description,
        options: ConvertOptions(slash.options),
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

  /**
   * Bulk add slash commands.
   * @param {Array} slashCmds
   * @param {String} GuildID
   */

  async bulkAdd(slashCmds, GuildID) {
    try {
      if (!slashCmds) throw new Error("Invalid commands provided.");
      if (!Array.isArray(slashCmds))
        throw new Error("Slash commands are not an array.");

      const cmdsBulk = slashCmds.map((x) => {
        return {
          name: x.name.toLowerCase(),
          description: x.description,
          options: ConvertOptions(x.options),
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

  /**
   * Start listening to the interaction.
   */

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

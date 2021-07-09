const { APIToUser } = require("../utils/ConvertOptions.js"),
  Timestamp = require("./Timestamp.js"),
  Discord = require("discord.js"),
  resolveCommand = require("../utils/resolveCommand.js");

/**
 * Application command.
 * @type {Object}
 */

module.exports = class ApplicationCommand {
  /**
   * Convert to proper application command.
   * @param {Object} options Raw Discord API command.
   * @param {Discord.Client} client Client that instantiated this command.
   */

  constructor(options, client) {
    /**
     * Command name.
     * @type {String}
     */

    this.name = options.name;

    /**
     * Command ID.
     * @type {String}
     */

    this.id = options.id;

    /**
     * Client that initiated the command.
     * @type {Discord.Client}
     */

    this.client = client;

    /**
     * Command application ID.
     * @type {Number}
     */

    this.applicationID = options.application_id;

    /**
     * Command description.
     * @type {String}
     */

    this.description = options.description;

    /**
     * Command options.
     * @type {Array}
     */

    this.options = APIToUser(options.options);

    /**
     * Command version.
     * @type {String}
     */

    this.version = options.version;

    /**
     * Command Guild ID. null if global command.
     * @type {String}
     */

    this.guildID = options.guild_id || null;

    /**
     * Command Guild. null if global command.
     * @type {Discord.Guild}
     */

    this.guild = this.client.guilds.cache.get(this.guildID) || null;

    Object.defineProperty(this, "createdTime", {
      enumerable: false,
      writable: true,
    });

    /**
     * Interaction created time object. (Custom class)
     * @type {Timestamp}
     */
    this.createdTime = new Timestamp(this.id);

    /**
     * Command creation timestamp.
     * @type {Date}
     */

    this.createdTimestamp = this.createdTime.toDate();

    /**
     * Command creation timestamp, relative to Discord's epoch.
     * @type {Number}
     */

    this.createdTimestampEpoch = this.createdTime.toDiscordTimestamp();

    /**
     * Whether the command will be added when the client is added to a new guild.
     * @type {Boolean}
     */

    this.defaultPermissions = options.default_permission;

    /**
     * Command type.
     * @type {Number}
     */

    this.type = options.type;
  }
  async delete() {
    await resolveCommand(client, this.id, this.guildID, "delete");
    return [this.id, this.guildID];
  }
};

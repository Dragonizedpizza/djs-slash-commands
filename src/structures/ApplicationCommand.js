const { APIToUser } = require("../utils/ConvertOptions.js"),
Timestamp = require("./Timestamp.js");
Discord = require("discord.js");

module.exports = class ApplicationCommand {
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

    this.applicationID = options.applicationID;
    
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

    if (options.guild_id) {
      
      /**
       * Command Guild ID.
       * @type {String}
       */

      this.guildID = options.guild_id;

    }

    Object.defineProperty(this, "createdTime", {
      enumerable: false,
      writable: true
    })

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

    this.defaultPermissions = options.default_permissions;

    /**
     * Command type.
     * @type {Number}
     */

    this.type = options.type;
  }
};

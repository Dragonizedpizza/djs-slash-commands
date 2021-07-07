const Discord = require("discord.js");
const {
  InteractionTypes,
  InteractionCommandOptionTypesInteger,
} = require("../utils/Constants.js");
const Timestamp = require("./Timestamp.js");
const InteractionTimestamp = require("./Timestamp.js");
module.exports = class SlashCommandInteraction {
  constructor(options, client) {
    try {
      /**
       * Client that initiated the interaction.
       * @type {Discord.Client}
       */

      this.client = client;

      /**
       * Interaction type.
       * @type {String}
       */

      this.type = InteractionTypes[options.type];

      /**
       * Whether the interaction is a command.
       * @type {Boolean}
       */

      this.isCommand = this.type === "APPLICATION_COMMAND" ? true : false;

      /**
       * Channel the interaction occured in.
       * @type {Discord.TextChannel}
       */

      this.channel = this.client.channels.resolve(options.channel_id);

      /**
       * Channel interaction occured in's ID.
       * @type {String}
       */

      this.channelID = options.channel_id;

      /**
       * Guild the interaction occured in.
       * @type {Discord.Guild}
       */

      this.guild = this.client.guilds.cache.get(options.guild_id);

      /**
       * Guild the interaction occured in's ID.
       * @type {String}
       */

      this.guildID = options.guild_id;

      /**
       * Guild member who used the interaction. null if in DMs.
       * @type {Discord.GuildMember}
       */

      this.member = new Discord.GuildMember(
        this.client,
        options.member,
        this.guild
      );

      if (!this.member.guild && this.member.joinedTimestamp) this.member = null;

      /**
       * Member who used the interaction's ID. null if in DMs.
       * @type {String}
       */

      this.memberID = this.member ? this.member.user.id : null;

      /**
       * Interaction command name.
       * @type {String}
       */

      this.commandName = options.data.name;

      /**
       * Interaction command ID.
       * @type {String}
       */

      this.commandID = options.data.id;

      /**
       * User who used interaction.
       * @type {Discord.User}
       */

      this.author =
        this.member.user || this.client.users.cache.get(this.authorID) || null;

      /**
       * User who used the interaction's ID.
       * @type {String}
       */

      this.authorID = options.member.user.id;

      /**
       * Arguments provided for interaction.
       * @type {Discord.Collection}
       */

      this.args = new Discord.Collection();

      for (const arg of options.data.options) {
        const argToSet = arg;
        arg.type = InteractionCommandOptionTypesInteger[arg.type];
        const { resolved } = options.data;
        if (resolved) {
          const { users, members, channels, roles } = resolved;

          if (users && users[arg.value]) {
            argToSet.user = new Discord.User(this.client, users[arg.value]);
            argToSet.member = new Discord.GuildMember(
              this.client,
              members[arg.value],
              this.guild
            );
          }

          if (channels && channels[arg.value])
            argToSet.channel = client.channels.resolve(channels[arg.value].id);
          if (roles && roles[arg.value]) {
            const optionsRole = roles[arg.value];
            optionsRole.permissions = +optionsRole.permissions;
            argToSet.role = new Discord.Role(
              this.client,
              optionsRole,
              this.guild
            );
          }
        }
        this.args.set(argToSet.name, argToSet);
      }

      /**
       * Interaction ID.
       * @type {String}
       */

      this.id = options.data.id;

      Object.defineProperty(this, "createdTime", {
        enumerable: false,
        writable: true,
      });

      /**
       * When the interaction was created's timestamp.
       * @type {Timestamp}
       */

      this.createdTime = new Timestamp(this.id);

      /**
       * Interaction timestamp relative to Discord's Epoch.
       * @type {Number}
       */

      this.createdTimestampEpoch = this.createdTime.toDiscordTimestamp();

      /**
       * When the interaction was created's date.
       * @type {Date}
       */

      this.createdTimestamp = this.createdTimeFull.toDate();

      /**
       * Interaction token.
       * @type {String}
       */

      this.token = options.token;

      /**
       * Interaction application ID.
       * @type {String}
       */

      this.applicationID = options.applicationID;

      /**
       * Webhook client for sending followup messages.
       * @type {Disord.WebhookClient}
       */

      this.webhook = new Discord.WebhookClient(this.id, this.token);

      /**
       * Whether the interaction has been replied to.
       * @type {Boolean}
       */

      this.replied = false;

      /**
       * Whether the interaction has been deferred to.
       * @type {Boolean}
       */

      this.deferred = false;

      /**
       * Whether the interaction has been replied to with an ephemeral.
       * @type {Boolean}
       */

      this.ephemeral = false;

      Object.defineProperty(this, "raw", {
        enumerable: false,
        writable: true,
      });

      /**
       * Raw interaction options.
       * @type {Object}
       */

      this.raw = options;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Reply to the interaction.
   * @param {Discord.MessageEmbed | String} content
   * @param {Object} options
   */

  async reply(content, options) {
    if (this.deferred || this.replied)
      throw new Error("Interaction already replied.");

    const apiMessage =
      content instanceof Discord.APIMessage
        ? content
        : Discord.APIMessage.create(this, content, options);

    const { data, files } = await apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 4,
        data,
      },
      files,
    });
    
    this.epehemeral = options["ephemeral"] ? true : false;

    this.replied = true;
  }

  /**
   * Defer to the interaction. "ApplicationName is thinking..."
   * @param {Object} ephemeral
   */

  async defer({ ephemeral } = {}) {
    if (this.deferred || this.replied)
      throw new Error("Interaction already replied.");
    
    this.ephemeral = ephemeral ? true : false;
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 5,
        data: {
          flags: ephemeral ? 1 << 6 : undefined,
        },
      },
    });
    this.deferred = true;
  }
  
  /**
   * Fetch interaction reply.
   * @returns {Object}
   */
  
  async fetchReply() {
    const raw = await this.webhook.fetchMessage('@original');
    return this.channel ? this.channel.messages.add(raw) : raw;
  }

  /**
   * Delete interaction reply.
   */

  async deleteReply() {
    await this.webhook.deleteMessage('@original');
  }

  /**
   * Send a followup message.
   * @param {Discord.MessageEmbed | String} content 
   * @param {Object} options 
   * @returns {Discord.Message}
   */

  async followUp(content, options) {
    const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
    const { data, files } = await apiMessage.resolveData().resolveFiles();

    this.ephemeral = options.ephemeral ? true : false;
    const raw = await this.client.api.webhooks(this.applicationID, this.token).post({
      data,
      files,
    });

    return this.channel ? this.channel.messages.add(raw) : raw;
  }
};

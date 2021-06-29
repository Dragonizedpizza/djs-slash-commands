const Discord = require("discord.js");
module.exports = class SlashCommandInteraction {
  constructor(options, client) {
    try {
      this.client = client;
      this.isCommand = options.type == 2 ? true : false;
      this.channel = this.client.channels.resolve(options.channel_id);
      this.channelID = options.channel_id;
      this.guild = this.client.guilds.cache.get(options.guild_id);
      this.guildID = options.guild_id;
      this.member = new Discord.GuildMember(
        this.client,
        options.member,
        this.guild
      );
      if (!this.member.guild && this.member.joinedTimestamp) this.member = null;
      this.commandName = options.data.name;
      this.authorID = options.member.user.id;
      this.author =
        this.member.user || this.client.users.cache.get(this.authorID) || null;
      this.args = options.data.options;
      this.id = options.id;
      this.token = options.token;
      this.applicationID = options.applicationID;
      this.webhook = new Discord.WebhookClient(this.id, this.token);
      this.replied = false;
      this.deferred = false;
    } catch (err) {
      throw err;
    }
  }
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
    this.replied = true;
  }

  async defer({ ephemeral } = {}) {
    if (this.deferred || this.replied)
      throw new Error("Interaction already replied.");
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
};

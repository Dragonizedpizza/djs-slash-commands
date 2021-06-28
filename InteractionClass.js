module.exports = class Interaction {
  constructor(options, client) {
    this.client = client;
    this.type = options.type == 2 ? "APPLICATION_COMMAND" : null;
    this.channel = this.client.channels.resolve(options.channel_id);
    this.channelID = options.channel_id;
    this.guild = this.client.guilds.cache.get(options.guild_id);
    this.guildID = options.guild_id;
    this.member = new Discord.GuildMember(
      this.client,
      options.member,
      this.guild
    );
    this.commandName = options.data.name;
    this.authorID = options.member.user.id;
    this.author = this.member.user;
    this.args = options.data.options;
    this.id = options.id;
    this.token = options.token;
    this.applicationID = options.applicationID;
    this.replied = false;
    this.deferred = false;
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
        type: "CHANNEL_MESSAGE_WITH_SOURCE",
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
        type: "DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE",
        data: {
          flags: ephemeral ? 1 << 6 : undefined,
        },
      },
    });
    this.deferred = true;
  }
  isCommand() {
    return !this.type;
  }
};

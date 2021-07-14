const {
    InteractionCommandOptionTypesInteger,
    InteractionCommandOptionTypesString,
  } = require("./Constants.js"),
  { GuildMember, User, Collection, Role, Client, Guild } = require("discord.js");

/**
 * Convert a user's options to API options.
 * @param {Array} options Options provided from the user.
 * @returns {Array}
 */

module.exports.userToAPI = (options) => {
  options
    ? options.map((x) => {
        const returnObj = x;
        returnObj.type =
          InteractionCommandOptionTypesString[x.type] ||
          InteractionCommandOptionTypesString[
            InteractionCommandOptionTypesInteger[x.type]
          ];
        returnObj.name = returnObj.name.toLowerCase();
        return returnObj;
      })
    : undefined;
  return options;
};

/**
 * Convert API to user options.
 * @param {Array} options Raw Discord API options.
 * @returns
 */

module.exports.APIToUser = (options) => {
  let opt;
  if (options) {
    opt = options.map((x) => ({
      name: x.name,
      description: x.description,
      type: InteractionCommandOptionTypesInteger[x.type],
      required: x.required,
      choices: x.choices || null,
    }));
    return opt;
  }
};

/**
 * Convert CommandInteraction options to usable options.
 * @param {object} options Raw Discord API options. 
 * @param {Client} client Client that instantiated the CommandInteraction. 
 * @param {Guild} guild Interaction guild.
 * @returns {Collection<String, object>}
 */

module.exports.CommandInteractionOptions = (options, client, guild) => {
  let returnCollection;
  if (options.data.options) {
    returnCollection = new Collection();
    for (const arg of options.data.options) {
      const argToSet = arg;
      arg.type = InteractionCommandOptionTypesInteger[arg.type];
      const { resolved } = options.data;
      if (resolved) {
        const { users, members, channels, roles } = resolved;

        if (users && users[arg.value]) {
          argToSet.user = new User(client, users[arg.value]);
          argToSet.member = new GuildMember(client, members[arg.value], guild);
        }

        if (channels && channels[arg.value])
          argToSet.channel = client.channels.resolve(channels[arg.value].id);
        if (roles && roles[arg.value]) {
          const optionsRole = roles[arg.value];
          optionsRole.permissions = +optionsRole.permissions;
          argToSet.role = new Role(this.client, optionsRole, this.guild);
        }
      }
      returnCollection.set(argToSet.name, argToSet);
    }
  };
  return returnCollection;
};

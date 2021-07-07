/**
 * Interaction types.
 * @type {Object}
 */

module.exports.InteractionTypes = {
  1: "PING",
  2: "APPLICATION_COMMAND",
  3: "MESSAGE_COMPONENT",
};

/**
 * Interaction command option types. String => Number.
 * @type {Object}
 */

module.exports.InteractionCommandOptionTypesString = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
};

/**
 * Interaction command option types Number => String.
 * @type {Object}
 */

module.exports.InteractionCommandOptionTypesInteger = {
  1: "SUB_COMMAND",
  2: "SUB_COMMAND_GROUP",
  3: "STRING",
  4: "INTEGER",
  5: "BOOLEAN",
  6: "USER",
  7: "CHANNEL",
  8: "ROLE",
  9: "MENTIONABLE",
};

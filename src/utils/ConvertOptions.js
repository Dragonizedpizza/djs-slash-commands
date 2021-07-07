const {
  InteractionCommandOptionTypesInteger,
  InteractionCommandOptionTypesString,
} = require("./Constants.js");

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

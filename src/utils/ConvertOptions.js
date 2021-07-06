const {
  InteractionCommandOptionTypesInteger,
  InteractionCommandOptionTypesString,
} = require("./Constants.js");

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
};

module.exports.APIToUser = (options) => {
    let opt;
    if (options) {
        opt = options.map((x) => ({
        name: x.name,
        description: x.description,
        type: InteractionCommandOptionTypesInteger[x.type],
        required: x.required,
        choices: x.choices || null,
    }))
}}
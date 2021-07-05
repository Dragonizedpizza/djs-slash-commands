const { SlashCommandHandler } = require("../index.js");

let client = require("discord.js").Client;
client = new client();
client.slash = new SlashCommandHandler(client);

client.slash.add(
  {
    name: "try",
    description: "to beat me",
    options: [
        {
            name: "oLoL",
            type: "ROLE",
            description: "yerr"
        },
        {
        name: "user",
        type: "USER",
        description: "with this user",
      },
      {
          name: "xdLoL",
          type: "CHANNEL",
          description: "uff ik ik"
      },
    ],
  },
  "803204453321670697"
);
client.on("ready", () => console.log("readyy"))
client.slash.listen();
client.on("slashCreate", (i) => console.log(i.args))
client.login("ODI1NTc0NDEyMTc4NDIzODU5.YF_6Fg.XqsxwKWzWCpQixbbAcHdrwObjjU");

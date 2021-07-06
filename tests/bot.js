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
        description: "yerr",
      },
      {
        name: "user",
        type: "USER",
        description: "with this user",
      },
      {
        name: "xdLoL",
        type: "CHANNEL",
        description: "uff ik ik",
      },
    ],
  },
  "803204453321670697"
);
client.on("ready", async () => {
  console.log("readyy");
  const dat = await client.api
    .applications(client.user.id)
    .guilds("803204453321670697")
    .commands.get();
  console.log(require("util").inspect(dat, { depth: 4, showHidden: true }));
});
client.slash.listen();
client.on("slashCreate", (i) => {
  console.log(i.createdTimestamp);
  console.log("bruh");
});

client.login("");

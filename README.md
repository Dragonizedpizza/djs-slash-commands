## Discord.js Slash Commands!

> A wrapper meant to incorporate discord.js slash commands into your Discord bot.

### Installation

```bash
$ npm i djs-slash-commands --save
```

### Usage

##### Required:

Importing and initializing the handler:

```js
const SlashCommands = require("djs-slash-commands");
client.SlashCommands = new SlashCommands(client);
```

**More important information at the bottom.**

### Global Commands:

##### Option Types:

| Name              | Value |
| ----------------- | ----- |
| SUB_COMMAND       | 1     |
| SUB_COMMAND_GROUP | 2     |
| STRING            | 3     |
| INTEGER           | 4     |
| BOOLEAN           | 5     |
| USER              | 6     |
| CHANNEL           | 7     |
| ROLE              | 8     |
| MENTIONABLE       | 9     |

Adding a global slash command:

```js
client.SlashCommands.add({
  name: "ping", // Name will always be lowercase
  description: "Check the bot ping.",
});

// Or for options,

client.SlashCommands.add({
  name: "ping",
  description: "Check the bot ping.",
  options: [
    {
      name: "some option", // Name will always be lowercase
      description: "Some description.",
      type: 3,
      required: false, // Optional
    },
  ],
});
```

Bulk adding global slash commands:

**Warning: This removes all other slash commands your bot has.**.

```js
client.SlashCommands.bulkAdd([
  {
    name: "ping",
    description: "Check the bot ping.",
  },
  {
    name: "randomcommand",
    description: "Random description.",
  },
]);

// Bulk add commands with options:

client.SlashCommands.bulkAdd([
  {
    name: "ping",
    description: "Check the bot ping.",
  },
  {
    name: "randomcommand",
    description: "Random description.",
    options: [
      {
        name: "some option", // Name will always be lowercase
        description: "Some description.",
        type: 3,
        required: false, // Optional
      },
    ],
  },
]);
```

### Guild-Specific Commands:

```js
client.SlashCommands.add(
  {
    name: "ping",
    description: "Check the bot's ping.",
  },
  "803204453321670697"
);

// With options:

client.SlashCommands.add({
  name: "ping",
  description: "Check the bot ping.",
  options: [
    {
      name: "some option", // Name will always be lowercase
      description: "Some description.",
      type: 3,
      required: false, // Optional
    },
  ],
});
```

Bulk add guild-specific slash commands:

**Warning: This removes all other slash commands.**.

```js
client.SlashCommands.bulkAdd(
  [
    {
      name: "ping",
      description: "Check the bot's ping.",
    },
    {
      name: "somcommand",
      description: "Some description.",
    },
  ],
  "803204453321670697"
);

// With options:

client.SlashCommands.bulkAdd([
  {
    name: "ping",
    description: "Check the bot ping.",
  },
  {
    name: "somecommand",
    description: "Some description.",
    options: [
      {
        name: "some option", // Name will always be lowercase
        description: "Some description.",
        type: 3,
        required: false, // Optional
      },
    ],
  },
]);
```

### Receiving the interaction:

```js
client.SlashCommands.listen();

client.on("slashCreate", (interaction) => {
  if (interaction.commandName === "somecommand")
    return interaction.reply("Some reply...");
  if (interaction.commandName === "someothercommand")
    return interaction.reply("This is an ephemeral.", { ephemeral: true });

  // Sending a followup message:
  if (interaction.commandName === "ping") {
    interaction.reply("Ping?!");
    interaction.webhook.send("Pong!");
  }
});
```

### Interaction Properties:

| Name          | Value                 | Purpose                                                |
| ------------- | --------------------- | ------------------------------------------------------ |
| client        | Discord.Client        | Client provided when initializing handler.             |
| type          | Boolean               | Whether the interaction is a command.                  |
| channel       | Discord.Channel       | Channel interaction occured in.                        |
| channelID     | String                | Channel interaction occured in's ID.                   |
| guild         | Discord.Guild         | Guild the interaction occured in.                      |
| guildID       | String                | Guild the interaction occured in's ID.                 |
| member        | Discord.GuildMember   | Guild member who used the interaction. null if in DMs. |
| commandName   | String                | Interaction command name.                              |
| author        | Discord.User          | User who used interaction.                             |
| args          | Array                 | Arguments provided for interaction.                    |
| id            | String                | Interaction ID.                                        |
| token         | String                | Interaction token.                                     |
| applicationID | String                | Interaction application ID.                            |
| webhook       | Discord.WebhookClient | Webhook client for sending followup messages.          |
| replied       | Boolean               | Whether the interaction has been replied to.           |
| deferred      | Boolean               | Whether the interaction has been deferred to.          |

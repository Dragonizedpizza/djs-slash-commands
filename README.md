## Discord.js Slash Commands!

> A wrapper meant to incorporate discord.js slash commands into your Discord bot.

### Installation

```bash
$ npm i --save djs-slash-commands
```

### Usage

##### Required:

Importing and initializing the handler:

```js
const { SlashCommandHandler } = require("djs-slash-commands");
client.SlashCommands = new SlashCommandHandler(client);
```

### Receiving the interaction:
**Note: You must reply in 3 seconds. To get past this limit, defer the interaction, or use followUps.**
```js
client.on("slashCreate", async (interaction) => {
  if (interaction.commandName === "somecommand")
    return interaction.reply("Some reply...");
  if (interaction.commandName === "someothercommand")
    return interaction.reply("This is an ephemeral.", { ephemeral: true });

  // Sending a followup message:
  if (interaction.commandName === "ping") {
    interaction.reply("Ping?!");
    interaction.followUp("Pong!");
  }

  // Editing & deleting reply.
  if (interaction.commandName === "thatonecommand") {
    await interaction.reply("REPLIED?!");
    await interaction.editReply("EDITED?!");
    // DELETED?!
    interaction.deleteReply();
  }

  // Deferring an interaction. Makes it say "{Name} is thinking..." and gives you 15 minutes to reply.
  if (interaction.commandName === "defer") {
    interaction.defer();
    setTimeout(
      async () => await interaction.reply("I have stopped thinking."),
      9000
    );
  }
});
```

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

##### Base Object:

```js
const baseObject = {
  name: "ping",
  description: "Pong?!",
};

// Or, with options:

const baseObject = {
  name: "ping",
  description: "pong?!",
  options: [
    {
      name: "someoption",
      description: "some description",
      type: "USER",
    },
  ],
};

client.slashCommands.add(baseObject);
```

Bulk adding global slash commands:

**Warning: This removes all other slash commands your bot has.**

```js
const baseObject2 = {
  name: "othercommand",
  description: "ANOTHER COMMAND?!",
};
client.SlashCommands.bulkAdd([baseObject, baseObject2]);
```

### Guild-Specific Commands:

```js
client.SlashCommands.add(baseObject, "GuildID");
```

Bulk add guild-specific slash commands:

**Warning: This removes all other slash commands.**.

```js
client.SlashCommands.bulkAdd(
  [baseObject, baseObject2]
  "GuildID"
);
```

### Viewing/Deleting the Command:

```js
client.on("ready", async () => {
  /**
   * Viewing the command(s).
   */

  const cmds = await client.SlashCommands.get();
  console.log(cmds); // Logs all slash commands.

  // Guild Commands:
  const guildCmds = await client.SlashCommands.get(null, "GuildID");
  console.log(guildCmds); // Logs all guild commands.

  // For the following methods, you must get the ID. You can do so by using the methods above, as they all return a command object with the property ID.

  // For specific commands:
  const cmd = await client.SlashCommands.get("ID");
  console.log(cmd);

  // For guild-specific commands:
  const guildCmd = await client.SlashCommands.get("ID", "GuildID");
  console.log(guildCmd);

  /**
   * Deleting the command(s).
   * For the following methods, you must get the ID. You can do so by using the methods above, as they all return a command object with the property ID.

   */

  // Global command:
  await client.SlashCommands.delete("ID");

  // Guild-Specific command:
  await client.SlashCommands.delete("ID", "GuildID");
});
```

### Interaction Properties:

| Name                  | Value                                     | Purpose                                                        |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| client                | Discord.Client                            | Client that initiated the interaction.                         |
| type                  | Boolean                                   | Interaction type.                                              |
| isCommand             | Boolean                                   | Whether interaction is a command.                              |
| channel               | Discord.TextChannel                       | Channel interaction occured in.                                |
| channelID             | String                                    | Channel interaction occured in's ID.                           |
| guild                 | Discord.Guild                             | Guild the interaction occured in.                              |
| guildID               | String                                    | Guild the interaction occured in's ID.                         |
| member                | Discord.GuildMember                       | Guild member who used the interaction. null if in DMs.         |
| memberID              | String                                    | Guild member who used the interaction's ID. null if in DMs.    |
| commandName           | String                                    | Interaction command name.                                      |
| commandID             | String                                    | Interaction command ID.                                        |
| author                | Discord.User                              | User who used interaction.                                     |
| authorID              | String                                    | User who used the interaction's ID.                            |
| options               | Discord.Collection                        | Arguments provided for interaction.                            |
| id                    | String                                    | Interaction ID.                                                |
| createdDate           | DjsSlashCommands.Timestamp (custom class) | When the interaction was created's date.                       |
| createdTimestampEpoch | Number                                    | When the interaction was created, relative to Discord's Epoch. |
| createdTimestamp      | Date                                      | When the interaction was created's timestamp.                  |
| token                 | String                                    | Interaction token.                                             |
| applicationID         | String                                    | Interaction application ID.                                    |
| webhook               | Discord.WebhookClient                     | Webhook client for sending followup messages.                  |
| replied               | Boolean                                   | Whether the interaction has been replied to.                   |
| deferred              | Boolean                                   | Whether the interaction has been deferred to.                  |
| raw                   | Object                                    | Raw interaction object returned from the API.                  |

### Application Command Properties

| Name                  | Value                                | Purpose                                                                    |
| --------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| name                  | String                               | Command name.                                                              |
| id                    | String                               | Command ID.                                                                |
| client                | String                               | Client that initiated the command.                                         |
| applicationID         | String                               | Command application ID.                                                    |
| description           | String                               | Command description.                                                       |
| options               | Array                                | Command options.                                                           |
| version               | String                               | Command version.                                                           |
| guildID               | String                               | Command Guild ID. null if global command.                                  |
| guild                 | Discord.Guild                        | Command Guild. null if global command.                                     |
| createdTime           | DjsSlashCommands.Timestamp           | Interaction created time object. (Custom class)                            |
| createdTimestamp      | Date                                 | Command creation timestamp.                                                |
| createdTimestampEpoch | Number                               | Command creation timestamp, relative to Discord's epoch.                   |
| defaultPermissions    | Boolean                              | Whether the command will be added when the client is added to a new guild. |
| type                  | Number                               | Command type.                                                              |
| SlashCommandHandler   | DjsSlashCommands.SlashCommandHandler | Slash command handler that initiated this command.                         |

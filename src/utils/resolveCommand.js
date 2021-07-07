module.exports = async function resolveCommand(client, ID, guildId, method) {
  try {
    let data;
    if (client.readyAt)
      if (guildId)
        data = await client.api
          .applications(client.user.id)
          .guilds(guildId)
          .commands(ID)
          [method]();
      else
        data = await client.api
          .applications(client.user.id)
          .commands(ID)
          [method]();
    else
      throw new Error(
        "Client is not ready. Try calling the function in a ready event."
      );
    return data;
  } catch (err) {
    throw err;
  }
};

const { SnowflakeUtil } = require("discord.js");
let timestamp;

/**
 * Timestamp handler, convertable to Discord's epoch.
 * @type {Number}
 */

module.exports = class Timestamp extends Number {
  constructor(date) {
    timestamp = date;

    if (!timestamp) throw new Error("No date provided.");

    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    else if (+timestamp) timestamp = +timestamp;
    else if (!this.timestamp instanceof Date && !+timetamp)
      throw new Error("Invalid date provided.");

    timestamp = SnowflakeUtil.deconstruct(timestamp.toString()).timestamp;
    super(timestamp);
    this.timestamp = timestamp;
  }

  /**
   * Convert timestamp to Discord's timestamp.
   * @returns {Number}
   */

  toDiscordTimestamp() {
    let timestamp = new Date(this.timestamp).getTime() / 1000;
    timestamp = parseInt(timestamp.toString().split(".")[0]);
    return timestamp;
  }

  /**
   * Convert timestamp to date.
   * @returns {Date}
   */

  toDate() {
    return new Date(this.timestamp);
  }
};

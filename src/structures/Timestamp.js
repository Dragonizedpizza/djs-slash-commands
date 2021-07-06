const { SnowflakeUtil } = require("discord.js");

/**
 * Timestamp handler, convertable to Discord's epoch.
 * @type {Number}
 */

module.exports = class Timestamp {
  constructor(date) {
    this.timestamp = date;

    if (!this.timestamp) throw new Error("No date provided.");

    if (this.timestamp instanceof Date)
      this.timestamp = this.timestamp.getTime();
    else if (+this.timestamp) this.timestamp = +this.timestamp;
    else if (!this.timestamp instanceof Date && !+this.timetamp)
      throw new Error("Invalid date provided.");

    this.timestamp = SnowflakeUtil.deconstruct(this.timestamp).timestamp;

    return this.timestamp;
  }
  /**
   * Convert timestamp to Discord's timestamp.
   * @returns {String}
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

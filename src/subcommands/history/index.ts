import fs from "fs";
import fetch from "node-fetch";
import CLI from "../../Cli";
import { KmdrAuthError } from "../../errors";
import Print from "../../Print";

export default class HIstory extends CLI {
  constructor() {
    super();
  }

  public async init() {
    Print.text(`Go to ${this.KMDR_WEBAPP_URI}/history to view your command history`);
  }
}

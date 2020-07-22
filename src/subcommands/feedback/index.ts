import CLI from "../../Cli";

export default class Feedback extends CLI {
  constructor() {
    super();
  }

  public async init() {
    console.log("Feedback");
  }
}

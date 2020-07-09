import CLI from "../../cli";

export default class Feedback extends CLI {
  constructor() {
    super();
  }

  public async init() {
    console.log("Feedback");
  }
}

import CLI from "../../cli";
import Print from "../../Print";

export default class Version extends CLI {
  constructor() {
    super();
  }

  public async init() {
    Print.text(`You are using kmdr-cli version ${this.PKG_VERSION}`);
  }
}

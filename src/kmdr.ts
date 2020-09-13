import CLI from "./Cli";
import Print from "./Print";

class KMDR extends CLI {
  public async init() {
    Print.text(this.PKG_VERSION);
  }
}

export default KMDR;

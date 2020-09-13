import CLI from "../../Cli";
import Print from "../../Print";

export default class Info extends CLI {
  constructor() {
    super();
  }

  public async init() {
    Print.text(`Kmdr:`);
    Print.text(`Version: ${this.PKG_VERSION}`, 4);
    Print.text(`Registry Endpoint: ${this.KMDR_ENDPOINT_URI}`, 4);
    Print.text(`Settings directory: ${this.KMDR_PATH}`, 4);
    Print.text(`Current Theme: ${this.settingsManager.theme.name}`, 4);
    Print.text(`Node.js:`);
    Print.text(`Version: ${this.NODE_VERSION}`, 4);
    Print.text(`Path: ${this.NODE_PATH}`, 4);

    // OS
    Print.text(`OS:`);
    Print.text(`Architecture: ${this.OS_ARCH}`, 4);
    Print.text(`User: ${this.OS_USERNAME}`, 4);
    Print.text(`Home directory: ${this.OS_HOME_PATH}`, 4);
    Print.text(`Platform: ${this.OS_PLATFORM}`, 4);
    Print.text(`Release: ${this.OS_RELEASE}`, 4);
    Print.text(`Shell: ${this.OS_SHELL}`, 4);
    Print.text(`Locale: ${this.LANG}`, 4);
    Print.newLine();
  }

  // protected pre() {
  //   return;
  // }
}

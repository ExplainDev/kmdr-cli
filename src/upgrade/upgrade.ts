import Console from "../console";
import { ConsoleInstance, UpgradeClientInstance } from "../interfaces";
import UpgradeClient from "./client";

export class Upgrade {
  private client: UpgradeClientInstance;
  private console: ConsoleInstance;

  constructor() {
    this.client = new UpgradeClient();
    this.console = new Console();
  }

  public async render() {
    const latestVersion = await this.client.getLatestVersion();

    const {
      latestCliRelease: { isCliVersionCurrent, latestRelease },
    } = latestVersion.data;

    if (isCliVersionCurrent) {
      this.console.print("You have the latest version of kmdr-cli", { margin: 2 });
    } else {
      this.console.print("You don't have the latest version of kmdr-cli installed on your system", {
        margin: 2,
      });
      this.console.print(
        "Check out the newest release at https://github.com/ediardo/kmdr-cli/releases",
        { margin: 2 },
      );
    }
  }
}

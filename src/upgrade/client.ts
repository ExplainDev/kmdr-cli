import Client from "../client";
import { LatestCliReleaseResponse } from "../interfaces";

const queryLatestCliVersion = `
query CliVersions($cliVersion: String) {
  latestCliRelease(cliVersion: $cliVersion) {
    isCliVersionCurrent
    latestRelease {
      url
			tagName
      publishedAt
      body
    }
  }
}
`;

export default class UpgradeClient extends Client {
  constructor() {
    super();
  }

  public async getLatestVersion(): Promise<LatestCliReleaseResponse> {
    return super.doQuery(queryLatestCliVersion) as Promise<LatestCliReleaseResponse>;
  }
}

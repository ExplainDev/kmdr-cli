import Client from "../client";
import { LatestCliReleaseResponse } from "../interfaces";
import { KMDR_CLI_VERSION } from "../constants";

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
    return super.doQuery(queryLatestCliVersion, { cliVersion: KMDR_CLI_VERSION }) as Promise<
      LatestCliReleaseResponse
    >;
  }
}

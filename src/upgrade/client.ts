import Client from "../client";
import { queryLatestCliVersion } from "../graphql";
import { LatestCliReleaseResponse } from "../interfaces";

export default class UpgradeClient extends Client {
  constructor() {
    super();
  }

  public async getLatestVersion(): Promise<LatestCliReleaseResponse> {
    return super.doQuery(queryLatestCliVersion) as Promise<LatestCliReleaseResponse>;
  }
}

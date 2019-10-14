"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
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
class UpgradeClient extends client_1.default {
    constructor() {
        super();
    }
    async getLatestVersion() {
        return super.doQuery(queryLatestCliVersion);
    }
}
exports.default = UpgradeClient;
//# sourceMappingURL=client.js.map
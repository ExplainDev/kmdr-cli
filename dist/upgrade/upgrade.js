"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = __importDefault(require("../console"));
const client_1 = __importDefault(require("./client"));
class Upgrade {
    constructor() {
        this.client = new client_1.default();
        this.console = new console_1.default();
    }
    async render() {
        const latestVersion = await this.client.getLatestVersion();
        const { latestCliRelease: { isCliVersionCurrent, latestRelease }, } = latestVersion.data;
        if (isCliVersionCurrent) {
            this.console.print("You have the latest version of kmdr-cli", { margin: 2 });
        }
        else {
            this.console.print("You don't have the latest version of kmdr-cli installed on your system", {
                margin: 2,
            });
            this.console.print("Check out the newest release at https://github.com/ediardo/kmdr-cli/releases", { margin: 2 });
        }
    }
}
exports.Upgrade = Upgrade;
//# sourceMappingURL=upgrade.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const constants_1 = require("./constants");
const explain_1 = require("./explain");
const upgrade_1 = require("./upgrade");
class KMDR {
    constructor(settings) {
        this.cli = commander_1.default;
        // tslint:disable-next-line: max-line-length
        this.welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;
        this.settings = settings;
    }
    init() {
        this.cli.description(this.welcomeMsg).version(constants_1.KMDR_CLI_VERSION, "-v, --version");
        this.cli
            .command("explain")
            .alias("e")
            .description("Explain a shell command")
            .option("--no-show-syntax", "Do not show syntax highlighting")
            .option("-o, --ask-once", "Ask only once")
            .option("--no-show-related", "Do not show related CLI programs")
            .action(this.explain);
        this.cli
            .command("upgrade")
            .alias("u")
            .description("Check for newer releases")
            .action(this.upgrade);
        this.cli.parse(process.argv);
        if (process.argv.length < 3) {
            this.cli.help();
        }
    }
    async explain(command) {
        const { askOnce, noShowSyntax = false, noShowRelated = false } = command;
        const explain = new explain_1.Explain({
            askOnce,
            showRelatedPrograms: !noShowRelated,
            showSyntax: !noShowSyntax,
        });
        await explain.render();
    }
    async upgrade() {
        const upgrade = new upgrade_1.Upgrade();
        await upgrade.render();
    }
}
exports.default = KMDR;
//# sourceMappingURL=kmdr.js.map
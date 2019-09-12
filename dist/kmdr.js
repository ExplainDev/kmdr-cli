"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const explain_1 = __importDefault(require("./client/explain"));
const explain_2 = __importDefault(require("./console/explain"));
const pkg = require("../package.json");
class KMDR {
    constructor(settings) {
        this.cli = commander_1.default;
        // tslint:disable-next-line: max-line-length
        this.welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;
        this.settings = settings;
        this.explainClient = new explain_1.default();
        this.explainConsole = new explain_2.default();
    }
    async init() {
        this.cli.description(this.welcomeMsg).version(pkg.version, "-v, --version");
        this.cli
            .command("explain")
            .alias("e")
            .description("Explain a shell command")
            .action(this.promptExplain.bind(this));
        this.cli.parse(process.argv);
        if (process.argv.length < 3) {
            this.cli.help();
        }
    }
    async promptExplain(args) {
        const { query } = await this.explainConsole.prompt();
        if (query === "") {
            this.explainConsole.error("Enter a command");
            return;
        }
        try {
            this.explainConsole.startSpinner("Analyzing...");
            const res = await this.explainClient.getExplanation(query);
            this.explainConsole.stopSpinner();
            if (res && res.data) {
                this.explainConsole.render(res.data);
                const answer = await this.explainConsole.wasItHelpful();
                if (answer === "Yes") {
                    const comment = await this.explainConsole.yesFeedback();
                    this.explainConsole.startSpinner("Sending feedback...");
                    await this.explainClient.sendFeedback("yes", comment);
                    this.explainConsole.succeedSpinner("Your feedback was saved. Thank you!");
                }
                else if (answer === "No") {
                    const comment = await this.explainConsole.noFeedback();
                    this.explainConsole.startSpinner("Sending feedback...");
                    await this.explainClient.sendFeedback("no", comment);
                    this.explainConsole.succeedSpinner("Your feedback was saved. Thank you!");
                }
                process.exit();
            }
        }
        catch (err) {
            this.explainConsole.stopSpinner();
            this.explainConsole.error(err);
        }
    }
    promptConfig() {
        console.log("promptConfig");
    }
}
exports.default = KMDR;
//# sourceMappingURL=kmdr.js.map
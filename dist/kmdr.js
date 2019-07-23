"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const explain_1 = __importDefault(require("./client/explain"));
const explain_2 = __importDefault(require("./console/explain"));
class KMDR {
    constructor(settings) {
        this.cli = commander_1.default;
        this.settings = settings;
        this.explainClient = new explain_1.default();
        this.explainConsole = new explain_2.default();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cli
                .description("Explain a command")
                .version("0.1.0", "-v, --version")
                .command("explain")
                .alias("e")
                .description("Explain a shell command")
                .action(this.promptExplain.bind(this));
            this.cli.parse(process.argv);
            if (process.argv.length < 3) {
                this.cli.help();
            }
        });
    }
    promptExplain(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = yield this.explainConsole.prompt();
            if (query === "") {
                this.explainConsole.error("Enter a command");
                return;
            }
            try {
                this.explainConsole.startSpinner("Analyzing...");
                const res = yield this.explainClient.getExplanation(query);
                this.explainConsole.stopSpinner();
                if (res && res.data) {
                    this.explainConsole.render(res.data);
                    const answer = yield this.explainConsole.wasItHelpful();
                    if (answer === "Yes") {
                        const comment = yield this.explainConsole.yesFeedback();
                        this.explainConsole.startSpinner("Sending feedback...");
                        yield this.explainClient.sendFeedback("yes", comment);
                        this.explainConsole.succeedSpinner("Your feedback was saved. Thank you!");
                    }
                    else if (answer === "No") {
                        const comment = yield this.explainConsole.noFeedback();
                        this.explainConsole.startSpinner("Sending feedback...");
                        yield this.explainClient.sendFeedback("no", comment);
                        this.explainConsole.succeedSpinner("Your feedback has been saved. Thank you!");
                    }
                    else {
                        console.log("Learn more at https://github.com/ediardo/kmdr.sh");
                        process.exit();
                    }
                    console.log("Learn more at https://github.com/ediardo/kmdr.sh");
                }
            }
            catch (err) {
                this.explainConsole.stopSpinner();
                this.explainConsole.error(err);
            }
        });
    }
    promptConfig() {
        console.log("promptConfig");
    }
}
exports.default = KMDR;
//# sourceMappingURL=kmdr.js.map
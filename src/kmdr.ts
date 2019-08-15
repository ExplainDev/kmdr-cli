import cli from "commander";
import ExplainClient from "./client/explain";
import ExplainConsole from "./console/explain";
import { Settings } from "./interfaces";

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  private explainClient: ExplainClient;
  private explainConsole: ExplainConsole;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;

  constructor(settings?: Settings) {
    this.settings = settings;
    this.explainClient = new ExplainClient();
    this.explainConsole = new ExplainConsole();
  }

  public async init() {
    this.cli.description(this.welcomeMsg).version("0.1.27", "-v, --version");
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

  private async promptExplain(args?: any) {
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
        } else if (answer === "No") {
          const comment = await this.explainConsole.noFeedback();
          this.explainConsole.startSpinner("Sending feedback...");
          await this.explainClient.sendFeedback("no", comment);
          this.explainConsole.succeedSpinner("Your feedback was saved. Thank you!");
        }
        process.exit();
      }
    } catch (err) {
      this.explainConsole.stopSpinner();
      this.explainConsole.error(err);
    }
  }

  private promptConfig() {
    console.log("promptConfig");
  }
}

export default KMDR;

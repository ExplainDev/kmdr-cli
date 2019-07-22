import cli from "commander";
import ExplainClient from "./client/explain";
import ExplainConsole from "./console/explain";
import { Settings } from "./interfaces";

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  private explainClient: ExplainClient;
  private explainConsole: ExplainConsole;

  constructor(settings?: Settings) {
    this.settings = settings;
    this.explainClient = new ExplainClient();
    this.explainConsole = new ExplainConsole();
  }

  public init() {
    this.cli.version("0.1").option("-v, version", "Show program version and exit");

    this.cli
      .command("explain [options]")
      .alias("exp")
      .description("Explain a command")
      .action(this.promptExplain.bind(this));

    this.cli.parse(process.argv);
  }

  private async promptExplain(args: any, { interactive }: any) {
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
          this.explainConsole.succeedSpinner("Your feedback has been saved. Thank you!");
        } else if (answer === "No") {
          const comment = await this.explainConsole.noFeedback();
          this.explainConsole.startSpinner("Sending feedback...");
          await this.explainClient.sendFeedback("no", comment);
          this.explainConsole.succeedSpinner("Your feedback has been saved. Thank you!");
        } else {
          process.exit();
        }
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

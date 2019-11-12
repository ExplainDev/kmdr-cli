import cli from "commander";
import { KMDR_CLI_VERSION } from "./constants";
import { Explain } from "./explain";
import { Feedback } from "./feedback";
import { Settings } from "./interfaces";
import { Upgrade } from "./upgrade";

class KMDR {
  private settings?: Settings;
  private cli = cli;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The ultimate CLI learning tool for explaining commands from your terminal\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;

  constructor(settings?: Settings) {
    this.settings = settings;
  }

  public init() {
    this.cli.description(this.welcomeMsg).version(KMDR_CLI_VERSION, "-v, --version");
    this.cli
      .command("explain")
      .alias("e")
      .description("Explain a shell command")
      .option("--no-show-syntax", "Hide syntax highlighting")
      .option("--no-prompt-again", "Do not return prompt for additional explanations")
      .option("--no-show-related", "Hide related CLI programs")
      .option("--no-show-examples", "Hide command examples")
      .action(this.explain);

    this.cli
      .command("upgrade")
      .alias("u")
      .description("Check for new releases")
      .action(this.upgrade);

    this.cli
      .command("feedback")
      .alias("f")
      .description("Send feedback :)")
      .action(this.feedback);

    this.cli.parse(process.argv);

    if (process.argv.length < 3) {
      this.cli.help();
    }
  }

  private async explain(command: any, opt: any) {
    const {
      promptAgain = false,
      showSyntax = false,
      showRelated = false,
      showExamples = false,
    } = command;
    const explain = new Explain({
      promptAgain,
      showExamples,
      showRelatedPrograms: showRelated,
      showSyntax,
    });
    await explain.render();
  }

  private async upgrade() {
    const upgrade = new Upgrade();
    await upgrade.render();
  }

  private async feedback() {
    const feedback = new Feedback();
    await feedback.render();
  }
}

export default KMDR;

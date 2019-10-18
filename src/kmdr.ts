import cli from "commander";
import { KMDR_CLI_VERSION } from "./constants";
import { Explain } from "./explain";
import { Settings } from "./interfaces";
import { Upgrade } from "./upgrade";
import { Feedback } from "./feedback";

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;

  constructor(settings?: Settings) {
    this.settings = settings;
  }

  public init() {
    this.cli.description(this.welcomeMsg).version(KMDR_CLI_VERSION, "-v, --version");
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

  private async explain(command: any) {
    const { askOnce, showSyntax = false, showRelated = false } = command;
    const explain = new Explain({
      askOnce,
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

import cli from "commander";
import { Settings } from "./interfaces";
import { Explain } from "./explain";
import { KMDR_CLI_VERSION } from "./constants";

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;

  constructor(settings?: Settings) {
    this.settings = settings;
  }

  public async init() {
    this.cli.description(this.welcomeMsg).version(KMDR_CLI_VERSION, "-v, --version");
    this.cli
      .command("explain")
      .alias("e")
      .description("Explain a shell command")
      .option("-s, --syntax", "Show syntax highlighting")
      .option("-o, --ask-once", "Ask only once")
      .action(this.explain);

    this.cli
      .command("config")
      .alias("c")
      .description("Configure kmdr cli on this machine")
      .action(this.config);

    this.cli.parse(process.argv);

    if (process.argv.length < 3) {
      this.cli.help();
    }
  }

  private async explain(command: any) {
    const { askOnce, syntax } = command;
    const explain = new Explain({ askOnce, showSyntax: syntax });
    await explain.render();
  }

  private async config(a: any, b: any) {
    console.log("config");
  }
}

export default KMDR;

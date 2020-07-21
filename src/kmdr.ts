import arg from "commander";
import Explain from "./subcommands/explain";
import Info from "./subcommands/info";
import Login from "./subcommands/login";
import Logout from "./subcommands/logout";
import Settings from "./subcommands/settings";
import Version from "./subcommands/version";

class KMDR {
  private arg = arg;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The CLI tool for learning commands from your terminal\n\nLearn more at https://kmdr.sh/`;

  public init() {
    this.arg.description(this.welcomeMsg).version("unknown", "-v, --version");
    // this.cli.command("config").alias("c").description("Configure kmdr-cli").action(this.config);
    this.arg
      .command("explain")
      .alias("e")
      .description("Explain a shell command")
      .action(this.explain);
    this.arg
      .command("info")
      .alias("i")
      .description("Display system-wide information")
      .action(this.info);
    this.arg.command("login [email]").alias("l").description("Log in to kmdr").action(this.login);
    this.arg.command("logout").description("Log out from kmdr").action(this.logout);
    this.arg
      .command("settings")
      .alias("s")
      .description("Adjust options and preferences")
      .action(this.settings);
    this.arg
      .command("version")
      .alias("v")
      .description("Print current version and check for newer releases")
      .action(this.version);

    this.arg.parse(process.argv);

    if (process.argv.length < 3) {
      this.arg.help();
    }
  }

  private async explain() {
    const explain = new Explain();
    await explain.init();
  }

  private async login(email: string) {
    const login = new Login(email);
    await login.init();
  }

  private async logout() {
    const logout = new Logout();
    await logout.init();
  }

  private async version() {
    const version = new Version();
    await version.init();
  }

  private async settings() {
    const settings = new Settings();
    await settings.init();
  }

  private async info() {
    const info = new Info();
    await info.init();
  }
}

export default KMDR;

import arg from "commander";
import KMDR from "./Kmdr";
import Explain from "./subcommands/explain";
import Info from "./subcommands/info";
import Login from "./subcommands/login";
import Logout from "./subcommands/logout";
import Settings from "./subcommands/settings";
import Version from "./subcommands/version";
import History from "./subcommands/history";

export default function main() {
  async function initExplain() {
    const explain = new Explain();
    await explain.init();
  }

  async function initInfo() {
    const info = new Info();
    await info.init();
  }

  async function initKmdr() {
    const kmdr = new KMDR();
    await kmdr.init();
  }

  async function initHistory() {
    const history = new History();
    await history.init();
  }

  async function initLogin(email: string) {
    const login = new Login(email);
    await login.init();
  }

  async function initLogout() {
    const logout = new Logout();
    await logout.init();
  }

  async function initSettings() {
    const settings = new Settings();
    await settings.init();
  }

  async function initVersion() {
    const version = new Version();
    await version.init();
  }
  const welcomeMsg = `The CLI tool for learning commands from your terminal\n\nLearn more at https://kmdr.sh/`;

  arg.description(welcomeMsg).option("-v, --version", "Print current version", async () => {
    await initKmdr();
  });

  arg.command("explain").alias("e").description("Explain a shell command").action(initExplain);
  arg.command("info").alias("i").description("Display system-wide information").action(initInfo);
  arg.command("login [email]").alias("l").description("Log in to kmdr").action(initLogin);
  arg.command("logout").description("Log out from kmdr").action(initLogout);
  arg.command("history").alias("h").description("View command history").action(initHistory);
  arg
    .command("settings")
    .alias("s")
    .description("Adjust options and preferences")
    .action(initSettings);
  arg
    .command("version")
    .alias("v")
    .description("Print current version and check for newer releases")
    .action(initVersion);

  arg.parse(process.argv);

  if (process.argv.length < 3) {
    arg.help();
  }
}

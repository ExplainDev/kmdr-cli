import chalk from "chalk";
import { prompt } from "enquirer";
import CLI from "../../Cli";
import Print from "../../Print";

interface ThemeChoice {
  theme: string;
}

export default class Settings extends CLI {
  constructor() {
    super();
  }

  public async init() {
    try {
      const theme = await this.promptThemeChoice();
      this.spinner?.start("Saving to file...");
      this.settingsManager.saveToDisk({ theme });
      this.spinner?.succeed("Changes were saved!");
    } catch (err) {
      if (err.code === "EACCES") {
        this.spinner?.fail(
          chalk.red(
            `Could not save changes. Validate that ${this.KMDR_SETTINGS_FILE} has Write permissions for current user`,
          ),
        );
        Print.error(err);
      }
    }
  }

  private async promptThemeChoice() {
    const availableThemeChoices = [];

    for (const theme of this.settingsManager.availableThemes) {
      if (theme.name === this.settingsManager.theme.name) {
        availableThemeChoices.push({
          message: `${theme.name} (${theme.mode} mode)`,
          value: theme.name,
          hint: "Current Theme",
        });
      } else {
        availableThemeChoices.push({
          message: `${theme.name} (${theme.mode} mode)`,
          value: theme.name,
        });
      }
    }

    const themeChoices = {
      choices: [...availableThemeChoices],
      message: "Choose a theme",
      name: "theme",
      type: "select",
    };

    try {
      const choice = await prompt<ThemeChoice>(themeChoices);
      return choice.theme;
    } catch (err) {
      throw err;
    }
  }
}

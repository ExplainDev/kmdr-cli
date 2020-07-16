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
      this.settingsManager.saveToDisk({ theme });
    } catch (err) {
      Print.error("An error occurred");
      Print.newLine();
    }
  }

  private async promptThemeChoice() {
    const availableThemeChoices = [];

    for (const theme of this.settingsManager.availableThemes) {
      if (theme.name === this.settingsManager.theme.name) {
        console.log("See");
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

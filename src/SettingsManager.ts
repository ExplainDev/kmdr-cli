import { rawListeners } from "commander";
import fs from "fs";
import os from "os";
import path from "path";
import { KmdrError, KmdrSettingsError } from "./errors";
import { Settings, SettingsFile, Theme } from "./interfaces";
import Print from "./Print";
import ThemeManager from "./ThemeManager";

const DEFAULT_THEME: Theme = {
  name: "Greenway",
  mode: "dark",
  palette: {
    argument: {
      bold: true,
      foreground: "#f8f8f2",
      italic: true,
    },
    braces: {
      foreground: "#BD10E0",
    },
    brackets: {
      foreground: "#BD10E0",
    },
    comment: {
      foreground: "#9B9B9B",
      italic: true,
    },
    keyword: {
      foreground: "#ff5555",
    },
    operator: {
      foreground: "#f1fa8c",
    },
    option: {
      foreground: "#50fa7b",
      bold: true,
    },
    parens: {
      foreground: "#BD10E0",
    },
    program: {
      foreground: "#50E3C2",
      bold: true,
    },
    quotes: {
      foreground: "#BD10E0",
    },
    redirect: {
      foreground: "#F5A623",
      bold: true,
    },
    subcommand: {
      foreground: "#F8E71C",
      bold: true,
    },
    tokenKind: {
      background: "#222222",
      foreground: "#AA5599",
    },
    varName: {
      foreground: "#B8E986",
    },
  },
};

export default class SettingsManager implements Settings {
  public availableThemes: ThemeManager[] = [];
  public theme!: ThemeManager;
  private settingsPath: string;
  private settingsFile: string;

  constructor(settingsPath: string, settingsFile: string) {
    this.settingsPath = settingsPath;
    this.settingsFile = settingsFile;

    this.loadAllThemes();
    // If directory does not exists, use default settings
    if (!fs.existsSync(path.join(this.settingsPath, "settings.json"))) {
      this.loadDefault();
    } else {
      this.loadFromDisk();
    }
  }

  public saveToDisk(newSettings: SettingsFile) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(newSettings, null, 2) + os.EOL, {
        encoding: "utf8",
        mode: 0o640,
      });
    } catch (err) {
      throw err;
    }
  }

  private loadAllThemes() {
    const themesPath = path.join(__dirname, "files", "themes");

    const themeFiles = fs.readdirSync(themesPath);

    for (const file of themeFiles) {
      const filePath = path.join(themesPath, file);

      try {
        const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
        const parsedContents = JSON.parse(fileContents) as Theme;
        const theme = new ThemeManager(parsedContents);
        if (theme) {
          this.availableThemes.push(theme);
        }
      } catch (err) {
        throw err;
      }
    }
  }

  private loadDefault() {
    this.theme = new ThemeManager(DEFAULT_THEME);
  }

  private loadFromDisk() {
    try {
      const file = fs.readFileSync(this.settingsFile, "utf8");

      if (file === "") {
        this.theme = new ThemeManager(DEFAULT_THEME);
      } else {
        const parsedFile = JSON.parse(file) as SettingsFile;

        if (parsedFile.theme.trim() === "") {
          throw new KmdrError("KMDR_CLI_INVALID_THEME_NAME", 201, `Settings file is invalid`);
        }

        this.theme = this.loadTheme(parsedFile.theme) || new ThemeManager(DEFAULT_THEME);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        Print.error(
          `Settings file is invalid. Delete file ${this.settingsFile} and run "kmdr settings" again`,
        );
        Print.error(err.message);
        Print.newLine();
        process.exit(1);
      } else if (err.code === "EACCES") {
        Print.error(
          `Could not open file ${this.settingsFile} for read. Make sure it has the right Read permissions for current user`,
        );
        Print.error(err.message);
        process.exit(1);
      } else if (err.code === "ENOENT") {
        Print.error(err.message);
        process.exit(1);
      } else {
        throw err;
      }
    }
  }

  private loadTheme(name: string) {
    for (const theme of this.availableThemes) {
      if (theme.name === name) {
        return theme;
      }
    }
  }
}

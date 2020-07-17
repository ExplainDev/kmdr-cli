import fs from "fs";
import os from "os";
import path from "path";
import { Settings, SettingsFile, Theme } from "./interfaces";
import ThemeManager from "./ThemeManager";

const DEFAULT_THEME: Theme = {
  name: "greenway",
  mode: "dark",
  palette: {
    argument: {
      bold: true,
      foreground: "#f8f8f2",
      italic: true,
    },
    comment: {
      foreground: "#6272a4",
    },
    keyword: {
      foreground: "#ff5555",
    },
    operator: {
      foreground: "#f1fa8c",
    },
    option: {
      foreground: "#50fa7b",
    },
    program: {
      foreground: "#FFC0CB",
    },
    subcommand: {
      foreground: "#bd93f9",
    },
    tokenKind: {
      background: "#222222",
      foreground: "#AA5599",
    },
  },
};

export default class SettingsManager implements Settings {
  public availableThemes: ThemeManager[] = [];
  public theme!: ThemeManager;
  private settingsPath: string;

  constructor(settingsPath: string) {
    this.settingsPath = settingsPath;

    this.loadAllThemes();
    // If directory does not exists, use default settings
    if (!fs.existsSync(this.settingsPath)) {
      this.loadDefault();
    } else {
      this.loadFromDisk();
    }
  }

  public saveToDisk(newSettings: SettingsFile) {
    try {
      const filePath = path.join(this.settingsPath, "settings.json");

      fs.writeFileSync(filePath, JSON.stringify(newSettings, null, 2) + os.EOL, {
        encoding: "utf8",
        mode: 0o640,
      });
    } catch (err) {
      console.error(err);
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
        console.error(err);
      }
    }
  }

  private loadDefault() {
    this.theme = new ThemeManager(DEFAULT_THEME);
  }

  private loadFromDisk() {
    try {
      const filePath = path.join(this.settingsPath, "settings.json");

      const file = fs.readFileSync(filePath, "utf8");

      if (file === "") {
        throw new Error("File is empty");
      } else {
        const parsedFile = JSON.parse(file) as SettingsFile;

        this.theme = this.loadTheme(parsedFile.theme) || new ThemeManager(DEFAULT_THEME);
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        console.error(err.message);
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

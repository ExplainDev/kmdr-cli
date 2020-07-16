import { parse } from "commander";
import fs from "fs";
import path from "path";
import DefaultTheme from "./files/themes/greenway.theme.json";
import { Settings, SettingsFile, Theme } from "./interfaces";
import Print from "./Print";
import ThemeManager from "./ThemeManager";
import os from "os";

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
    const themesPath = path.join(path.basename(__dirname), "files", "themes");

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
    this.theme = new ThemeManager(DefaultTheme);
  }

  private loadFromDisk() {
    try {
      const filePath = path.join(this.settingsPath, "settings.json");

      const file = fs.readFileSync(filePath, "utf8");

      if (file === "") {
        throw new Error("File is empty");
      } else {
        const parsedFile = JSON.parse(file) as SettingsFile;

        this.theme = this.loadTheme(parsedFile.theme) || new ThemeManager(DefaultTheme);
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

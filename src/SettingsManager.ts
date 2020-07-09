import { parse } from "commander";
import fs from "fs";
import path from "path";
import DefaultTheme from "./install/themes/greenway.theme.json";
import { Settings } from "./interfaces";
import ThemeManager from "./ThemeManager";

export default class SettingsManager implements Settings {
  // public availableThemes: Theme[];
  public theme: ThemeManager;
  private settingsPath: string;

  constructor(settingsPath: string) {
    this.settingsPath = settingsPath;
    this.theme = new ThemeManager(DefaultTheme);

    // If directory does not exists, use default settings
    if (!fs.existsSync(this.settingsPath)) {
      this.theme = new ThemeManager(DefaultTheme);
    } else {
      const filePath = path.join(this.settingsPath, "settings.json");

      try {
        const file = fs.readFileSync(filePath, "utf8");

        if (file === "") {
          console.error("FIle is empty. Setting default");
        } else {
          const parsedFile = JSON.parse(file);
          console.log(parsedFile);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  // public setup() {
  //   if (fs.existsSync(this.settingsPath)) {
  //     return;
  //   }

  //   try {
  //     fs.mkdirSync(this.settingsPath);
  //     fs.copyFileSync("./install/settings.json", this.settingsPath);
  //     fs.copyFileSync("./install/settings.json", this.settingsPath);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // public save(settings: SettingsFile) {}

  // public loadThemes() {
  //   const themesPath = path.join(this.settingsPath, "themes");

  //   const dir = fs.readdirSync(themesPath);

  //   const allJsonFiles = dir.filter((file) => {
  //     return path.extname(file).toLowerCase() === "json";
  //   });

  //   const validThemes = allJsonFiles.map((file) => {
  //     try {
  //       const fileContents = fs.readFileSync(file, { encoding: "utf-8" });
  //       const parsedContents = JSON.parse(fileContents);
  //       return new Theme(parsedContents);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   });
  // }
}

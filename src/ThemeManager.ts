import chalk from "chalk";
import { PaletteOptions, Theme, ThemePalette } from "./interfaces";

const defaultPaletteOptions: PaletteOptions = {
  foreground: "#FFFFFF",
};

export default class ThemeManager implements Theme {
  public readonly name: string;
  public readonly mode?: string;
  public readonly palette: ThemePalette;

  constructor(theme: Theme) {
    this.name = theme.name;
    this.mode = theme.mode;
    this.palette = theme.palette;
  }

  public print(kind: string, text: string) {
    const paletteOptions = kind in this.palette ? this.palette[kind] : defaultPaletteOptions;

    let styled = chalk.hex(paletteOptions.foreground);

    if (paletteOptions.background) {
      styled = styled.bgHex(paletteOptions.background);
    }

    let styledText = styled(text);

    if (paletteOptions.underline) {
      styledText = styled.underline(styledText);
    }

    if (paletteOptions.bold) {
      styledText = styled.bold(styledText);
    }

    if (paletteOptions.italic) {
      styledText = styled.italic(styledText);
    }

    return styledText;
  }
}

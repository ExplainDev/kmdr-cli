import chalk from "chalk";

export default class Print {
  public static newLine(n = 1) {
    let i = 1;

    while (i++ <= n) {
      console.log();
    }
  }

  public static text(text: string, indent: number = 2) {
    const spaces = ` `.repeat(indent);

    console.log(`${spaces}${text}`);
  }

  public static header(text: string) {
    return console.log(`  ${chalk.bold(text.toUpperCase())}`);
  }

  public static error(text: string, indent: number = 2) {
    const spaces = ` `.repeat(indent);

    console.error(`${spaces}${chalk.red(text)}`);
  }
}

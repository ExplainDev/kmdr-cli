import KmdrError from "./KmdrError";

export default class KmdrThemeError extends KmdrError {
  constructor(message: string) {
    super("THEMEERROR", 200, message);
  }
}

import KmdrError from "./KmdrError";

export default class KmdrThemeError extends KmdrError {
  constructor(message: string) {
    super(200, message);
  }
}

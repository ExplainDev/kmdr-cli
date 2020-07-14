import KmdrError from "./KmdrError";

export default class KmdrAuthError extends KmdrError {
  constructor(message: string) {
    super("AUTH_ERROR", 100, message);
  }
}

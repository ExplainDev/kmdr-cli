import KmdrError from "./KmdrError";

export default class KmdrAuthError extends KmdrError {
  constructor(message: string) {
    super(100, message);
  }
}

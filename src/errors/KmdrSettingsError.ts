import KmdrError from "./KmdrError";

export default class KmdrSettingsError extends KmdrError {
  constructor(message: string) {
    super("SETTINGS_ERROR", 100, message);
  }
}

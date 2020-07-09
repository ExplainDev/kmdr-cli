export default class KmdrError extends Error {
  public code: number;
  public message: string;

  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}

export default class KmdrError extends Error {
  public code: string;
  public errno: number;
  public message: string;

  constructor(code: string, errno: number, message: string) {
    super();
    this.code = code;
    this.errno = errno;
    this.message = message;
  }
}

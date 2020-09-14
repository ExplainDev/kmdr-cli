export const EXIT_STATUS = {
  /**  COULD NOT REACH THE API BECAUSE OF A NETWORK ISSUE (OR API IS DOWN) */
  API_UNREACHABLE: 30,
  /**  Auth file contents look invalid (multiple lines or empty)  $HOME/.kmdr/auth */
  AUTH_FILE_INVALID: 10,
  /**  Auth file does not exist $HOME/.kmdr/auth */
  AUTH_FILE_NOT_PRESENT: 11,
  /** Auth path ($HOME/.kmdr) access forbidden (permission denied) */
  AUTH_PATH_EACCESS: 12,
  /**  Generic */
  GENERIC: 1,
  /** The token expired. It occurs when user does not click the login link. */
  TOKEN_EXPIRED: 20,
  /** Could not find a valid session in the server */
  USER_NOT_AUTHENTICATED: 40,
};

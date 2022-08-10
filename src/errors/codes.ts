export enum ErrorCode {
  UserEmailDuplicate = 'user.email.duplicate',
  UserNotFound = 'user.not.found',
  UserEmailNotAppropriate = 'user.email.not.appropriate',
  UserBadCredentials = 'user.bad.credentials',

  AuthBad = 'authenticaton.bad',
  AuthBadTokenScheme = 'authentication.bad.token.scheme',
  AuthExpired = 'authentication.expired',

  BadParams = 'bad.parameters',
}

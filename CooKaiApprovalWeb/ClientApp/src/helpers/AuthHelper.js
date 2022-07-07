import * as constants from '../constants';

const baseUrl = `${window.location.origin}`;
export default class AuthHelper {
  static startSignIn() {
    // authenticationContext.clearCache();
    // authenticationContext.login();
    const redirectUrl = encodeURI(`${baseUrl}/${constants.Auth.signInEndPage}`);
    const oAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${constants.Auth.appId}&response_type=code&redirect_uri=${redirectUrl}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read%20Files.Read.All%20User.Read.All%20Group.Read.All&state=12345`;
    window.location.replace(oAuthUrl);
  }
}

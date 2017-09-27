const tsClientID ='e2a16cb99602437c9ebebc51f20e629e';
const tsClientSecret = 'f37146ca37a04386ae41c3cba37f8e99';

const TSheetsApi = require('tsheetsapi');


var tsAuthenticationSettings = {
  client_id: tsClientID,
  redirect_uri: '',
  response_type: 'code',
  grant_type: 'authorization_code',
  initState: 'tsInitState',
  userCreds: {
    client: {
      id: tsClientID,
      secret: tsClientSecret,
    },
    auth: {
      tokenHost: 'https://rest.tsheets.com',
      tokenPath: '/api/v1/grant',
      authorizePath: '/api/v1/authorize',
      revokePath: '/api/v1/revoke'
    },
    options: {
      useBodyAuth: true,
      useBasicAuthorizationHeader: false
    }
  },
  AuthResponse: {
    access_token: '',
    expires_in: '',
    token_type: '',
    scope: '',
    refresh_token: '',
    user_id: '',
    company_id: '',
    client_url: '',
    expires_at: ''
  }
}


function setTSRedirectURI(port) {
  if (port === 3000) {
    return "http://localhost:"+port+"/TScallback";
  } else {
    return "https://simple-oauth2.herokuapp.com/TScallback";
  }
}

module.exports.oa2AppSettings = function(port) {
  tsAuthenticationSettings.redirect_uri = setTSRedirectURI(port);
  return tsAuthenticationSettings;
}

module.exports.tsApi = function(AuthResponse) {
  const tapi = new TSheetsApi({
    bearerToken: AuthResponse.access_token
  });

  return tapi;
}


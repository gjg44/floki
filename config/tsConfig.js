var cfgVals = require('./config');

const tsClientID = cfgVals.tsClientID;
const tsClientSecret = cfgVals.tsClientSecret;

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


function setTSRedirectURI() {
  const port = process.env.PORT || 3000;
  if (port === 3000) {
    return cfgVals.localhost+cfgVals.port+cfgVals.tsCallback;
  } else {
    return cfgVals.herokuAppLink+cfgVals.tsCallback;
  }
}

module.exports.oa2AppSettings = function() {
  tsAuthenticationSettings.redirect_uri = setTSRedirectURI();
  return tsAuthenticationSettings;
}

module.exports.tsApi = function(AuthResponse) {
  const tapi = new TSheetsApi({
    bearerToken: AuthResponse.access_token
  });

  return tapi;
}


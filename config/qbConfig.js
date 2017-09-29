var cfgVals = require('./config');


const qbSandboxClientID = cfgVals.qbSandboxClientID;
const qbSandboxClientSecret = cfgVals.qbSandboxClientSecret;
const qbSandbox1CompanyID =  cfgVals.qbSandbox1CompanyID;
const qbSandbox2CompanyID = cfgVals.qbSandbox2CompanyID;

const qbRRJClientID = cfgVals.qbRRJClientID;
const qbRRJClientSecret = cfgVals.qbRRJClientSecret;
const qbRRJCompanyID = cfgVals.qbRRJCompanyID;

var QB_Globals = {
  Production_ClientID: qbRRJClientID,
  Production_ClientSecret: qbRRJClientSecret,
  Production_CompanyID: qbRRJCompanyID,
  Production_BaseURL: 'quickbooks.api.intuit.com',
  Sandbox_ClientID:  qbSandboxClientID,
  Sandbox_ClientSecret: qbSandboxClientSecret,
  Sandbox1_CompanyID: qbSandbox1CompanyID,
  Sandbox2_CompanyID: qbSandbox2CompanyID,
  Sandbox_BaseURL: 'sandbox-quickbooks.api.intuit.com',
  scope: 'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment'
};

const qbInfo = {
 issuer: "https://oauth.platform.intuit.com/op/v1",
 authorization_endpoint: "https://appcenter.intuit.com/connect/oauth2",
 token_endpoint: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
 userinfo_endpoint: "https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo",
 revocation_endpoint: "https://developer.api.intuit.com/v2/oauth2/tokens/revoke",
 jwks_uri: "https://oauth.platform.intuit.com/op/v1/jwks",
 response_types_supported: ["code"],
 subject_types_supported: ["public"],
 id_token_signing_alg_values_supported: ["RS256"],
 scopes_supported: ["openid","email","profile","address","phone"],
 token_endpoint_auth_methods_supported: ["client_secret_post","client_secret_basic"],
 claims_supported: ["aud","exp","iat","iss","realmid","sub"]
};

var qbAppSettings = {
  clientID: '',
  clientSecret: '',
  scope: QB_Globals.scope,
  authCode: 'L011503694415iw6xLoJiZj2GK8JQUrvDYli0tYb9Wy5VZDA87',
  companyID: '',
  redirect_uri: '',
  initState: 'qbInitState',
  userCreds: {
    client: {
      id:     '',
      secret: '',
    },
    auth: {
      tokenHost: qbInfo.issuer,
      tokenPath: qbInfo.token_endpoint,
      authorizePath: qbInfo.authorization_endpoint,
    },options: {
      useBodyAuth: false
    }
  },
  AuthResponse: {
    access_token: '',
    refresh_token: '',
    x_refresh_token_expires_in: '',
    expires_in: '',
    token_type: ''
  }
};

function setQBRedirectURI(port) {
  if (port === 3000) {
    return cfgVals.localhost+cfgVals.port+cfgVals.tsCallback;
  } else {
    return cfgVals.herokuAppLink+cfgVals.qbCallback;
  } 
}

module.exports.createNodeQBObject = function (
  clientID,
  clientSecret,
  oAuth2Token,
  companyID,
  debugFlag,
  sandboxFlag) {
  // Create the node-quickbooks-oauth2 QuickBooks object.
  // This will be populated and passed to the 'new Quickbooks' call
  // which will be the object passed to subsequent API calls.
  var NodeQuickBooksOauth2_Object = {
    consumerKey: clientID,
    cosnumerSecret: clientSecret,
    debug: debugFlag,
    endpoint: '',
    oauth2AccessToken: oAuth2Token,
    realmId: companyID,
    token: '',
    tokenSecret: '',
    useSandbox: sandboxFlag
  };
  return NodeQuickBooksOauth2_Object;
}

module.exports.oa2AppSettings = function() {
  const port = process.env.PORT || 3000;
  qbAppSettings.redirect_uri = setQBRedirectURI(port);
  if (port === 3000) {
    qbAppSettings.clientID = cfgVals.qbSandboxClientID;
    qbAppSettings.clientSecret = cfgVals.qbSandboxClientSecret;
    qbAppSettings.companyID = cfgVals.qbSandbox1CompanyID;
    qbAppSettings.userCreds.client.id = cfgVals.qbSandboxClientID;
    qbAppSettings.userCreds.client.secret = cfgVals.qbSandboxClientSecret;
  } else {
    qbAppSettings.clientID = cfgVals.qbRRJClientID;
    qbAppSettings.clientSecret = cfgVals.qbRRJClientSecret;
    qbAppSettings.companyID = cfgVals.qbRRJCompanyID;
    qbAppSettings.userCreds.client.id = cfgVals.qbRRJClientID;
    qbAppSettings.userCreds.client.secret = cfgVals.qbRRJClientSecret;
  }

  return qbAppSettings;
}

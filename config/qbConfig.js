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

var QB_Globals = {
  Sandbox_ClientID:  'Q0xKCSwHzkYafj5XTIgjst036kK08DrcAmm9HcB28godJxJApS',
  Sandbox_ClientSecret: 'xYaKJYLyOKwzFpPlhXmBp0sYuQ46ijLmpcZKTZOs',
  Sandbox1_CompanyID: 193514579895534,
  Sandbox2_CompanyID: 193514593237604,
  Sandbox_BaseURL: 'sandbox-quickbooks.api.intuit.com',
  scope: 'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment'
};

const qbClientID =  QB_Globals.Sandbox_ClientID;
const qbClientSecret = QB_Globals.Sandbox_ClientSecret;



var qbAppSettings = {
  clientID: qbClientID,
  clientSecret: qbClientSecret,
  scope: QB_Globals.scope,
  authCode: 'L011503694415iw6xLoJiZj2GK8JQUrvDYli0tYb9Wy5VZDA87',
  companyID: QB_Globals.Sandbox1_CompanyID,
  redirect_uri: '',
  initState: 'qbInitState',
  userCreds: {
    client: {
      id:     qbClientID,
      secret: qbClientSecret,
    },
    auth: {
      tokenHost: qbInfo.issuer,
      tokenPath: qbInfo.token_endpoint,
      authorizePath: qbInfo.authorization_endpoint,
    },options: {
      useBodyAuth: false
    }
  },
  qbAuthResponse: {
    access_token: '',
    refresh_token: '',
    x_refresh_token_expires_in: '',
    expires_in: '',
    token_type: ''
  }
};

function setQBRedirectURI(port) {
  if (port === 3000) {
    return "http://localhost:"+port+"/QBcallback";
  } else {
    return "https://simple-oauth2.herokuapp.com/QBcallback";
  }
}

module.exports.createNodeQBObject = function (clientID,clientSecret,oAuth2Token,companyID,debugFlag,sandboxFlag) {
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

module.exports.oa2ServerSettings = function () {
    return qbInfo;
}

module.exports.oa2AppSettings = function(port) {
  qbAppSettings.redirect_uri = setQBRedirectURI(port);
  return qbAppSettings;
}

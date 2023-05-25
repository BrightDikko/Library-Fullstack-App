export const oktaConfig = {
    clientId: "0oa9oxt2lwFfquJ6E5d7",
    issuer: "https://dev-61508708.okta.com/oauth2/default",
    redirectUri: "http://localhost:3000/login/callback",
    scopes: ["openid", "profile", "email"],
    pkce: true,
    disableHttpsCheck: true,
};

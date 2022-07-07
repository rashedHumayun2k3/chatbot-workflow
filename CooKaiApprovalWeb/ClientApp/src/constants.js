export const Auth = {
    appId: process.env.APP_ID,
    cacheLocation: 'localStorage',
    signInStartPage: 'signinstart',
    signInEndPage: 'signinend',
    authenticatedDomains: {
        "https://graph.microsoft.com": "https://graph.microsoft.com"
    }
};
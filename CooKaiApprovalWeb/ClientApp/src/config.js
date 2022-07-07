/* eslint-disable */
const api = {
  apiBaseUrl: window.location.origin+'/api',
};

const config = {
  api: {
    base: api.apiBaseUrl,
    tokenLabel: 'Authorization',
    contentType: 'application/json; charset=UTF-8',
    pageSize: 100,
    tokenCheckMinute: 5,
    graphBaseUrl: 'https://graph.microsoft.com/v1.0',
  },
};

export default config;

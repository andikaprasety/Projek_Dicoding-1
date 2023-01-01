const routes = (handler) => [
    {
      method: 'POST',
      path: '/authentications',
      handler: handler.postAuthenticationsHandler,
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: handler.putAuthenticationHandler,
    },
  ];

  module.exports = routes;
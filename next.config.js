module.exports = {
   reactStrictMode: true,
   env: {
      NEXT_PUBLIC_OAUTH_CONFIGURED: process.env.GITHUB_CLIENT_ID ? 'true' : ''
   }
}

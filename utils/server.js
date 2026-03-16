export const parseCookies = cookieHeader =>
   (cookieHeader || '').split(';').reduce((acc, cookie) => {
      const [key, ...val] = cookie.trim().split('=')
      acc[key] = val.join('=')
      return acc
   }, {})

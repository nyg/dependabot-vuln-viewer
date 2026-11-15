export const countPageView = () => {
   const params = new URLSearchParams({
      // The query string stays out: a failed sign-in puts its error message there.
      p: location.pathname,
      t: document.title,
      r: document.referrer,
      s: `${screen.width},${screen.height},${devicePixelRatio}`
   })
   fetch(`/api/hit?${params}`, { method: 'POST', keepalive: true }).catch(() => {})
}

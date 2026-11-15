const sameOrigin = req =>
   URL.canParse(req.headers.origin) && new URL(req.headers.origin).host === req.headers.host

const clientIp = req =>
   req.headers['x-real-ip'] ?? req.headers['x-forwarded-for']?.split(',')[0].trim()

const toHit = req => ({
   path: req.query.p,
   title: req.query.t ?? '',
   ref: req.query.r ?? '',
   size: req.query.s || undefined,
   ip: clientIp(req),
   user_agent: req.headers['user-agent'] ?? '',
   language: req.headers['accept-language']?.split(/[,;]/)[0] ?? ''
})

const forward = async hit => {
   const response = await fetch(`${process.env.GOATCOUNTER_URL}/api/v0/count`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.GOATCOUNTER_TOKEN}`
      },
      body: JSON.stringify({ hits: [hit] })
   })
   if (!response.ok) {
      console.error(`GoatCounter responded ${response.status}: ${await response.text()}`)
   }
}

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).end()
   }
   if (!sameOrigin(req)) {
      return res.status(403).end()
   }
   if (typeof req.query.p !== 'string' || !req.query.p) {
      return res.status(400).end()
   }

   if (process.env.GOATCOUNTER_URL && process.env.GOATCOUNTER_TOKEN) {
      try {
         await forward(toHit(req))
      } catch (error) {
         console.error(`GoatCounter is unreachable: ${error.message}`)
      }
   }
   res.status(204).end()
}

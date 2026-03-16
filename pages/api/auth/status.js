import { parseCookies } from '../../../utils/auth'

export default function handler(req, res) {
   const configured = !!process.env.GITHUB_CLIENT_ID
   const cookies = parseCookies(req.headers.cookie)
   const authenticated = !!cookies.github_oauth_token

   res.json({ configured, authenticated })
}

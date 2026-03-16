export default function handler(req, res) {
   res.setHeader('Set-Cookie',
      'github_oauth_token=; Max-Age=0; Path=/; SameSite=Lax; Secure; HttpOnly')
   res.redirect('/')
}

import got from 'got'

export default async (req, res) => {

  const resp = await got.post(req.body.githubApiUrl, {
    headers: { Authorization: `Bearer ${req.body.githubApiToken}`},
    body: JSON.stringify({query: '{ viewer { login } }'})
  }).json()

  res.status(200).json({ resp })
}

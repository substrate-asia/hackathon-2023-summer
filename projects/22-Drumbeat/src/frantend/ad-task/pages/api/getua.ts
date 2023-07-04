// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ua: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ua = req.headers['user-agent'] || ''
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ ua })
}

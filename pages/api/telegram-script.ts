import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://telegram.org/js/telegram-web-app.js');
    const text = await response.text();
    
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch script' });
  }
}
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data', 'promocodes.json');

export default function handler(req, res) {
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    const codes = JSON.parse(file);

    if (codes.length === 0) {
      return res.status(200).json({ success: false, message: 'Промокоды закончились' });
    }

    const random = codes[Math.floor(Math.random() * codes.length)];

    res.status(200).json({ success: true, promo: random });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

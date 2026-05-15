import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { name, time, avatar } = req.body;

    // 1. Thêm người chơi vào Sorted Set (ZADD)
    // Redis tự động xử lý: Nếu tên đã tồn tại, nó chỉ cập nhật nếu điểm tốt hơn (nếu ta logic)
    await kv.zadd('leaderboard', { score: time, member: JSON.stringify({ name, avatar }) });

    // 2. Tự động xóa những người ngoài Top 100 (Dọn dẹp hệ thống)
    await kv.zremrangebyrank('leaderboard', 100, -1);

    return res.status(200).json({ success: true });
}
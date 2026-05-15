import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Lấy danh sách từ Redis: từ hạng 0 đến hạng 99
    const leaderboard = await kv.zrange('leaderboard', 0, 99, { withScores: true, rev: false });
    
    // Redis trả về mảng phẳng [member, score, member, score...], cần map lại
    const formatted = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
        const userData = JSON.parse(leaderboard[i]);
        formatted.push({ ...userData, time: leaderboard[i + 1] });
    }
    
    return res.status(200).json(formatted);
}

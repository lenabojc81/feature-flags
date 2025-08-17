import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));

const defaultFlags = {
    showStats: true,
    showBadges: true,
    showReminder: true
};

let flags = { ...defaultFlags };
try {
    if (process.env.FLAGS_JSON) {
        const parsed = JSON.parse(process.env.FLAGS_JSON);
        flags = { ...flags, ...parsed };
    }
} catch {
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/flags', (_req, res) => res.json(flags));

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`feature-flags listening on ${PORT}`));

import express from 'express';
import cors from 'cors';

const app = express();
// app.use(cors({ origin: ['http://localhost:3000','https://your-frontend.app'] }));
app.use(cors({ origin: '*' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

function yearBounds(y) { return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1) }; }
function weeksBetween(a, b) { return (b - a) / (1000 * 60 * 60 * 24 * 7); }

app.post('/goal-hints', (req, res) => {
    const body = req.body || {};
    const targetBooks = Number(body.targetBooks || 0);
    const completedBooks = Number(body.completedBooks || 0);
    const year = Number(body.year || new Date().getFullYear());

    const { start, end } = yearBounds(year);
    const now = new Date();
    const t = now < start ? start : now > end ? end : now;

    const elapsed = (t - start) / (end - start);           // 0..1
    const expected = targetBooks * elapsed;
    const behindBy = Math.max(0, Math.ceil(expected - completedBooks));
    const weeksLeft = Math.max(0.1, weeksBetween(t, end));  // avoid div-by-zero
    const toGo = Math.max(0, targetBooks - completedBooks);
    const pacePerWeek = Number((toGo / weeksLeft).toFixed(2));

    const status =
        completedBooks >= expected + 1 ? 'ahead' :
            completedBooks + 1 >= expected ? 'on_track' : 'behind';

    const daysLeft = Math.ceil((end - t) / (1000 * 60 * 60 * 24));
    const note =
        status === 'ahead' ? 'Nice — you are ahead of schedule.'
            : status === 'on_track' ? 'On track — keep your rhythm.'
                : `Behind by ~${behindBy} book(s). ~${pacePerWeek}/week hits the target.`;

    res.json({ status, pacePerWeek, daysLeft, behindBy, note });
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`feature-flags listening on ${PORT}`));

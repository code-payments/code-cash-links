import { Router } from "express";

const router = Router();
const queue = new Map<string, any>();
const valid = 1000 * 60 * 2;

const get_or_create = (id: string) => {
    let found = queue.get(id);

    if (!found) {
        const expiry = Date.now() + valid;
        found = { expiry, claimed: false };
        queue.set(id, found);

        setTimeout(() => { queue.delete(id); }, valid);
    }

    return found;
}

const consume = (id: string) => {
    const found = get_or_create(id);
    found.claimed = true;
}

router.get('/:id', (req, res, next) => {
    consume(req.params.id);
    res.redirect(302, 'https://www.getcode.com/download');
});

router.get('/:id/status', (req, res, next) => {
    const found = get_or_create(req.params.id);
    if (found.expiry < Date.now()) {
        res.json({ status: 'expired' });
    } else {
        res.json({ status: found.claimed ? 'completed' : 'pending' });
    }
})

export default router;
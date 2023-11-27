import express from "express";

const router = express.Router();

router.use('/app', express.static('public', { index: false, redirect: false  }));
router.get('/favicon.ico', (req, res) => { 
    res.sendFile('favicon.ico', { root: 'public' });
});

// Cashlinks frontend
router.get(/^\/(c|cash|kin|v1|1|_)\/(.*)/, (req, res, next) => {
    res.sendFile('index.html', { root: 'public' })
});

export default router;

import express from 'express';
const app = express();

// Aquí configuramos middlewares y rutas
app.get('/', (req, res) => {
    res.send('Hello from Express on Vercel!');
});

export default app;

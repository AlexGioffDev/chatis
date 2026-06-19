import express from 'express';
import authRouter from './routes/authRoutes.js';
import { checkSecret } from './middlewares/checkSecret.js';


const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    return res.json({ "status": "On" });
})

app.use(checkSecret)

app.use("/", authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
    if (err) throw err;

    console.log("Service AUTH is ON!");
});
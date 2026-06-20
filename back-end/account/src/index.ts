import express from "express"
import accountRoutes from "./routes/accountRoutes.js";
import { checkSecret } from "./middlewares/checkSecret.js";


const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    return res.json({ status: "Ok" });
})


app.use(checkSecret);


app.use("/", accountRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, (err) => {
    if (err) throw err;

    console.log("Service Account ON")
})
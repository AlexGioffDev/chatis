import express from "express";
import { GuestOnly } from "./middlewares/check.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { addInternalSecret } from "./middlewares/internalSecret.js";

const app = express();

app.get("/", async (req, res) => {
    const authRes = await fetch("http://auth-service:3001/health");

    return res.status(200).json({
        "server": "Up",
        "auth": authRes.ok ? "Up" : "Down"
    })
})

app.use("/api/v1/auth/sign-up", GuestOnly);
app.use("/api/v1/auth/sign-in", GuestOnly);

app.use("/api/v1/auth", addInternalSecret, createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "" }
}))


const PORT = 3000;

app.listen(PORT, (err) => {
    if (err) throw err;

    console.log("Server ON")
})
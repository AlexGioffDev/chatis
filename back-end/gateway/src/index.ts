import express from "express";
import { GuestOnly, isAuthenticated } from "./middlewares/check.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { addInternalSecret } from "./middlewares/internalSecret.js";

const app = express();

app.get("/health", async (req, res) => {
    const [authRes, accountRes] = await Promise.all([
        fetch("http://auth-service:3001/health"),
        fetch("http://account-service:3002/health")
    ]);

    return res.status(200).json({
        "server": "Up",
        "auth": authRes.ok ? "Up" : "Down",
        "account": accountRes.ok ? "Up" : "Down"
    })
})

app.use("/api/v1/auth/sign-up", GuestOnly);
app.use("/api/v1/auth/sign-in", GuestOnly);

app.use("/api/v1/auth", addInternalSecret, createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "" }
}))


app.use("/api/v1/account", addInternalSecret, isAuthenticated, createProxyMiddleware({
    target: "http://account-service:3002",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/account": "" }
}))


const PORT = 3000;

app.listen(PORT, (err) => {
    if (err) throw err;

    console.log("Server ON")
})
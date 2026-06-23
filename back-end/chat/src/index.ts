import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { checkSecret } from './middlewares/checkSecret.js'
import chatRouter from './routers/chatRouters.js'
import { handleSocket } from './controllers/socketControllers.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: { origin: "*" }
})

app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'Ok' }))

app.use(checkSecret)
app.use('/', chatRouter)

handleSocket(io)

const PORT = process.env.PORT || 3003
httpServer.listen(PORT, () => console.log('Chat Service ON'))
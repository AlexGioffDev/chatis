import { Socket, Server } from "socket.io";
import { prisma } from "../lib/prisma.js";

export const handleSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("Connected: ", socket.id);

        socket.on('join-chat', (chatId: number) => {
            socket.join(`chat-${chatId}`);
        })


        socket.on('send-message', async (data: {
            chatId: number,
            authorId: number,
            content: string
        }) => {
            try {
                // salva nel DB
                const message = await prisma.message.create({
                    data: {
                        chatId: data.chatId,
                        authorId: data.authorId,
                        content: data.content
                    }
                })

                // manda a tutti nella room
                io.to(`chat:${data.chatId}`).emit('new-message', message)

            } catch (error) {
                socket.emit('error', { message: 'Failed to send message' })
            }
        })

        socket.on('disconnect', () => {
            console.log('Disconnected:', socket.id)
        })
    })
}

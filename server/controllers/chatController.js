
import Chat from "../models/chat.js";

// API for creating new chat 
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chatData = {
            userId,
            messages: [],
            userName: req.user.name,
            name: "New Chat"
        }

        await Chat.create(chatData)
        res.json({ success: true, message: "Chat Created" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

// For getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        res.json({ success: true, chats })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}


// APi for deleting the chat
export const deleteChats = async (req, res) => {
    try {
        const userId = req.user._id
        const { chatId } = req.body
        await Chat.deleteOne({ _id: chatId, userId })
        res.json({ success: true, message: "Chat Deleted" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
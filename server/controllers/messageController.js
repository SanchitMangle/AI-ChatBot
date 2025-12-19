import axios from "axios";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import imagekit from "../config/imageKit.js";
import openai from "../config/openAI.js";

// Text-based AI chat controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        // check credit
        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You dont have enough credits to use this feature" })
        }
        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-flash-latest",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API controller to generate image
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        // check credit
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You dont have enough credits to use this feature" })
        }

        const { chatId, prompt, isPublished } = req.body
        // Find chats 
        const chat = await Chat.findOne({ userId, _id: chatId })
        // Push user message
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        // Incode the prompt
        const encodedPrompt = encodeURIComponent(prompt)

        // Construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_ENDPOINT_URL}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`

        // Trigger generation by fetching from imageKit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' })

        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`

        // Upload to imageKit media library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}
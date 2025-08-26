import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhook } from './controllers/webhooks.js'

// Initilize Express 
const app = express()

// DB connection
await connectDB(); 

// Stripe Webhooks
app.post('/api/stripe', express.raw({type:'application/json'}),stripeWebhook)

// Middleware 
app.use(cors());
app.use(express.json())

// Routes
app.get('/',(req,res)=>res.send("API WORKING"));
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

// PORT
const PORT = process.env.PORT || 3000

app.listen(PORT,()=>console.log(`Server is running on PORT : ${PORT}`));
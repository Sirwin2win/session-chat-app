const express = require('express')
const dotenv = require('dotenv').config()
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const connectDB = require('./config/db')
const UserRoutes = require('./routes/userRoute')
const ChatRoute = require('./routes/chatRoute')
const cors = require('cors')




const app = express()
connectDB()

app.use(express.json())
// app.use(cors())
app.use(cors({
  origin: 'https://ai-client-tan.vercel.app', // Replace with your actual frontend URL
  credentials: true
}));
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours    https://session-chat-app.onrender.com/
        httpOnly: true,
        //secure: 'false', // Use secure cookies in production
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax'
    }
}));
app.use('/api/auth',UserRoutes)
app.use('/',ChatRoute)

app.get('/',(req,res)=>{
    res.send('Hello AI')
})


const port = process.env.PORT || 7000

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})
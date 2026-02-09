const express = require('express')
const dotenv = require('dotenv').config()
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const connectDB = require('./config/db')
const UserRoutes = require('./routes/userRoute')
const ChatRoute = require('./routes/chatRoute')
const cors = require('cors')




const app = express()
app.set("trust proxy", 1);

connectDB()

app.use(express.json())
// app.use(cors())
app.use(cors({
  origin: 'https://ai-client-tan.vercel.app/', // Replace with your actual frontend URL
  credentials: true
}));
app.use(express.urlencoded({extended:false}))
// app.set("trust proxy", 1);

app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: true,
    sameSite: "none"
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
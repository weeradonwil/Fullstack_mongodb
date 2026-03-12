import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import conn from "./config/mongodb.js"
import authRoutes from "./route/authRoutes.js"
import dns from 'dns/promises';

dns.setServers(['8.8.8.8','1.1.1.1']);

const app = express()
const port = process.env.PORT || 4000

conn()


app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

// API
app.get('/', (req,res)=> res.send("API is Working."))
app.use("/api/auth", authRoutes)

app.listen(port, ()=> console.log(`Server started on PORT:${port}`))
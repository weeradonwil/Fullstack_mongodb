import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import conn from "./config/mongodb.js"

const app = express()
const port = process.env.port || 4000

conn

app.use(express())
app.use(cookieParser())
app.use(cors({credentials: true}))
app.get('/', (req,res)=> res.send("API is Working."))
app.listen(port, ()=> console.log(`Server started on PORT:${port}`))
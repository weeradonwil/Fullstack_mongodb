import mongoose from "mongoose";

const conn = async ()=> {
    mongoose.connection.on('connected', ()=>console.log('Database Connected'))
    
    await mongoose.connect(`${process.env.Mongo_url}`)
}

export default conn
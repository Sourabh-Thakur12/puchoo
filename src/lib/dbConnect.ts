import { promises } from "dns";
import mongoose from "mongoose";

type connectionObject= {
    isConneceted? : number
}

const connection: connectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConneceted){
        console.log("DB already connected")
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConneceted = db.connections[0].readyState

        console.log("DB has connected successfully");
        
    } catch (error) {
        console.log("DB connection failed: ", error);
        
        process.exit(1)       
    }
    
}

export default dbConnect
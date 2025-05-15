import mongoose, {Schema, Document, Mongoose} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
    
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    
    createdAt:{
        type:Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
   userName:string;
   email: string;
   password: string;
   verifyCode: string;
   vetifyCodeExpiry: Date;
   isVerified : Boolean;
   isAcceptingMessage:boolean;
   messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName:{
        type: String,
        required: [true, "Username is required"],
        trim:true,
        unique:true

    },

    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email"] // regex from regexr.com
    },

    password:{
        type: String,
        required:[true, "Incorrect Password"],
    },

    verifyCode:{
        type: String,
        required: [true, "Verification Code is required"],
   },

   vetifyCodeExpiry:{
    type: Date,
    required: [true, "Enter Correct Expiry code"],
   },
   isVerified:{
    type: Boolean,
    default: false
   },
   isAcceptingMessage:{
    type: Boolean ,
    default: false
   },

   messages: [MessageSchema],

   
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel
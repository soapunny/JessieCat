import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userLevel, userStatus } from "../names/names";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    githubId: {type: Number},
    avatarUrl: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    joinDate: {type: Date, required: true, default: Date.now},
    location: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'Like'}],
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
    status: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Status'},
    level: {type: String, required: true, default: userLevel.SILVER},
});
//**********TODO Status (member / manager)

userSchema.pre('save', async function() {
    //npm i bcrypt : install bcrypt to hash password
    //it protect hashed-password from "rainbow table" attack.
    if(this.isModified("password")){//Only when the passwor is modified.
        this.password = await bcrypt.hash(this.password, 5);
    }
});

userSchema.static("comparePassword", async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
});

userSchema.static("hashPassword", async (password) => {
    return await bcrypt.hash(password, 5);
});


const UserDBModel = mongoose.model('User', userSchema);

export default UserDBModel;
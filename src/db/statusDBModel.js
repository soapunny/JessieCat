import mongoose from "mongoose";
import { userStatus } from "../names/names";

const statusSchema = new mongoose.Schema({
    status: {type: String, required: true, default: userStatus.NORMAL},
    lastUpdatedDate: {type: Date, required: true, default: Date.now },
    dueDate: {type: Date, default: Date.now },
});


statusSchema.pre('save', async function(){
    this.status = userStatus.NORMAL;
    this.lastUpdatedDate = Date.now();
});

const StatusDBModel = mongoose.model('Status', statusSchema);

export default StatusDBModel;
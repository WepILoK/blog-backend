import mongoose from "mongoose";
import {IUserSchema} from "./User.js";

export interface IPostSchema extends mongoose.Document {
    title: string
    text: string
    imageUrl: string
    viewsCount: number
    user: IUserSchema
    tags: []
}

const PostSchema = new mongoose.Schema<IPostSchema>({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    imageUrl: String
}, {
    timestamps: true,
})

export default mongoose.model<IPostSchema>("Post", PostSchema)
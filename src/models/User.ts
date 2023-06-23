import mongoose from "mongoose";

export interface IUserSchema extends mongoose.Document {
    _doc?: any
    email: string
    fullName: string
    passwordHash: string
    avatarUrl: string
    timestamps: any
}

const UserSchema = new mongoose.Schema<IUserSchema>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String
}, {
    timestamps: true,
})

export default mongoose.model<IUserSchema>("User", UserSchema)
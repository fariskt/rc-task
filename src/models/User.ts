import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

export interface IUser {
    _id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        _id: {
            type: String,
            default: () => randomUUID(), //for uuid
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

export interface IProduct {
    _id: string;
    userId: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        _id: {
            type: String,
            default: () => randomUUID(),
        },

        userId: {
            type: String,
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
    img: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false

    },
},
    { timestamps: true }
)

export default mongoose.model("Post", postSchema)
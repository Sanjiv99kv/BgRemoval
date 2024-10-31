import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(`${process.env.MONGODB_URI}/BgRemoval`)
        .then(() => console.log('Connected!'))
        .catch((err) => {
            console.log(err);
        })
}


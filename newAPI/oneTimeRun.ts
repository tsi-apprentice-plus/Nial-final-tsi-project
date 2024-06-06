// convert all password to hash
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./src/schemas/usersSchema";
import { env } from "process";

async function main() {
    const mongoUri = env.MONGO_URI || "mongodb://localhost:27017/socialAPI";
    await mongoose.connect(mongoUri);
    console.log("Connected to database");
    const users = await User.find();
    for (const user of users) {
        console.log("Converting user: ", user);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log("Converted password: ", hashedPassword);
        user.password = hashedPassword;
        const newPass = await user.save();
        console.log("New user: ", newPass);
    }
}
try {
    main();
}
catch (e) {
    console.log("Error: ", e);
}
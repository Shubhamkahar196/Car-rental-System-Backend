import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDb, initializeDb } from "./config/db.js";
import SignUpRouter from './routes/auth.routes.js'
const app = express();

app.use(express.json());

await connectDb();
await initializeDb();

app.use("/api/auth",SignUpRouter);

app.listen(5000, () => {
    console.log(`Server is running on PORT 5000`);
});

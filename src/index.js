import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDb, initializeDb } from "./config/db.js";
import SignUpRouter from './routes/auth.routes.js'
import loginRouter from './routes/auth.routes.js'
import createBookingRouter from './routes/booking.routes.js'
import getBookingRouter from './routes/booking.routes.js'
import updateBookingRouter from './routes/booking.routes.js'
import deleteBookingRouter from './routes/booking.routes.js'

const app = express();

app.use(express.json());

await connectDb();
await initializeDb();

app.use("/api/auth",SignUpRouter);
app.use("/api/auth",loginRouter);
app.use("/api/booking",createBookingRouter);
app.use("/api/booking",getBookingRouter);
app.use("/api/booking",updateBookingRouter);
app.use("/api/booking",deleteBookingRouter);


app.listen(5000, () => {
    console.log(`Server is running on PORT 5000`);
});

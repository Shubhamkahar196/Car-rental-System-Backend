import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

const pgClient = new Client({
    connectionString
})

const connectDb = async () => {
    try {
        await pgClient.connect();
        console.log("Connected to database");
    } catch (err) {
        console.error("Connection error", err.stack);
        process.exit(1);
    }
};

export { pgClient, connectDb };

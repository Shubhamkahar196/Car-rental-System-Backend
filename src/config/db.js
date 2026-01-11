import { Client } from "pg";

let pgClient;

const connectDb = async () => {
  try {
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pgClient.connect();
    console.log("Connected to Neon DB ");
  } catch (err) {
    console.error("Neon DB connection error ");
    console.error(err);
    process.exit(1);
  }
};

const initializeDb = async () => {
  if (!pgClient) {
    throw new Error("Database not connected. Call connectDb first.");
  }

  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      car_name VARCHAR(100) NOT NULL,
      days INT NOT NULL CHECK (days > 0 AND days < 365),
      rent_per_day INT NOT NULL CHECK (rent_per_day > 0 AND rent_per_day <= 2000),
      status VARCHAR(20) NOT NULL CHECK (status IN ('booked', 'completed', 'cancelled')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `;

  try {
    await pgClient.query(schema);
    console.log("Database schema initialized successfully");
  } catch (err) {
    console.error("Error initializing database schema:", err);
    throw err;
  }
};

export { pgClient, connectDb, initializeDb };

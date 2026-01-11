import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pgClient } from "../config/db.js";

// signup

export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Invalid inputs",
    });
  }

  try {
    const userExists = await pgClient.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pgClient.query(
      "INSERT INTO users (username,password) VALUES ($1,$2) RETURNING id",
      [username, hashedPassword]
    );

    res.status(201).json({
      success: true,
      data: {
        message: "User created Successfully",
        userId: result.rows[0].id,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "server error" });
  }
};

// login

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs",
    });
  }

  try {
    const result = await pgClient.query(
      "SELECT id,password FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "User does not exist",
      });
    }
      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          error: "incorrect password",
        });
      }

      const token = jwt.sign({
        userId: user.id,
        username: username
      },
      process.env.JWT_SECRET,
      {expiresIn: "1d"});

    res.status(200).json({
        success: true,
        data: {
            message: "Login successfully",
            token
        }
    })

  } catch (error) {
    res.status(500).json({ success: false, error: "server error" });
  }
};

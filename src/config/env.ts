import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  DATABASE_URL: process.env.DATABASE_URL!,

  JWT_SECRET:
    process.env.JWT_SECRET || "portfolio_super_secret_key",

  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as string,
};
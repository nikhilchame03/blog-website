import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.route("/api/v1/user",userRouter);
app.route("api/v1/blog",blogRouter);



export default app;

//postgresql://Testing_owner:M5kCdZpAcI7J@ep-proud-shape-a5wk1tkp.us-east-2.aws.neon.tech/Testing?sslmode=require
//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZmJhMGRmNWItZWYzNi00Njk2LWE0ZjEtYjFmYzY0ZDE1YmY3IiwidGVuYW50X2lkIjoiNTMxY2EyZDUwMDljZDVlMDAwYzI0Yjk0ZWI2Y2U4YzUxYjMzNWIzYzUyMDc1M2JkNjkyMTcxZDU3MTRjZmFiNiIsImludGVybmFsX3NlY3JldCI6ImQ0N2Q2YWVlLTAxMjYtNDc4Zi1iNjIxLWY3YjgwZWQxYmY4MCJ9.OS6y6OQPHHTsa8b6xGX0e-jL1XvHfZfYWdIaYgRXGls"

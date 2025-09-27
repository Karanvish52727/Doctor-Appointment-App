import dotenv from "dotenv";
dotenv.config();

import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

connectDB();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
//for user
app.use("/api/v1/user", userRoutes);

//for admin
app.use("/api/v1/admin", adminRoutes);

// //for doctor
app.use("/api/v1/doctor", doctorRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} Mode on port ${port}`.bgCyan
      .white
  );
});

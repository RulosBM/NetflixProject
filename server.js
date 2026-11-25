import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/database.js";
import { configurePassport } from "./middlewares/authMiddleware.js";

import movieRoutes from "./routes/movieRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport initialization
app.use(passport.initialize());
configurePassport();

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Root route check
app.get("/", (req, res) => {
  res.send("API StreamFlix funcionando correctamente.");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Puerto ${PORT} en uso. Asegúrate de cerrar otras instancias de Node.`);
  } else {
    console.error("Error en servidor:", err.message);
  }
});

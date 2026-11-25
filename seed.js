import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Movie from "./models/Movie.js";
import { defaultCategories, defaultMovies } from "./data/seedData.js";

dotenv.config();

const seedDB = async () => {
  try {
    if (!process.env.URI_LINK) {
      console.error("Error: URI_LINK no está definido en el archivo .env.");
      process.exit(1);
    }

    console.log("Conectando a MongoDB para poblar datos...");
    await mongoose.connect(process.env.URI_LINK, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB conectado correctamente.");

    await Category.deleteMany({});
    await Movie.deleteMany({});

    const createdCategories = await Category.insertMany(
      defaultCategories.map((c) => ({ name: c.name }))
    );
    console.log(`✓ ${createdCategories.length} categorías creadas.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    const moviesToInsert = defaultMovies.map((movie) => ({
      title: movie.title,
      description: movie.description,
      coverImg: movie.coverImg,
      bannerImg: movie.bannerImg,
      videoUrl: movie.videoUrl,
      duration: movie.duration,
      releaseYear: movie.releaseYear,
      category: categoryMap[movie.category.name],
    }));

    const createdMovies = await Movie.insertMany(moviesToInsert);
    console.log(`✓ ${createdMovies.length} películas de prueba insertadas.`);

    console.log("Base de datos poblada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error al poblar la base de datos:", error.message);
    console.log("💡 Si no tienes MongoDB local instalado, crea una base de datos gratuita en MongoDB Atlas y pon la URI en backend/.env");
    process.exit(1);
  }
};

seedDB();

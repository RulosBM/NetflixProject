import Movie from "../models/Movie.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import { defaultMovies, defaultCategories } from "../data/seedData.js";

// Lista mutable en memoria para fallback
let memoryMovies = JSON.parse(JSON.stringify(defaultMovies));

// GET /api/movies
export const getMovies = async (req, res) => {
  try {
    const { title, category, page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (title) {
        query.title = { $regex: title, $options: "i" };
      }

      if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = category;
        } else {
          // Si pasan el nombre de categoría ("Acción"), buscamos la categoría
          const foundCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
          if (foundCategory) {
            query.category = foundCategory._id;
          } else {
            query.category = null;
          }
        }
      }

      const skip = (pageNum - 1) * limitNum;

      const movies = await Movie.find(query)
        .populate("category")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const total = await Movie.countDocuments(query);

      return res.json({
        movies,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        total,
      });
    }

    // Fallback en memoria si MongoDB no está conectado
    let filtered = [...memoryMovies];

    if (title) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((m) => {
        if (!m.category) return false;
        if (typeof m.category === "object") {
          return (
            m.category._id === category ||
            m.category.name.toLowerCase() === category.toLowerCase()
          );
        }
        return m.category === category;
      });
    }

    const total = filtered.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    res.json({
      movies: paginated,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener películas", error: error.message });
  }
};

// GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de película inválido" });
      }

      const movie = await Movie.findById(id).populate("category");
      if (!movie) {
        return res.status(404).json({ message: "Película no encontrada" });
      }

      return res.json(movie);
    }

    // Memoria
    const movie = memoryMovies.find((m) => m._id === id);
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la película", error: error.message });
  }
};

// POST /api/movies
export const createMovie = async (req, res) => {
  try {
    const { title, description, coverImg, bannerImg, videoUrl, duration, releaseYear, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Título, descripción y categoría son requeridos" });
    }

    if (mongoose.connection.readyState === 1) {
      const movie = new Movie({
        title,
        description,
        coverImg,
        bannerImg,
        videoUrl,
        duration,
        releaseYear,
        category,
      });

      const savedMovie = await movie.save();
      const populatedMovie = await Movie.findById(savedMovie._id).populate("category");
      return res.status(201).json(populatedMovie);
    }

    // Memoria
    const matchedCategory = defaultCategories.find(
      (c) => c._id === category || c.name.toLowerCase() === (category.name || category).toLowerCase()
    ) || { _id: category, name: "General" };

    const newMovie = {
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      description,
      coverImg: coverImg || "",
      bannerImg: bannerImg || "",
      videoUrl: videoUrl || "",
      duration: duration || 120,
      releaseYear: releaseYear || 2024,
      category: matchedCategory,
      createdAt: new Date().toISOString(),
    };

    memoryMovies.unshift(newMovie);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: "Error al crear película", error: error.message });
  }
};

// PUT /api/movies/:id
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de película inválido" });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      }).populate("category");

      if (!updatedMovie) {
        return res.status(404).json({ message: "Película no encontrada" });
      }

      return res.json(updatedMovie);
    }

    // Memoria
    const movieIndex = memoryMovies.findIndex((m) => m._id === id);
    if (movieIndex === -1) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    memoryMovies[movieIndex] = { ...memoryMovies[movieIndex], ...req.body };
    res.json(memoryMovies[movieIndex]);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar película", error: error.message });
  }
};

// DELETE /api/movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de película inválido" });
      }

      const deletedMovie = await Movie.findByIdAndDelete(id);
      if (!deletedMovie) {
        return res.status(404).json({ message: "Película no encontrada" });
      }

      return res.json({ message: "Película eliminada correctamente" });
    }

    // Memoria
    const movieIndex = memoryMovies.findIndex((m) => m._id === id);
    if (movieIndex === -1) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    memoryMovies.splice(movieIndex, 1);
    res.json({ message: "Película eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar película", error: error.message });
  }
};

// Exportar acceso a memoryMovies para usar en MyList
export const getMemoryMovieById = (id) => memoryMovies.find((m) => m._id === id);

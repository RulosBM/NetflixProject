import Category from "../models/Category.js";
import mongoose from "mongoose";
import { defaultCategories } from "../data/seedData.js";

// Copia mutable en memoria cuando MongoDB no esté conectado
let memoryCategories = JSON.parse(JSON.stringify(defaultCategories));

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find().sort({ name: 1 });
      return res.json(categories);
    }
    // Fallback en memoria si la BD no está conectada
    res.json(memoryCategories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    if (mongoose.connection.readyState === 1) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "La categoría ya existe" });
      }

      const category = new Category({ name });
      const savedCategory = await category.save();
      return res.status(201).json(savedCategory);
    }

    // Memoria
    const exists = memoryCategories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const newCat = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    memoryCategories.push(newCat);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ message: "Error al crear categoría", error: error.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de categoría inválido" });
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name: req.body.name },
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      return res.json(updatedCategory);
    }

    // Memoria
    const cat = memoryCategories.find((c) => c._id === id);
    if (!cat) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    cat.name = req.body.name || cat.name;
    res.json(cat);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar categoría", error: error.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de categoría inválido" });
      }

      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      return res.json({ message: "Categoría eliminada correctamente" });
    }

    // Memoria
    const index = memoryCategories.findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    memoryCategories.splice(index, 1);
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría", error: error.message });
  }
};

import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import { getMemoryMovieById } from "./movieController.js";

const memoryUsers = [];

export const getMemoryUserById = (id) => {
  return memoryUsers.find((u) => u._id === id || u.id === id);
};

const signupSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
  }),
  lastName: Joi.string().trim().required().messages({
    "string.empty": "El apellido es obligatorio",
    "any.required": "El apellido es obligatorio",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Debe ingresar un email válido",
    "string.empty": "El email es obligatorio",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "Debe ingresar un email válido",
    "string.empty": "El email es obligatorio",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es obligatoria",
  }),
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_streamflix_key_2026", {
    expiresIn: "7d",
  });
};

// POST /api/users/signup
export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, lastName, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const user = await User.create({
        name,
        lastName,
        email: normalizedEmail,
        password,
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          myList: user.myList,
        },
      });
    }

    // Memoria
    const existsInMemory = memoryUsers.some((u) => u.email === normalizedEmail);
    if (existsInMemory) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = new mongoose.Types.ObjectId().toString();

    const memoryUser = {
      _id: newUserId,
      id: newUserId,
      name,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
      myList: [],
    };

    memoryUsers.push(memoryUser);
    const token = generateToken(memoryUser._id);

    res.status(201).json({
      token,
      user: {
        id: memoryUser._id,
        name: memoryUser.name,
        lastName: memoryUser.lastName,
        email: memoryUser.email,
        avatarUrl: memoryUser.avatarUrl,
        myList: memoryUser.myList,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// POST /api/users/signin
export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = generateToken(user._id);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          myList: user.myList,
        },
      });
    }

    // Memoria
    const user = memoryUsers.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        myList: user.myList,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).select("-password").populate({
        path: "myList",
        populate: { path: "category" },
      });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json(user);
    }

    // Memoria
    const user = getMemoryUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const populatedList = (user.myList || [])
      .map((item) => (typeof item === "object" ? item : getMemoryMovieById(item)))
      .filter(Boolean);

    res.json({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      myList: populatedList,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};

// GET /api/users/mylist
export const getMyList = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).populate({
        path: "myList",
        populate: { path: "category" },
      });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json(user.myList);
    }

    // Memoria
    const user = getMemoryUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const populatedList = (user.myList || [])
      .map((item) => (typeof item === "object" ? item : getMemoryMovieById(item)))
      .filter(Boolean);

    res.json(populatedList);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener Mi Lista", error: error.message });
  }
};

// POST /api/users/mylist/:movieId
export const addToMyList = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const alreadyAdded = user.myList.some((id) => id.toString() === movieId);
      if (alreadyAdded) {
        return res.status(400).json({ message: "La película ya está en tu lista" });
      }

      user.myList.push(movieId);
      await user.save();

      const updatedUser = await User.findById(userId).populate({
        path: "myList",
        populate: { path: "category" },
      });

      return res.json(updatedUser.myList);
    }

    // Memoria
    const user = getMemoryUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const alreadyAdded = user.myList.some((item) =>
      typeof item === "object" ? item._id === movieId : item === movieId
    );

    if (alreadyAdded) {
      return res.status(400).json({ message: "La película ya está en tu lista" });
    }

    const movie = getMemoryMovieById(movieId) || { _id: movieId };
    user.myList.push(movie);

    const populatedList = user.myList
      .map((item) => (typeof item === "object" ? item : getMemoryMovieById(item)))
      .filter(Boolean);

    res.json(populatedList);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar a Mi Lista", error: error.message });
  }
};

// DELETE /api/users/mylist/:movieId
export const removeFromMyList = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      user.myList = user.myList.filter((id) => id.toString() !== movieId);
      await user.save();

      const updatedUser = await User.findById(userId).populate({
        path: "myList",
        populate: { path: "category" },
      });

      return res.json(updatedUser.myList);
    }

    // Memoria
    const user = getMemoryUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.myList = user.myList.filter((item) =>
      typeof item === "object" ? item._id !== movieId : item !== movieId
    );

    const populatedList = user.myList
      .map((item) => (typeof item === "object" ? item : getMemoryMovieById(item)))
      .filter(Boolean);

    res.json(populatedList);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar de Mi Lista", error: error.message });
  }
};

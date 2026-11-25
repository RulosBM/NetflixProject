import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImg: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 120,
    },
    releaseYear: {
      type: Number,
      default: 2024,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;

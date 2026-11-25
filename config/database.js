import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.URI_LINK) {
      console.error("Error al conectar MongoDB: URI_LINK no está definido en .env");
      return null;
    }

    const conn = await mongoose.connect(process.env.URI_LINK, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB conectado correctamente: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error al conectar MongoDB: ${error.message}`);
    console.log("💡 Sugerencia: Puedes usar MongoDB Atlas gratuito configurando URI_LINK=mongodb+srv://... en tu archivo backend/.env");
    console.log("ℹ️  El servidor Express permanecerá activo atendiendo peticiones.");
    return null;
  }
};

export default connectDB;

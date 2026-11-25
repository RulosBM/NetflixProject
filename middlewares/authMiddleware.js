import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";
import User from "../models/User.js";
import { getMemoryUserById } from "../controllers/userController.js";

export const configurePassport = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "super_secret_streamflix_key_2026",
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        if (mongoose.connection.readyState === 1) {
          const user = await User.findById(jwt_payload.id).select("-password");
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        }

        // Fallback en memoria si MongoDB aún no está conectado
        const memoryUser = getMemoryUserById(jwt_payload.id);
        if (memoryUser) {
          return done(null, memoryUser);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export const protect = passport.authenticate("jwt", { session: false });

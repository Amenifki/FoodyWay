import { Router } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { sample_users } from "../data";
import { UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

dotenv.config(); // Assure que les variables d'environnement sont chargées

const router = Router();

// Seeder: Ajouter des utilisateurs par défaut si la BDD est vide
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed is done!");
  })
);

// Connexion utilisateur
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
  })
);

// Inscription utilisateur
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(HTTP_BAD_REQUEST).send("User already exists, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    });

    const dbUser = await newUser.save();
    res.send(generateTokenResponse(dbUser));
  })
);

// Fonction pour générer un token JWT
const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;

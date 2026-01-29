import express from "express";
import { login, register } from "../controllers/auth.controller.js";

export const authRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Ro'yhatdan o'tish va kirish operatsiyalari
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yhatdan o'tishi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Ro'yhatdan o'tish muvaffaqiyatli
 *       400:
 *         description: Validation error yoki foydalanuvchi allaqachon mavjud
 */
authRoutes.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Kirish muvaffaqiyatli, token qaytariladi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kirish muvaffaqiyatli
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Parol yoki email noto'g'ri
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
authRoutes.post("/login", login);

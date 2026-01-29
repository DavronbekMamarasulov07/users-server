// import { Router } from "express";
// import { changePassword, changeRole, createUser, deleteUser, getAllUsers, getMe, updateUser } from "../controllers/user.controller.js";
// import { authMiddleware } from "../middleware/auth.middleware.js";
// import roleMiddleware from "../middleware/role.middleware.js";

// const userRoutes = Router();

// userRoutes.post("/", createUser);
// userRoutes.get("/", authMiddleware, getAllUsers);
// userRoutes.get("/me", authMiddleware, getMe);
// userRoutes.put(
//   "/change-role/:id",
//   authMiddleware,
//   roleMiddleware(["admin", "super_admin"]),
//   changeRole,
// );
// userRoutes.put("/change-password", authMiddleware, changePassword);
// userRoutes.put("/:id", authMiddleware, updateUser);
// userRoutes.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware(["admin", "mentor", "super_admin"]),
//   deleteUser,
// );



// export default userRoutes;


import { Router } from "express";
import {
  changePassword,
  changeRole,
  createUser,
  deleteUser,
  getAllUsers,
  getMe,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Foydalanuvchi CRUD operatsiyalari
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Yangi foydalanuvchi yaratish
 *     tags: [Users]
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
 *         description: Foydalanuvchi yaratildi
 *       400:
 *         description: Validation error
 */
userRoutes.post("/", createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 *       404:
 *         description: Foydalanuvchilar topilmadi
 */
userRoutes.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Login qilgan foydalanuvchi ma'lumotini olish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari
 */
userRoutes.get("/me", authMiddleware, getMe);

/**
 * @swagger
 * /users/change-role/{id}:
 *   put:
 *     summary: Foydalanuvchi rolini o'zgartirish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, mentor, super_admin, student, user]
 *                 example: mentor
 *     responses:
 *       200:
 *         description: Role muvaffaqiyatli o'zgartirildi
 *       400:
 *         description: Super admin o'z rolini o'zgartira olmaydi
 *       403:
 *         description: Super admin boshqa super adminni pastga tushira olmaydi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
userRoutes.put(
  "/change-role/:id",
  authMiddleware,
  roleMiddleware(["admin", "super_admin"]),
  changeRole,
);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Foydalanuvchi parolini o'zgartirish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword456
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 *       400:
 *         description: Validation error
 */
userRoutes.put("/change-password", authMiddleware, changePassword);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Foydalanuvchi ma'lumotlarini yangilash
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foydalanuvchi yangilandi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
userRoutes.put("/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Foydalanuvchini o'chirish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Foydalanuvchi o'chirildi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
userRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "mentor", "super_admin"]),
  deleteUser,
);

export default userRoutes;

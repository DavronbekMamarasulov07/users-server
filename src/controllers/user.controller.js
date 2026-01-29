import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  const { firstName, lastName, password, email } = req.body;
  if (
    !firstName ||
    firstName.trim() == "" ||
    !lastName ||
    lastName.trim() == "" ||
    !email ||
    email.trim() == "" ||
    !password ||
    password.trim() == ""
  ) {
    return res.status(400).json({
      message: "Barcha maydonlar to'ldirilishi shart!",
    });
  }

  // 🔹 email format tekshiruvi
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email noto‘g‘ri formatda!" });
  }

  // 🔹 password tekshiruvi: kamida 6 ta belgi, raqam va katta harf tavsiya qilinadi
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password kamida 6 ta belgidan iborat bo‘lishi, kamida 1 katta harf va 1 raqam bo‘lishi kerak!",
    });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist)
      return res
        .status(400)
        .json({ message: "Foydalanuvchi allaqachon mavjud!" });

    await User.create({
      firstName,
      lastName,
      password,
      email,
    });

    res.status(201).json({
      message: "Yangi foydalanuvchi muvaffaqiyatli qo'shildi.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};;

const getMe = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    //   .select(
    //   "firstName lastName email isActive role createdAt updatedAt",
    // );  faqat keraklilar
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true },
    ).select("firstName lastName email");

    if (!updatedUser) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.json({ message: "Yangilandi!", data: updatedUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json({ message: "Foydalanuvchi o'chirildi" });
  } catch (error) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};

const getAllUsers = async (_, res) => {
  try {
    const users = await User.find();

    if (!users)
      return res.status(404).json({ message: "Foydalanuvchilar topilmadi." });

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || !currentPassword)
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to'ldirilishi shart!" });

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Eski parol noto'g'ri" });
    }

    user.password = newPassword; // plain password
    await user.save();
    res.json({ message: "Parol muvaffaqiyatli yangilandi" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
};

const changeRole = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    const targetUser = await User.findById(id);
    const { role } = req.body;

    if (currentUser.role === "super_admin" && currentUser._id.toString() === id)
      return res
        .status(400)
        .json({ message: "Super admin o'z rolini almashtira olmaydi." });

    if (
      currentUser.role === "super_admin" &&
      targetUser.role === "super_admin" &&
      role !== "super_admin"
    ) {
      return res.status(403).json({
        message: "Super admin boshqa super adminni pastga tushira olmaydi.",
      });
    }

    console.log(role)
    // Agar role admin, mentor yoki super_admin bo'lsa, isFrozen va balance maydonlarini olib tashlaymiz
    let updateData = { role };
    if (["admin", "mentor", "super_admin"].includes(role)) {
        updateData = {
        role,
        $unset: { isFrozen: "", balance: "" }, // Maydonlar butunlay olib tashlanadi
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
         updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi." });

    res.status(200).json({
      message: "Foydalanuvchi role muvaffaqiyatli yangilandi.",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: `Serverda kutilmagan xatolik: ${err.message}` });
  }
  
}




export {
  createUser,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
  changeRole,
};

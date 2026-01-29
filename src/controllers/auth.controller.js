import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const register = async (req, res, next) => {
  try {
      const { firstName, lastName, password, email } = req.body;

       if (!firstName || !lastName || !email || !password) {
         return res.status(400).json({
           message: "Barcha maydonlar to'ldirilishi shart!",
         });
       }
      
      const exist = await User.findOne({ email })
      if (exist) {
          return res.status(400).json({ message: "Foydalanuvchi allaqachon mavjud!" });
      }

      await User.create({
        firstName,
        lastName,
        password,
        email,
      });

      res.status(201).json({
        message: "Ro'yhatdan o'tish muvaffaqiyatli amalga oshirildi.",
      });


  } catch (error) {
      console.log(error)
    res.status(500).send(`Serverda xatolik: ${error} `);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // select orqali passwordni olib keldik serverdan
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Parol yoki email noto'g'ri kiritildi!" });
    
     const token = jwt.sign({ _id: user._id, role: user.role}, SECRET_KEY, {
       expiresIn: EXPIRES_IN,
     });
     res.status(200).json({ message: "Kirish muvaffaqiyatli", token });
    
  } catch (error) {
    console.log(error);
    res.status(500).send(`Serverda xatolik: ${error} `);
  }
}


export { register, login }
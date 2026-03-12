import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../config/nodemailer.js";

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่ โดยรับข้อมูลจากคำขอ (request) และส่งผลลัพธ์กลับไปยังผู้ใช้ (response)
export const register = async (req, res) => {
    const { name, email, password } = req.body;
// ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลครบถ้วนหรือไม่ หากไม่ครบถ้วนจะส่งข้อความแจ้งเตือนกลับไป
    if (!name || !email || !password) {
        // หากข้อมูลไม่ครบถ้วน จะส่งผลลัพธ์เป็น JSON ที่มีสถานะความสำเร็จเป็น false และข้อความแจ้งเตือนให้กรอกข้อมูลให้ครบถ้วน
        return res.json({success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน"});
    }

    try {
        // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่ หากมีจะส่งข้อความแจ้งเตือนกลับไป
        // หากมีผู้ใช้ที่มีอีเมลนี้อยู่แล้ว จะส่งผลลัพธ์เป็น JSON ที่มีสถานะความสำเร็จเป็น false และข้อความแจ้งเตือนว่าอีเมลนี้ถูกใช้งานแล้ว
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            // หากมีผู้ใช้ที่มีอีเมลนี้อยู่แล้ว จะส่งผลลัพธ์เป็น JSON ที่มีสถานะความสำเร็จเป็น false และข้อความแจ้งเตือนว่าอีเมลนี้ถูกใช้งานแล้ว
            return res.json({success: false, 
                message: "อีเมลนี้ถูกใช้งานแล้ว"});
        }
        
        // หากไม่มีผู้ใช้ที่มีอีเมลนี้อยู่แล้ว จะทำการแฮชรหัสผ่านและสร้างผู้ใช้ใหม่ในฐานข้อมูล
        // สร้างผู้ใช้ใหม่โดยใช้โมเดล userModel และบันทึกข้อมูลลงในฐานข้อมูล
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
        await newUser.save()

        // สร้างโทเค็น JWT สำหรับ user โดยใช้ไอดีของผู้ใช้และความลับที่กำหนดในตัวแปรสภาพแวดล้อม (environment variable) และกำหนดเวลาหมดอายุของโทเค็นเป็น 1 วัน
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {
            httpOnly: true, // ทำให้คุกกี้ไม่สามารถเข้าถึงได้จาก JavaScript เพื่อเพิ่มความปลอดภัย
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 วัน
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'ยินดีต้อนรับสู่เว็บไซต์ของเรา',
            text: `บัญชีของคุณได้ถูกสร้างขึ้นด้วยอีเมล: ${email}`
        }
        //คำสั่งการส่งอีเมล รอจนกว่าจะสำเร็จ
        await transporter.sendMail(mailOptions) 
        
        return res.json({success: true})

        return res.json({
            success: true,
            message: "ลงทะเบียนสำเร็จ",
            user: {name: newUser.name, email: newUser.email}
        });
    } catch (error) {
        // หากเกิดข้อผิดพลาดในกระบวนการลงทะเบียน จะส่งผลลัพธ์เป็น JSON ที่มีสถานะความสำเร็จเป็น false และข้อความแจ้งเตือนข้อผิดพลาด
        res.json({
            success: false,
            message: error.message // ส่งข้อความข้อผิดพลาดกลับไปยังผู้ใช้
           });
    }
}

// ฟังก์ชันสำหรับการเข้าสู่ระบบของผู้ใช้ โดยรับข้อมูลจากคำขอ (request) และส่งผลลัพธ์กลับไปยังผู้ใช้ (response)
export const login = async (req, res) => {
    // ดึงข้อมูลอีเมลและรหัสผ่านจากคำขอ (request) ที่ผู้ใช้ส่งมา
    // ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลครบถ้วนหรือไม่ หากไม่ครบถ้วนจะส่งข้อความแจ้งเตือนกลับไป
    const { email, password } = req.body;
    if (!email || !password) {
        // หากข้อมูลไม่ครบถ้วน จะส่งผลลัพธ์เป็น JSON ที่มีสถานะความสำเร็จเป็น false และข้อความแจ้งเตือนให้กรอกข้อมูลให้ครบถ้วน
        return res.json({
            success: false, 
            message: "กรุณากรอกข้อมูลให้ครบถ้วน"});
    }

    try {

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: "ข้อมูลไม่ถูกต้อง"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({success: false, message: "ข้อมูลไม่ถูกต้อง"});
        }
 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", token, {

            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true,message: "เข้าสู่ระบบสำเร็จ",});

    } catch (error) {
        return res.json({success: false,message: error.message});
    }
}


export const logout = (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({success: true, message: "ออกจากระบบสำเร็จ"});
    }
    catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select('-password')

    if (!user) {
      return res.json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      })
    }

    return res.json({
      success: true,
      user
    })

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}
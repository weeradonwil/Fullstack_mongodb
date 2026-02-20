//authcontroller.js ย่อมากจาก authentication controller
//เป็นตัวจัดการเกี่ยวกับการยืนยันตัวตนของผู้ใช้ เช่น การลงทะเบีย การเข้าสู่ระบบ และการออกจากระบบ เป็นต้น

//นำเข้าไลบรารี jsonwebtoken ซึ่งใช้สำหรับการสร้างและตรวจสอบ token คืนที่ใช้ในการยืนยันตัวตนของผู้ใช้
//token เป็นสตริงที่ถูกสร้างขึ้นโดยเซิร์ฟเวอร์ และส่งกลับไปยังไคลเอนต์หลังจากที่ผู้ใช้เข้าสู่ระบบสำเร็จ
import { JsonWebTokenError } from 'jsonwebtoken'

//ขั้นตอนแรกคือการนำเข้าโมเดล user ซึ่งเป็นตัวแทนของผู้ใช้ในฐานข้อมูล
import userModel from '../models/userModel.js'

//นำเข้าไลบรารี bcryptjs ซึ่งใช้สำหรับการเข้ารหัสในส่วนของรหัสผ่านของผู้ใช้
import bcrypt from 'bcryptjs'


//ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่
export const register = async (req, res)=>{
    const {name, email, password} = req.body

    //ใช้ if statement เพื่อตรวจสอบว่าผู้ใช้กรอกข้อมูลได้ครบถ้วนหรือไม่
    //เครื่องหมาย ! หมายถึง "หรือ" ถ้าข้อมูลใดข้อมูลหนึ่งไม่ครบถ้วนก็จะส่งข้อความแจ้งเตือนกลับไปยังผู้ใช้
    if(!name || !email || !password){
        return res.json({success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน'})
    }
    try{
        //ใช้คำสั่ง findeOne เพื่อตรวยสอบว่ามีผู้ใช้ที่มีอีเมลเดียวกันในฐานข้อมูลหรือไม่
        //คำสั่ง await หมายถึงการรอผลลัพธ์จากคำสั่ง findOne ก่อนที่จำดำเนินการหรือไม่
        const existingUser = await userModel.findOne({email})
        
        if(existingUser){
            return res.json({success: falsse, message: "อีเมลนี้ถูกใช้งานแล้ว"})

        }
        //ใช้คำสั่ง hash ของ bcrypt เพื่อเข้ารหัสรหัสผ่านของผู้ใช้ก่อนที่จะเก็บลงในฐานข้อมูล
        //โดยใช้ salt rounds เป็น 10 ซึ่งเป็นค่าที่แนะนำสำหรับการเข้ารหัสรหัสผ่านที่ปลอดภัย
        //หากใช้ค่ามากเกินไปอาจทำให้กระบวนการช้าลง
        const hashedPassword = await bcrypt.hash(password, 10)

        //สร้างอินสแตนซ์ใหม่ของ userModel โดยส่งข้อมูลที่ได้รับจากผู้ใช้และรหัสผ่านที่เข้ารหัสผ่านแล้ว
        const user = new userModel({name, email, password: hashedPassword})
        await user.save //บันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล

        //สร้าง token สำหรับ user ที่เพิ่งลงทะเบียนสำเร็จ และเก็บไว้ในตัวแปร token
        //่ jwt.sign เป็นฟังก์ชันที่ใช้ในการสร้าง token โดยรับพารามิเตอร์ดังนี้
        // 1.payload ข้อมูลที่ต้องการเก็บใน token ในที่นี้คือ id ของผู้ใช้งาน
        // 2.secret คีย์ลับที่ใช้ในการเข้ารหัส token ซึ่งควรเก็บเป็นความลับและไม่ควรเปิดเผย
        // 3.options: ตัวเลือกเพ่มเติม เช่น expiresIn ที่กำหนดระยะเวลาหมดอายุของ token ในที่นี้กำหนดให้ 7 วัน
        const token = jwt.sign({id: user._id}, process.env.jwt_secret,{expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true, //ทำให้คุกกี้ไม่สามารถเข้าถึงได้จากฝั่งไคลเอนต์
            secure: process.env.node_env === 'production', //ทำให้คุกกี้ถูกส่งผ่านเฉพาะในโปรเซคชัน
            sameSite: process.env.node_env === 'production' ? 'none' : 'lax',
            maxAge: 7*28*60*60*1000 //กำหนดอายุของคุกกี้เป็น 7 วัน
        })

        return res.json({
            success: true, message: "ลงทะเบียสำเร็จแล้ว"})
        
    }
    catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async = async (res, req) =>{

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.node_env === 'production',
            sameSite: process.env.node_env === 'production' ? 'none' : 'lax',
        }) 
        return res.json({success: true, message: " ออกจากระบบ"})
    }catch (error){
        return res.json({success: false, message: error.message})
    }


}
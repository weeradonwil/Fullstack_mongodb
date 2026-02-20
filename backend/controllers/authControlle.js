//authcontroller.js ย่อมากจาก authentication controller
//เป็นตัวจัดการเกี่ยวกับการยืนยันตัวตนของผู้ใช้ เช่น การลงทะเบีย การเข้าสู่ระบบ และการออกจากระบบ เป็นต้น


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

        const user = new userModel({name, email, password: hashedPassword})
        await user.save
    }
    catch(error) {
        res.json({success: false, message: error.message})
    }
}
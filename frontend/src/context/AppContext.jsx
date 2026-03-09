import { createContext, useState } from "react";

// สร้าง Context สำหรับใช้แชร์ข้อมูลระหว่าง components
// เช่น login status, user data หรือ backend URL
export const AppContext = createContext();


// สร้าง Provider component
// Provider จะทำหน้าที่ครอบ component อื่น ๆ
// เพื่อให้ component ลูกสามารถเข้าถึงข้อมูลใน context ได้
export const AppContextProvider = (props) => {

    // ดึง URL ของ backend จากไฟล์ .env
    // เช่น http://localhost:4000
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // state สำหรับตรวจสอบว่าผู้ใช้ login อยู่หรือไม่
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // state สำหรับเก็บข้อมูลผู้ใช้ เช่น name email profile
    const [userData, setUserData] = useState(null);


    // object ที่จะส่งไปให้ทุก component ผ่าน Context
    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData
    };

    // Provider ใช้ครอบ components ทั้งหมด
    // เพื่อให้ component ลูกสามารถใช้ข้อมูลจาก Context ได้
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
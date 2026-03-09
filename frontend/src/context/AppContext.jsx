import { useContext } from "react";
//เราใช้ useContext ใน  react เพื่อส่งข้อมูลกันระหว่าง components เช่น หากมีข้อมูลอยู่ที่ component แม่ แล้ว component ลูกๆอยากใช้ข้อมูลนั้นๆ
//เราสามารถส่งข้อมูลไปยัง component ลูกๆได้ผ่าน useContext

export const AppContext = createContext()

const value = {
}

export const AppContextPravider = (props) => {
    return (
        <AppContext.Pravider value={value}> 
        {props.children}
        </AppContext.Pravider>
    )
}
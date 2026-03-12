import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()
  const [backendUrl, setIsLoggedIn, getUserData] = userContext().AppContext()

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('') //สร้าง state สำหรับเก็บค่า ชื่อ email รหัสผ่าน
  const [email, setEmail] = useState('')
  const [password, , setPassword] = useState('')
  const [IsSubmitting, setIsSubmitting] = useState(false)

const onSubmitHandler = async (e) => {
  e.preventDefault()

  try {
    setIsSubmitting(true)
    axios.defaults.withCredentials = true

    if (state === "Sign Up") {

      const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password
      })

      if (data.success) {
        toast.success("สมัครสมาชิกสำเร็จ")
        setIsLoggedIn(true)
        await getUserData()
        navigate("/member")
      }

    } else {

      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password
      })

      if (data.success) {
        toast.success("เข้าสู่ระบบสำเร็จ")
        setIsLoggedIn(true)
        await getUserData()
        navigate("/member")
      }

    }

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "เกิดปัญหาในการเชื่อมต่อกับ server"
    )

  } finally {
    setIsSubmitting(false)
  }
}



  return (
    <div className='flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400'>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full max-w-[400px] text-indigo-300 text-sm'>

      <p onClick={() => navigate('/')} className='cursor-pointer'>กลับหน้าแรก </p>

        <h2 className='text-3xl font-semibold text-white text-centor mb-3'>{state === 'Sign Up' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'กรุณากรอกข้อมูลเพื่อสมัครสมาชิก' : 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ'}</p>

        <form >
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <label className='text-gray-400'>ชื่อ-นามสกุล</label>
              <input
                onChange={e => setName(e.target.value)} //อัปเดต state เมื่อมีการกรอกฟิลด์
                value={name} //กำหนดค่า value ให้กับ ฟิลด์นี้
                className='bg-transparent outline-none' type="text" placeholder="ระบุชื่อ-นามสกุล" required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <label className='text-gray-400'>อีเมล</label>
            <input 
            onChange={e => setEame(e.target.value)}
                value={email}
            className='bg-transparent outline-none' type="email" placeholder="ระบุอีเมล" required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <label className='text-gray-400'>รหัสผ่าน</label>
            <input 
            onChange={e => setPassword(e.target.value)}
                value={password}
            className='bg-transparent outline-none' type="password" placeholder="ระบุรหัสผ่าน" required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 curser-pointer'>ลืมรหัสผ่าน</p>


          <button className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2.5 rounded-full hover:from-blue-600 hover:to-purple-600 mb-4'>
            {state === 'Sign Up' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>

          {state === 'Sign Up' ? (
            <p className='text-center text-sm text-gray-400'>
              มีบัญชีแล้ว? <span onClick={() => setState('Login')} className='text-indigo-500 cursor-pointer hover:text-indigo-300
              transition-all' >เข้าสู่ระบบ</span>
            </p >
          ) : (
            <p className='text-center text-sm text-gray-400'>
              ยังไม้มีบัญชี? <span onClick={() => setState('Sign Up')} className='text-indigo-500 cursor-pointer hover:text-indigo-300
              transition-all'>สมัครสมาชิก</span> </p>

          )}

        </form>

      </div>
    </div>
  )
}


export default Login
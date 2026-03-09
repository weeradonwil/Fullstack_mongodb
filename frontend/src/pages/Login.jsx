import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState('Sign Up')


  return (
    <div className='flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400'>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full max-w-[400px] text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-centor mb-3'>{state === 'Sign Up' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'กรุณากรอกข้อมูลเพื่อสมัครสมาชิก' : 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ'}</p>

        <form >
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-(#333ASC)'>
            <label className='text-gray-400'>ชื่อ-นามสกุล</label>
            <input className='bg-transparent outline-none' type="text" placeholder="ระบุชื่อ-นามสกุล" required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-(#333ASC)'>
            <label className='text-gray-400'>อีเมล</label>
            <input className='bg-transparent outline-none' type="email" placeholder="ระบุอีเมล" required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-(#333ASC)'>
            <label className='text-gray-400'>รหัสผ่าน</label>
            <input className='bg-transparent outline-none' type="password" placeholder="ระบุรหัสผ่าน" required />
          </div>

          <p className='mb-4 text-indigo-500 curser-pointer'>ลืมรหัสผ่าน</p>

          <button type='button' onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className='mb-4 text-sm text-gray-400 hover:text-gray-200'>{state === 'Sign Up' ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}</button>

          <button className='w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2.5 rounded-full hover:from-blue-600 hover:to-purple-600 mb-4'>
            {state === 'Sign Up' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>

        </form>

      </div>
    </div>
  )
}


export default Login
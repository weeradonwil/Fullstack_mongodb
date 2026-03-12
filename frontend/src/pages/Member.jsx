import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'

import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Member = () => {

    const navigate = useNavigate()

    const { isLoggedIn, userData, logout, isLoading } = useContext(AppContext)

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            navigate("/login")
        }
    }, [isLoading, isLoggedIn, navigate])

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>กำลังโหลดข้อมูลผู้ใช้...</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Member Page</h1>
            <p>{userData?.name}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Member
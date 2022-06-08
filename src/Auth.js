import React, { useState } from 'react'

const Auth = () => {
    const [userName, setUserName] = useState('')
    const [Email, setEmail] = useState('')

    const Set = (user, email) => {
        setUserName(user)
        setUserName(email)
    }

    const GetUser = () => {
        return {userName, Email}
    }
}

export default Auth
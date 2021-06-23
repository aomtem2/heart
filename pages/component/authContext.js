import { useState, useEffect } from "react";
import { createContext } from "react";
import { useRouter } from 'next/router'

const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    toggle: () => { },
    collapsed: false,
    authReady: false
})

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [collapsed, toggleCollapsed] = useState(false);
    const router = useRouter()

    useEffect(() => {

    }, [])

    const login = (token) => {
        setUser(token)
        user ? console.log(user) : ''
    }

    const logout = () => {
        setUser(null)
        console.log(user)
    }

    const toggle = () => {
        toggleCollapsed(!collapsed)
    }

    const context = { user, login, logout, toggle, collapsed }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
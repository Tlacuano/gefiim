import { useEffect, useReducer } from "react"
import { AuthContext } from "./AuthContext"
import { authReducer } from "./authReducer"


const init = () => {
    return JSON.parse(localStorage.getItem('auth')) || { logged: false }
}


export const AuthProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer( authReducer, {}, init )

    const login = (username, token, role) => {
        const action = {
            type: 'LOGIN',
            payload: {
                username,
                token,
                role
            }
        }

        localStorage.setItem('auth', JSON.stringify(action))
        dispatch(action)
    }

    const logout = () => {
        const action = {
            type: 'LOGOUT'
        }

        localStorage.removeItem('auth')
        dispatch(action)
    }

    return (
        <AuthContext.Provider value={{
            login: login,
            logout: logout,
            logged: state.logged,
            username: state.authInformation?.username,
            token: state.authInformation?.token,
            role: state.authInformation?.role
        }}>
            {children}
        </AuthContext.Provider>
    )
}
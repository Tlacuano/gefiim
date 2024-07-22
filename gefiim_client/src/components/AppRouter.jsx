import { Routes, Route } from "react-router-dom"
import { Stadistics } from "../modules"
import { ProfileCandidate } from "../modules"
import { AuthRoutes } from "../modules"
import { LandingAdmin } from "../modules/admin/pages/landing/LandingAdmin"
import { useEffect } from "react"
import axios from "../config/http-clientt.gateway"
import { textColor } from "../utils/functions/getContrast"
import { ToastWarning } from "./SweetAlertToast"

export const AppRouter = ({ role }) => {

    const getInstitutionalInformation = async () => {
        try {
            const response = await axios.doGet('/institutional-information/get-institutional-information')

            const textColorPrimary = textColor(response.data.primary_color)
            response.data.textColorPrimary = textColorPrimary

            document.documentElement.style.setProperty('--primary-color', response.data.primary_color)
            document.documentElement.style.setProperty('--secondary-color', response.data.secondary_color)
            document.documentElement.style.setProperty('--text-color-primary', textColorPrimary)
            
            // Cambiar el logo de la pestaña
            const link = document.querySelector("link[rel*='icon']")
            const logo = 'data:image/png;base64,' + response.data.logo
            link.href = logo

            // cambiarr el titulo de la pestaña
            document.title = response.data.name + ' - Registro de candidatos'

            localStorage.setItem('institutionalInformation', JSON.stringify(response.data))

        } catch (error) {
            ToastWarning(error.response.data.message)
        }
    }

    useEffect(() => {
        getInstitutionalInformation()
    }, [])


    if (role !== "ADMIN" && role !== "CANDIDATE") {
        return <AuthRoutes />
    }

    return (
        <Routes>
            <Route path="/*" element={role === "ADMIN" ? <LandingAdmin /> : <ProfileCandidate />} />
        </Routes>
    )
}

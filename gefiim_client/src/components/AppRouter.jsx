import { Routes, Route } from "react-router-dom"
import { Stadistics } from "../modules"
import { ProfileCandidate } from "../modules"
import { AuthRoutes } from "../modules"
import { LandingAdmin } from "../modules/admin/pages/landing/LandingAdmin"

export const AppRouter = ({role}) => {

    if (role !== "ADMIN" && role !== "CANDIDATE") {
        return <AuthRoutes/>
    }

    return (
        <Routes>
            <Route path="/*" element={role === "ADMIN" ? <LandingAdmin/> : <ProfileCandidate/>} />
        </Routes>        
    )
}
